import { addDays, isValidIsoDate, normalizeAndMergeRanges } from '../../shared/dateUtils';
import type { UnavailableRange } from '../../shared/types';

export class InvalidIcalFeedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidIcalFeedError';
  }
}

export interface ParsedIcalEvent {
  uid?: string;
  summary?: string;
  status?: string;
  transp?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD (exclusive checkout date)
  isAllDay: boolean;
}

export interface ParsedIcalResult {
  events: ParsedIcalEvent[];
  unavailableRanges: UnavailableRange[];
}

/**
 * Desdobra linhas continuadas conforme RFC 5545 Seção 3.1 (CRLF ou LF seguido por espaço ou tab).
 */
export function unfoldIcalLines(rawIcs: string): string[] {
  const unfolded = rawIcs.replace(/\r?\n[ \t]/g, '');
  return unfolded
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Converte um valor de propriedade de data/hora iCalendar (DTSTART ou DTEND) para YYYY-MM-DD
 * sem deslocar datas de dia inteiro por causa do fuso horário.
 */
export function parseIcalDateValue(
  rawValue: string,
  params: Record<string, string>,
  propertyTimezone = 'America/Fortaleza'
): { isoDate: string; isAllDay: boolean } | null {
  const cleanVal = rawValue.trim();

  // Caso 1: Data pura de dia inteiro (YYYYMMDD) ou parâmetro VALUE=DATE
  const dateOnlyMatch = cleanVal.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (dateOnlyMatch || params['VALUE']?.toUpperCase() === 'DATE') {
    const m = cleanVal.match(/^(\d{4})(\d{2})(\d{2})/);
    if (!m) return null;
    const isoDate = `${m[1]}-${m[2]}-${m[3]}`;
    if (!isValidIsoDate(isoDate)) return null;
    return { isoDate, isAllDay: true };
  }

  // Caso 2: Data e hora (YYYYMMDDTHHMMSS ou YYYYMMDDTHHMMSSZ)
  const dateTimeMatch = cleanVal.match(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/i
  );
  if (!dateTimeMatch) {
    return null;
  }

  const [, yearStr, monthStr, dayStr, hourStr, minStr, secStr, zFlag] = dateTimeMatch;
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  const hour = Number(hourStr);
  const min = Number(minStr);
  const sec = Number(secStr);

  // Valida se a data base existe no calendário
  const baseIso = `${yearStr}-${monthStr}-${dayStr}`;
  if (!isValidIsoDate(baseIso)) {
    return null;
  }

  // Se for um instante UTC (terminado em Z), convertemos para o fuso horário da propriedade (ou TZID informado)
  if (zFlag) {
    const targetTz = params['TZID'] || propertyTimezone;
    const utcInstant = new Date(Date.UTC(year, month - 1, day, hour, min, sec));
    try {
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: targetTz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).formatToParts(utcInstant);

      const y = parts.find((p) => p.type === 'year')?.value;
      const mo = parts.find((p) => p.type === 'month')?.value;
      const d = parts.find((p) => p.type === 'day')?.value;

      if (y && mo && d) {
        const converted = `${y}-${mo}-${d}`;
        if (isValidIsoDate(converted)) {
          return { isoDate: converted, isAllDay: false };
        }
      }
    } catch {
      // Fallback caso o TZID do evento seja inválido ou desconhecido no runtime: usa America/Fortaleza (UTC-3)
      const fallbackInstant = new Date(utcInstant.getTime() - 3 * 3600_000);
      const y = fallbackInstant.getUTCFullYear();
      const mo = String(fallbackInstant.getUTCMonth() + 1).padStart(2, '0');
      const d = String(fallbackInstant.getUTCDate()).padStart(2, '0');
      return { isoDate: `${y}-${mo}-${d}`, isAllDay: false };
    }
  }

  // Caso 3: Data-hora local ("floating" ou já expressa no TZID local da propriedade)
  // Mantemos o dia civil diretamente sem deslocamento UTC.
  return { isoDate: baseIso, isAllDay: false };
}

/**
 * Interpreta uma duração ISO 8601 básica de iCalendar (ex: P1D, P5D, P2W) em dias inteiros.
 */
function parseDurationDays(durationStr: string): number | null {
  const weeksMatch = durationStr.trim().match(/^P(\d+)W$/i);
  if (weeksMatch) {
    return Number(weeksMatch[1]) * 7;
  }
  const daysMatch = durationStr.trim().match(/^P(\d+)D$/i);
  if (daysMatch) {
    return Number(daysMatch[1]);
  }
  return null;
}

/**
 * Divide uma linha de propriedade iCalendar (ex: `DTSTART;VALUE=DATE:20261110`)
 * em nome da propriedade, mapa de parâmetros e valor.
 */
function parsePropertyLine(line: string): {
  name: string;
  params: Record<string, string>;
  value: string;
} | null {
  const colonIdx = line.indexOf(':');
  if (colonIdx <= 0) return null;

  const left = line.slice(0, colonIdx);
  const value = line.slice(colonIdx + 1);

  const segments = left.split(';');
  const name = segments[0].toUpperCase().trim();
  const params: Record<string, string> = {};

  for (let i = 1; i < segments.length; i++) {
    const eqIdx = segments[i].indexOf('=');
    if (eqIdx > 0) {
      const paramKey = segments[i].slice(0, eqIdx).toUpperCase().trim();
      const paramVal = segments[i]
        .slice(eqIdx + 1)
        .replace(/^"|"$/g, '')
        .trim();
      params[paramKey] = paramVal;
    }
  }

  return { name, params, value };
}

/**
 * Faz o parse completo de um conteúdo iCalendar (.ics), validando integridade estrutural,
 * extraindo eventos ativos e normalizando intervalos indisponíveis com checkout exclusivo.
 */
export function parseIcalFeed(
  rawIcs: string,
  propertyTimezone = 'America/Fortaleza'
): ParsedIcalResult {
  if (!rawIcs || typeof rawIcs !== 'string') {
    throw new InvalidIcalFeedError('Conteúdo iCal vazio ou inválido.');
  }

  const trimmed = rawIcs.trim();
  if (!trimmed.includes('BEGIN:VCALENDAR') || !trimmed.includes('END:VCALENDAR')) {
    throw new InvalidIcalFeedError(
      'Feed iCal malformado: delimitadores VCALENDAR ausentes.'
    );
  }

  const lines = unfoldIcalLines(trimmed);
  const events: ParsedIcalEvent[] = [];

  let inEvent = false;
  let currentProps: Array<{
    name: string;
    params: Record<string, string>;
    value: string;
  }> = [];

  for (const line of lines) {
    const upper = line.toUpperCase();
    if (upper === 'BEGIN:VEVENT') {
      if (inEvent) {
        throw new InvalidIcalFeedError('Feed iCal malformado: VEVENT aninhado detectado.');
      }
      inEvent = true;
      currentProps = [];
      continue;
    }

    if (upper === 'END:VEVENT') {
      if (!inEvent) {
        throw new InvalidIcalFeedError('Feed iCal malformado: END:VEVENT sem BEGIN:VEVENT.');
      }
      inEvent = false;

      const parsedEvent = buildEventFromProps(currentProps, propertyTimezone);
      if (parsedEvent) {
        events.push(parsedEvent);
      }
      currentProps = [];
      continue;
    }

    if (inEvent) {
      const prop = parsePropertyLine(line);
      if (prop) {
        currentProps.push(prop);
      }
    }
  }

  if (inEvent) {
    throw new InvalidIcalFeedError('Feed iCal truncado: VEVENT não foi encerrado.');
  }

  const rawRanges: UnavailableRange[] = events.map((ev) => ({
    startDate: ev.startDate,
    endDate: ev.endDate,
  }));

  const unavailableRanges = normalizeAndMergeRanges(rawRanges);

  return {
    events,
    unavailableRanges,
  };
}

function buildEventFromProps(
  props: Array<{ name: string; params: Record<string, string>; value: string }>,
  propertyTimezone: string
): ParsedIcalEvent | null {
  const dtStartProp = props.find((p) => p.name === 'DTSTART');
  if (!dtStartProp) {
    return null;
  }

  const statusProp = props.find((p) => p.name === 'STATUS');
  const status = statusProp?.value.toUpperCase().trim();
  if (status === 'CANCELLED') {
    return null;
  }

  const transpProp = props.find((p) => p.name === 'TRANSP');
  const transp = transpProp?.value.toUpperCase().trim();
  if (transp === 'TRANSPARENT') {
    return null;
  }

  const startParsed = parseIcalDateValue(
    dtStartProp.value,
    dtStartProp.params,
    propertyTimezone
  );
  if (!startParsed) {
    return null;
  }

  const dtEndProp = props.find((p) => p.name === 'DTEND');
  const durationProp = props.find((p) => p.name === 'DURATION');

  let endDate: string | null = null;

  if (dtEndProp) {
    const endParsed = parseIcalDateValue(
      dtEndProp.value,
      dtEndProp.params,
      propertyTimezone
    );
    if (!endParsed) {
      return null;
    }
    endDate = endParsed.isoDate;
  } else if (durationProp) {
    const durationDays = parseDurationDays(durationProp.value);
    if (durationDays && durationDays > 0) {
      endDate = addDays(startParsed.isoDate, durationDays);
    }
  } else if (startParsed.isAllDay) {
    // Pela RFC 5545, um VEVENT com DTSTART;VALUE=DATE sem DTEND nem DURATION dura 1 dia.
    endDate = addDays(startParsed.isoDate, 1);
  }

  if (!endDate || endDate <= startParsed.isoDate) {
    return null;
  }

  const uid = props.find((p) => p.name === 'UID')?.value;
  const summary = props.find((p) => p.name === 'SUMMARY')?.value;

  return {
    uid,
    summary,
    status,
    transp,
    startDate: startParsed.isoDate,
    endDate,
    isAllDay: startParsed.isAllDay,
  };
}
