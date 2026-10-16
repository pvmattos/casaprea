import {
  addDays,
  diffInDays,
  getTodayIsoInTimezone,
  isValidIsoDate,
  MAX_QUERY_DAYS,
} from '../shared/dateUtils';
import {
  buildAvailabilityResponse,
  getStoredAvailabilityData,
  getStoredSyncState,
  syncAvailabilityCalendar,
  type WorkerEnv,
} from './ical/sync';

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data: https://a0.muscache.com https://ugc.production.linktr.ee; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self';",
};

// Rate limiter leve por isolate para endpoints públicos de API (máx. 60 req/min por IP)
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;

export function resetRateLimiterForTests(): void {
  rateLimitMap.clear();
}

function checkRateLimit(clientIp: string, nowMs = Date.now()): boolean {
  if (rateLimitMap.size > 1000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (nowMs - v.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(k);
      }
    }
  }
  const entry = rateLimitMap.get(clientIp);
  if (!entry || nowMs - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(clientIp, { count: 1, windowStart: nowMs });
    return true;
  }
  entry.count += 1;
  return entry.count <= RATE_LIMIT_MAX_REQUESTS;
}

/**
 * Comparação em tempo constante para tokens administrativos.
 */
function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length || a.length === 0) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function jsonResponse(
  body: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...SECURITY_HEADERS,
      ...extraHeaders,
    },
  });
}

/**
 *Verifica se já passou o intervalo mínimo de cooldown desde a última tentativa de sincronização,
 * impedindo que requisições públicas disparem sincronizações externas repetidamente.
 */
function canTriggerOpportunisticSync(
  lastAttemptAt: string | null,
  syncIntervalMinutes: number,
  now = new Date()
): boolean {
  if (!lastAttemptAt) return true;
  const lastMs = Date.parse(lastAttemptAt);
  if (!Number.isFinite(lastMs)) return true;
  const elapsedMinutes = (now.getTime() - lastMs) / 60_000;
  return elapsedMinutes >= syncIntervalMinutes;
}

export async function handleApiRequest(
  request: Request,
  env: WorkerEnv,
  ctx?: Pick<ExecutionContext, 'waitUntil'>,
  options: { now?: Date; fetchImpl?: typeof fetch } = {}
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const now = options.now ?? new Date();

  const clientIp =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'local-client';

  if (!checkRateLimit(clientIp, now.getTime())) {
    return jsonResponse(
      {
        error: 'Muitas requisições. Aguarde alguns instantes e tente novamente.',
      },
      429,
      { 'Retry-After': '60', 'Cache-Control': 'no-store' }
    );
  }

  // 1. Endpoint público de consulta de disponibilidade
  if (path === '/api/availability') {
    if (request.method !== 'GET') {
      return jsonResponse(
        { error: 'Método não permitido. Utilize GET.' },
        405,
        { Allow: 'GET', 'Cache-Control': 'no-store' }
      );
    }

    const tz = env.PROPERTY_TIMEZONE || 'America/Fortaleza';
    const defaultStart = getTodayIsoInTimezone(tz, now);
    const defaultEnd = addDays(defaultStart, 180);

    const startParam = url.searchParams.get('start') ?? defaultStart;
    const endParam = url.searchParams.get('end') ?? defaultEnd;

    if (!isValidIsoDate(startParam) || !isValidIsoDate(endParam)) {
      return jsonResponse(
        {
          error:
            'Parâmetros de data inválidos. Utilize o formato estrito YYYY-MM-DD para start e end.',
        },
        400,
        { 'Cache-Control': 'no-store' }
      );
    }

    if (endParam < startParam) {
      return jsonResponse(
        {
          error: 'O parâmetro end deve ser igual ou posterior ao parâmetro start.',
        },
        400,
        { 'Cache-Control': 'no-store' }
      );
    }

    const totalDays = diffInDays(startParam, endParam);
    if (totalDays > MAX_QUERY_DAYS) {
      return jsonResponse(
        {
          error: `O intervalo máximo permitido para consulta é de ${MAX_QUERY_DAYS} dias.`,
        },
        400,
        { 'Cache-Control': 'no-store' }
      );
    }

    // Sincronização inicial/oportunista protegida por cooldown + KV lock:
    // Se a URL secreta estiver configurada e o cooldown de 15 min já tiver expirado,
    // atualiza em primeiro plano (se ainda não houver dados) ou em background via waitUntil.
    const kv = env.AVAILABILITY_KV;
    const hasSecret = Boolean(env.AIRBNB_ICAL_URL?.trim());
    const syncIntervalMinutes = Number(env.SYNC_INTERVAL_MINUTES) || 15;

    if (kv && hasSecret) {
      const [existingData, existingState] = await Promise.all([
        getStoredAvailabilityData(kv),
        getStoredSyncState(kv),
      ]);

      const shouldSync = canTriggerOpportunisticSync(
        existingState?.lastAttemptAt ?? existingData?.syncedAt ?? null,
        syncIntervalMinutes,
        now
      );

      if (shouldSync) {
        if (!existingData) {
          // Primeira sincronização (cold bootstrap): aguarda para já entregar dados reais
          await syncAvailabilityCalendar(env, {
            now,
            fetchImpl: options.fetchImpl,
          });
        } else if (ctx?.waitUntil) {
          // Já há dados em cache, mas passou do intervalo: sincroniza em background sem bloquear o visitante
          ctx.waitUntil(
            syncAvailabilityCalendar(env, {
              now,
              fetchImpl: options.fetchImpl,
            })
          );
        }
      }
    }

    const payload = await buildAvailabilityResponse(env, startParam, endParam, now);

    const cacheControl =
      payload.hasReliableData && !payload.isStale
        ? 'public, max-age=60, s-maxage=120, stale-while-revalidate=300'
        : 'no-store';

    return jsonResponse(payload, 200, { 'Cache-Control': cacheControl });
  }

  // 2. Endpoint administrativo protegido para sincronização manual
  if (path === '/api/admin/sync') {
    if (request.method !== 'POST') {
      return jsonResponse(
        { error: 'Método não permitido. Utilize POST.' },
        405,
        { Allow: 'POST', 'Cache-Control': 'no-store' }
      );
    }

    const expectedToken = env.ADMIN_SYNC_TOKEN?.trim();
    if (!expectedToken) {
      return jsonResponse(
        {
          error:
            'Endpoint administrativo desabilitado: ADMIN_SYNC_TOKEN não configurado no ambiente.',
        },
        503,
        { 'Cache-Control': 'no-store' }
      );
    }

    const authHeader = request.headers.get('Authorization') || '';
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    const providedToken = match?.[1]?.trim() || '';

    if (!timingSafeEqualString(providedToken, expectedToken)) {
      return jsonResponse(
        { error: 'Não autorizado. Token administrativo inválido ou ausente.' },
        401,
        { 'Cache-Control': 'no-store' }
      );
    }

    const outcome = await syncAvailabilityCalendar(env, {
      force: true,
      now,
      fetchImpl: options.fetchImpl,
    });

    return jsonResponse(
      {
        ok: outcome.ok,
        status: outcome.status,
        syncedAt: outcome.syncedAt,
        eventCount: outcome.eventCount ?? 0,
        rangeCount: outcome.rangeCount ?? 0,
        error: outcome.error ?? null,
      },
      outcome.ok ? 200 : 502,
      { 'Cache-Control': 'no-store' }
    );
  }

  // 3. Endpoint de saúde operacional (sem expor segredos ou URLs privadas)
  if (path === '/api/health') {
    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Método não permitido.' }, 405, {
        Allow: 'GET',
        'Cache-Control': 'no-store',
      });
    }

    const kv = env.AVAILABILITY_KV;
    const state = kv ? await getStoredSyncState(kv) : null;
    const data = kv ? await getStoredAvailabilityData(kv) : null;

    return jsonResponse(
      {
        ok: true,
        environment: env.ENVIRONMENT || 'production',
        configured: {
          icalSecret: Boolean(env.AIRBNB_ICAL_URL?.trim()),
          kvNamespace: Boolean(kv),
          adminToken: Boolean(env.ADMIN_SYNC_TOKEN?.trim()),
        },
        sync: {
          status: state?.lastStatus ?? (data ? 'ok' : 'uninitialized'),
          lastSyncedAt: data?.syncedAt ?? null,
          lastAttemptAt: state?.lastAttemptAt ?? null,
          consecutiveFailures: state?.consecutiveFailures ?? 0,
          hasReliableData: Boolean(data),
        },
      },
      200,
      { 'Cache-Control': 'no-store' }
    );
  }

  return jsonResponse(
    { error: 'Endpoint de API não encontrado.' },
    404,
    { 'Cache-Control': 'no-store' }
  );
}

export default {
  async fetch(
    request: Request,
    env: WorkerEnv,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env, ctx);
    }

    if (env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      const headers = new Headers(assetResponse.headers);
      for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
        if (!headers.has(k)) {
          headers.set(k, v);
        }
      }
      return new Response(assetResponse.body, {
        status: assetResponse.status,
        statusText: assetResponse.statusText,
        headers,
      });
    }

    return new Response('Casa na Areia Preá Worker', {
      status: 200,
      headers: SECURITY_HEADERS,
    });
  },

  async scheduled(
    _controller: ScheduledController,
    env: WorkerEnv,
    ctx: ExecutionContext
  ): Promise<void> {
    ctx.waitUntil(
      syncAvailabilityCalendar(env).then((outcome) => {
        if (!outcome.ok && outcome.status !== 'unconfigured') {
          console.error(
            `[Scheduled Sync] Falha na sincronização periódica: status=${outcome.status}, erro=${outcome.error}`
          );
        }
      })
    );
  },
};
