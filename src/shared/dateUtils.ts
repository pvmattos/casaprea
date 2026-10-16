import type { UnavailableRange } from './types';

const ISO_DATE_REGEX = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const MAX_GUESTS = 14;
export const MIN_GUESTS = 1;
export const MAX_QUERY_DAYS = 366;

/**
 * Valida se uma string está no formato estrito YYYY-MM-DD e representa uma data real do calendário
 * (ex: rejeita 2026-02-30). Opera puramente em UTC sem deslocamento por fuso horário local.
 */
export function isValidIsoDate(dateStr: string): boolean {
  if (!ISO_DATE_REGEX.test(dateStr)) {
    return false;
  }
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const utcDate = new Date(Date.UTC(year, month - 1, day));
  return (
    utcDate.getUTCFullYear() === year &&
    utcDate.getUTCMonth() === month - 1 &&
    utcDate.getUTCDate() === day
  );
}

/**
 * Converte uma string YYYY-MM-DD válida para timestamp em milissegundos à meia-noite UTC.
 */
export function isoDateToUtcMs(dateStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

/**
 * Converte um timestamp UTC em milissegundos para string YYYY-MM-DD.
 */
export function utcMsToIsoDate(ms: number): string {
  const d = new Date(ms);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Adiciona (ou subtrai) dias de uma data YYYY-MM-DD de forma imune a fuso horário e horário de verão.
 */
export function addDays(dateStr: string, days: number): string {
  const ms = isoDateToUtcMs(dateStr);
  return utcMsToIsoDate(ms + days * 86_400_000);
}

/**
 * Calcula a diferença em dias (noites) entre duas datas YYYY-MM-DD (endDate - startDate).
 */
export function diffInDays(startDate: string, endDate: string): number {
  const startMs = isoDateToUtcMs(startDate);
  const endMs = isoDateToUtcMs(endDate);
  return Math.round((endMs - startMs) / 86_400_000);
}

/**
 * Retorna a data de hoje (YYYY-MM-DD) no fuso horário da propriedade (America/Fortaleza por padrão).
 */
export function getTodayIsoInTimezone(timeZone = 'America/Fortaleza', now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;

  if (year && month && day) {
    return `${year}-${month}-${day}`;
  }
  return utcMsToIsoDate(now.getTime());
}

/**
 * Semântica de hospedagem iCalendar (intervalo semiaberto [startDate, endDate)):
 * - Uma noite `dateStr` está ocupada se e somente se `range.startDate <= dateStr < range.endDate`.
 * - A data `range.endDate` (dia de checkout às 12h) NÃO bloqueia a noite de `range.endDate`,
 *   permitindo novo check-in nesse mesmo dia (após as 14h).
 */
export function isNightOccupied(dateStr: string, unavailableRanges: UnavailableRange[]): boolean {
  for (const range of unavailableRanges) {
    if (dateStr >= range.startDate && dateStr < range.endDate) {
      return true;
    }
  }
  return false;
}

/**
 * Verifica se uma data pode ser selecionada como CHECK-IN:
 * - Não pode ser anterior a hoje (`minDate`).
 * - A noite da data escolhida não pode estar ocupada.
 */
export function isDateAvailableForCheckIn(
  dateStr: string,
  unavailableRanges: UnavailableRange[],
  minDate?: string
): boolean {
  if (!isValidIsoDate(dateStr)) return false;
  if (minDate && dateStr < minDate) return false;
  return !isNightOccupied(dateStr, unavailableRanges);
}

/**
 * Verifica se um intervalo [checkIn, checkOut) se sobrepõe a qualquer período indisponível [startDate, endDate).
 * Dois intervalos semiabertos [A, B) e [C, D) se interceptam se e somente se A < D e C < B.
 * Isso garante automaticamente que:
 * - `checkOut === range.startDate` é VÁLIDO (hóspede faz checkout na manhã em que outra reserva faz check-in).
 * - `checkIn === range.endDate` é VÁLIDO (hóspede faz check-in na tarde do dia em que a reserva anterior saiu).
 */
export function doesStayOverlapUnavailable(
  checkIn: string,
  checkOut: string,
  unavailableRanges: UnavailableRange[]
): boolean {
  for (const range of unavailableRanges) {
    if (checkIn < range.endDate && range.startDate < checkOut) {
      return true;
    }
  }
  return false;
}

/**
 * Verifica se uma data pode ser selecionada como CHECKOUT dado um `checkIn` já escolhido.
 */
export function isDateAvailableForCheckOut(
  checkIn: string,
  candidateCheckOut: string,
  unavailableRanges: UnavailableRange[]
): boolean {
  if (!isValidIsoDate(checkIn) || !isValidIsoDate(candidateCheckOut)) return false;
  if (candidateCheckOut <= checkIn) return false;
  return !doesStayOverlapUnavailable(checkIn, candidateCheckOut, unavailableRanges);
}

/**
 * Retorna a primeira data ocupada após `checkIn`.
 * Essa data pode ser usada como data limite de checkout (exclusiva), mas nenhuma data posterior a ela pode ser escolhida.
 */
export function getFirstBlockedNightAfterCheckIn(
  checkIn: string,
  unavailableRanges: UnavailableRange[]
): string | null {
  let earliest: string | null = null;
  for (const range of unavailableRanges) {
    if (range.startDate > checkIn) {
      if (!earliest || range.startDate < earliest) {
        earliest = range.startDate;
      }
    } else if (range.startDate <= checkIn && range.endDate > checkIn) {
      return checkIn;
    }
  }
  return earliest;
}

/**
 * Normaliza, ordena e mescla intervalos indisponíveis sobrepostos ou adjacentes.
 * Como os intervalos são semiabertos [startDate, endDate), se [A, B) e [B, C) existem,
 * todas as noites de A até C-1 estão ocupadas, logo o intervalo consolidado é [A, C).
 */
export function normalizeAndMergeRanges(ranges: UnavailableRange[]): UnavailableRange[] {
  const valid = ranges.filter(
    (r) => isValidIsoDate(r.startDate) && isValidIsoDate(r.endDate) && r.startDate < r.endDate
  );

  if (valid.length === 0) return [];

  const sorted = [...valid].sort((a, b) =>
    a.startDate !== b.startDate
      ? a.startDate.localeCompare(b.startDate)
      : a.endDate.localeCompare(b.endDate)
  );

  const merged: UnavailableRange[] = [{ ...sorted[0] }];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current.startDate <= last.endDate) {
      if (current.endDate > last.endDate) {
        last.endDate = current.endDate;
      }
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}

/**
 * Filtra os intervalos indisponíveis que interceptam a janela consultada [queryStart, queryEnd].
 */
export function filterRangesInWindow(
  ranges: UnavailableRange[],
  queryStart: string,
  queryEnd: string
): UnavailableRange[] {
  return ranges.filter((r) => r.startDate <= queryEnd && r.endDate > queryStart);
}

/**
 * Valida a quantidade de hóspedes (inteiro entre 1 e 14).
 */
export function validateGuestCount(guests: number): { valid: boolean; error?: string } {
  if (!Number.isInteger(guests)) {
    return { valid: false, error: 'A quantidade de hóspedes deve ser um número inteiro.' };
  }
  if (guests < MIN_GUESTS) {
    return { valid: false, error: `Informe pelo menos ${MIN_GUESTS} hóspede.` };
  }
  if (guests > MAX_GUESTS) {
    return {
      valid: false,
      error: `A Casa na Areia Preá comporta até ${MAX_GUESTS} hóspedes.`,
    };
  }
  return { valid: true };
}

/**
 * Valida uma consulta completa de reserva (check-in, checkout, hóspedes e disponibilidade).
 */
export function validateStaySelection(params: {
  checkIn: string;
  checkOut: string;
  guests: number;
  unavailableRanges: UnavailableRange[];
  minDate?: string;
}): { valid: boolean; nights: number; error?: string } {
  const { checkIn, checkOut, guests, unavailableRanges, minDate } = params;

  if (!checkIn || !isValidIsoDate(checkIn)) {
    return { valid: false, nights: 0, error: 'Selecione uma data de check-in válida.' };
  }
  if (!checkOut || !isValidIsoDate(checkOut)) {
    return { valid: false, nights: 0, error: 'Selecione uma data de checkout válida.' };
  }
  if (minDate && checkIn < minDate) {
    return { valid: false, nights: 0, error: 'A data de check-in não pode estar no passado.' };
  }
  if (checkOut <= checkIn) {
    return {
      valid: false,
      nights: 0,
      error: 'A data de checkout deve ser posterior à data de check-in.',
    };
  }

  const guestValidation = validateGuestCount(guests);
  if (!guestValidation.valid) {
    return { valid: false, nights: 0, error: guestValidation.error };
  }

  if (doesStayOverlapUnavailable(checkIn, checkOut, unavailableRanges)) {
    return {
      valid: false,
      nights: 0,
      error: 'O período selecionado inclui noites indisponíveis no calendário.',
    };
  }

  const nights = diffInDays(checkIn, checkOut);
  return { valid: true, nights };
}

/**
 * Formata uma data YYYY-MM-DD para exibição em português brasileiro (ex: "15 de nov. de 2026" ou "15/11/2026").
 */
export function formatDisplayDatePtBr(
  dateStr: string,
  style: 'short' | 'long' = 'short'
): string {
  if (!isValidIsoDate(dateStr)) return dateStr;
  const [year, month, day] = dateStr.split('-').map(Number);
  if (style === 'short') {
    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
  }
  const months = [
    'jan.',
    'fev.',
    'mar.',
    'abr.',
    'mai.',
    'jun.',
    'jul.',
    'ago.',
    'set.',
    'out.',
    'nov.',
    'dez.',
  ];
  return `${day} de ${months[month - 1]} de ${year}`;
}
