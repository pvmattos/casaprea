import type {
  AvailabilityApiResponse,
  StoredAvailabilityData,
  StoredSyncState,
  SyncStatus,
} from '../../shared/types';
import { filterRangesInWindow } from '../../shared/dateUtils';
import { parseIcalFeed } from './parser';

export const KV_KEYS = {
  AVAILABILITY_DATA: 'availability:data',
  SYNC_STATE: 'availability:sync_state',
  SYNC_LOCK: 'availability:lock',
} as const;

export interface WorkerEnv {
  AVAILABILITY_KV?: KVNamespace;
  ASSETS?: Fetcher;
  AIRBNB_ICAL_URL?: string;
  ADMIN_SYNC_TOKEN?: string;
  ENVIRONMENT?: string;
  SYNC_INTERVAL_MINUTES?: string;
  STALE_THRESHOLD_MINUTES?: string;
  ICAL_FETCH_TIMEOUT_MS?: string;
  ICAL_MAX_BYTES?: string;
  PROPERTY_TIMEZONE?: string;
}

export interface SyncOutcome {
  ok: boolean;
  skipped?: boolean;
  status: SyncStatus;
  syncedAt: string | null;
  eventCount?: number;
  rangeCount?: number;
  error?: string;
}

/**
 * Remove qualquer ocorrência da URL privada do iCal, tokens ou URLs genéricas de mensagens de erro/logs.
 */
export function sanitizeErrorMessage(rawMessage: string, secretUrl?: string): string {
  let msg = rawMessage || 'Erro desconhecido na sincronização.';
  if (secretUrl && secretUrl.trim().length > 0) {
    msg = msg.split(secretUrl.trim()).join('[REDACTED_ICAL_URL]');
  }
  // Remove qualquer URL http(s)://... que possa estar embutida em mensagens de erro de fetch
  msg = msg.replace(/https?:\/\/[^\s"'<>]+/gi, '[REDACTED_URL]');
  return msg.slice(0, 240);
}

/**
 * Gera um hash simples determinístico (FNV-1a 32-bit hex) para identificar alterações no feed normalizado.
 */
function computeSimpleHash(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * Lê o corpo da resposta HTTP com limite estrito de bytes para proteção contra respostas excessivamente grandes.
 */
async function readResponseTextWithLimit(
  response: Response,
  maxBytes: number
): Promise<string> {
  const contentLengthHeader = response.headers.get('content-length');
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader);
    if (Number.isFinite(contentLength) && contentLength > maxBytes) {
      throw new Error(`O tamanho do feed iCal excede o limite permitido (${maxBytes} bytes).`);
    }
  }

  if (!response.body) {
    const text = await response.text();
    if (new TextEncoder().encode(text).byteLength > maxBytes) {
      throw new Error(`O tamanho do feed iCal excede o limite permitido (${maxBytes} bytes).`);
    }
    return text;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.byteLength;
        if (totalBytes > maxBytes) {
          await reader.cancel();
          throw new Error(
            `O tamanho do feed iCal excede o limite máximo de segurança (${maxBytes} bytes).`
          );
        }
        chunks.push(value);
      }
    }
  } finally {
    reader.releaseLock();
  }

  const combined = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder('utf-8').decode(combined);
}

/**
 * Executa a sincronização do calendário iCal do Airbnb com proteção contra concorrência,
 * validação estrita e preservação dos últimos dados válidos em caso de falha.
 */
export async function syncAvailabilityCalendar(
  env: WorkerEnv,
  options: {
    force?: boolean;
    now?: Date;
    fetchImpl?: typeof fetch;
  } = {}
): Promise<SyncOutcome> {
  const now = options.now ?? new Date();
  const nowIso = now.toISOString();
  const fetchFn = options.fetchImpl ?? fetch;
  const kv = env.AVAILABILITY_KV;
  const icalUrl = env.AIRBNB_ICAL_URL?.trim();

  if (!kv) {
    return {
      ok: false,
      status: 'unconfigured',
      syncedAt: null,
      error: 'Armazenamento KV (AVAILABILITY_KV) não configurado no ambiente.',
    };
  }

  const existingData = await getStoredAvailabilityData(kv);
  const existingState = await getStoredSyncState(kv);

  if (!icalUrl) {
    const unconfiguredState: StoredSyncState = {
      lastAttemptAt: nowIso,
      lastSuccessAt: existingState?.lastSuccessAt ?? existingData?.syncedAt ?? null,
      lastStatus: 'unconfigured',
      lastError: 'Variável secreta AIRBNB_ICAL_URL ainda não configurada.',
      consecutiveFailures: existingState?.consecutiveFailures ?? 0,
    };
    await kv.put(KV_KEYS.SYNC_STATE, JSON.stringify(unconfiguredState));
    return {
      ok: false,
      status: 'unconfigured',
      syncedAt: unconfiguredState.lastSuccessAt,
      error: unconfiguredState.lastError ?? undefined,
    };
  }

  // Proteção contra sincronizações concorrentes desnecessárias
  if (!options.force) {
    const activeLock = await kv.get(KV_KEYS.SYNC_LOCK);
    if (activeLock) {
      return {
        ok: true,
        skipped: true,
        status: existingState?.lastStatus ?? (existingData ? 'ok' : 'uninitialized'),
        syncedAt: existingData?.syncedAt ?? null,
      };
    }
  }

  // Registra lock com expiração curta (60 segundos, mínimo permitido pelo Cloudflare KV)
  await kv.put(KV_KEYS.SYNC_LOCK, nowIso, { expirationTtl: 60 });

  const timeoutMs = Number(env.ICAL_FETCH_TIMEOUT_MS) || 10_000;
  const maxBytes = Number(env.ICAL_MAX_BYTES) || 1_048_576;
  const propertyTimezone = env.PROPERTY_TIMEZONE || 'America/Fortaleza';

  try {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(icalUrl);
    } catch {
      throw new Error('A URL configurada em AIRBNB_ICAL_URL possui formato inválido.');
    }

    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      throw new Error('Protocolo inválido na URL do calendário iCal.');
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetchFn(icalUrl, {
        method: 'GET',
        headers: {
          Accept: 'text/calendar, text/plain;q=0.9, */*;q=0.1',
          'User-Agent': 'CasaNaAreiaPrea-AvailabilitySync/1.0 (Cloudflare-Workers)',
        },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      throw new Error(
        `Falha ao buscar feed iCal: status HTTP ${response.status}.`
      );
    }

    const rawIcs = await readResponseTextWithLimit(response, maxBytes);
    const parsed = parseIcalFeed(rawIcs, propertyTimezone);

    const serializedRanges = JSON.stringify(parsed.unavailableRanges);
    const newData: StoredAvailabilityData = {
      unavailableRanges: parsed.unavailableRanges,
      eventCount: parsed.events.length,
      syncedAt: nowIso,
      sourceHash: computeSimpleHash(serializedRanges),
    };

    const newState: StoredSyncState = {
      lastAttemptAt: nowIso,
      lastSuccessAt: nowIso,
      lastStatus: 'ok',
      lastError: null,
      consecutiveFailures: 0,
    };

    // Salva os novos dados válidos e atualiza o estado de sincronização
    await Promise.all([
      kv.put(KV_KEYS.AVAILABILITY_DATA, JSON.stringify(newData)),
      kv.put(KV_KEYS.SYNC_STATE, JSON.stringify(newState)),
      kv.delete(KV_KEYS.SYNC_LOCK),
    ]);

    return {
      ok: true,
      status: 'ok',
      syncedAt: nowIso,
      eventCount: parsed.events.length,
      rangeCount: parsed.unavailableRanges.length,
    };
  } catch (err) {
    const rawErrMessage =
      err instanceof Error
        ? err.name === 'AbortError'
          ? `Timeout ao consultar o feed iCal após ${timeoutMs}ms.`
          : err.message
        : String(err);

    const safeError = sanitizeErrorMessage(rawErrMessage, icalUrl);

    // IMPORTANTE: Não sobrescrevemos KV_KEYS.AVAILABILITY_DATA!
    // Os dados válidos anteriores são integralmente preservados.
    const failedState: StoredSyncState = {
      lastAttemptAt: nowIso,
      lastSuccessAt: existingState?.lastSuccessAt ?? existingData?.syncedAt ?? null,
      lastStatus: 'error',
      lastError: safeError,
      consecutiveFailures: (existingState?.consecutiveFailures ?? 0) + 1,
    };

    await Promise.all([
      kv.put(KV_KEYS.SYNC_STATE, JSON.stringify(failedState)),
      kv.delete(KV_KEYS.SYNC_LOCK),
    ]);

    return {
      ok: false,
      status: 'error',
      syncedAt: existingData?.syncedAt ?? null,
      error: safeError,
    };
  }
}

export async function getStoredAvailabilityData(
  kv: KVNamespace
): Promise<StoredAvailabilityData | null> {
  try {
    const raw = await kv.get(KV_KEYS.AVAILABILITY_DATA);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAvailabilityData;
  } catch {
    return null;
  }
}

export async function getStoredSyncState(
  kv: KVNamespace
): Promise<StoredSyncState | null> {
  try {
    const raw = await kv.get(KV_KEYS.SYNC_STATE);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSyncState;
  } catch {
    return null;
  }
}

/**
 * Monta a resposta pública da API de disponibilidade para o intervalo [start, end],
 * calculando se os dados estão desatualizados (isStale) ou se há dados confiáveis (hasReliableData).
 */
export async function buildAvailabilityResponse(
  env: WorkerEnv,
  start: string,
  end: string,
  now = new Date()
): Promise<AvailabilityApiResponse> {
  const syncIntervalMinutes = Number(env.SYNC_INTERVAL_MINUTES) || 15;
  const staleThresholdMinutes = Number(env.STALE_THRESHOLD_MINUTES) || 60;
  const kv = env.AVAILABILITY_KV;
  const hasIcalSecret = Boolean(env.AIRBNB_ICAL_URL?.trim());

  if (!kv) {
    return {
      query: { start, end },
      unavailableRanges: [],
      lastSyncedAt: null,
      lastAttemptAt: null,
      status: 'unconfigured',
      isStale: true,
      hasReliableData: false,
      syncIntervalMinutes,
      staleThresholdMinutes,
      message:
        'A sincronização automática de calendário ainda não está configurada. Consulte a disponibilidade diretamente pelos canais oficiais.',
    };
  }

  const [data, state] = await Promise.all([
    getStoredAvailabilityData(kv),
    getStoredSyncState(kv),
  ]);

  if (!data) {
    const status: SyncStatus = !hasIcalSecret
      ? 'unconfigured'
      : state?.lastStatus === 'error'
        ? 'error'
        : 'uninitialized';

    return {
      query: { start, end },
      unavailableRanges: [],
      lastSyncedAt: null,
      lastAttemptAt: state?.lastAttemptAt ?? null,
      status,
      isStale: true,
      hasReliableData: false,
      syncIntervalMinutes,
      staleThresholdMinutes,
      message:
        status === 'unconfigured'
          ? 'Calendário em fase de configuração. Consulte a disponibilidade diretamente pelo WhatsApp ou Airbnb.'
          : 'Sincronização inicial pendente ou indisponível no momento. Consulte diretamente pelos canais oficiais.',
    };
  }

  const syncedAtMs = Date.parse(data.syncedAt);
  const ageMinutes = Number.isFinite(syncedAtMs)
    ? (now.getTime() - syncedAtMs) / 60_000
    : Infinity;

  const isStale =
    ageMinutes > staleThresholdMinutes || state?.lastStatus === 'error';

  const filteredRanges = filterRangesInWindow(data.unavailableRanges, start, end);

  const effectiveStatus: SyncStatus =
    state?.lastStatus === 'error' ? 'error' : 'ok';

  return {
    query: { start, end },
    unavailableRanges: filteredRanges,
    lastSyncedAt: data.syncedAt,
    lastAttemptAt: state?.lastAttemptAt ?? data.syncedAt,
    status: effectiveStatus,
    isStale,
    hasReliableData: true,
    syncIntervalMinutes,
    staleThresholdMinutes,
    message: isStale
      ? 'Os dados do calendário podem não refletir alterações recentes. Confirme a disponibilidade diretamente pelos canais oficiais.'
      : undefined,
  };
}
