import { beforeEach, describe, expect, it } from 'vitest';
import { createMemoryKV } from '../src/worker/ical/memoryKv';
import {
  KV_KEYS,
  sanitizeErrorMessage,
  syncAvailabilityCalendar,
  type WorkerEnv,
} from '../src/worker/ical/sync';
import { handleApiRequest, resetRateLimiterForTests } from '../src/worker/index';
import type { AvailabilityApiResponse } from '../src/shared/types';

const SECRET_ICAL_URL =
  'https://www.airbnb.com.br/calendar/ical/1360237649157263407.ics?s=secret_private_token_12345';

const SAMPLE_ICS_V1 = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'BEGIN:VEVENT',
  'DTSTART;VALUE=DATE:20261110',
  'DTEND;VALUE=DATE:20261115',
  'UID:res-1',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'DTSTART;VALUE=DATE:20261120',
  'DTEND;VALUE=DATE:20261125',
  'UID:res-2',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n');

const SAMPLE_ICS_V2_REMOVED_EVENT = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'BEGIN:VEVENT',
  'DTSTART;VALUE=DATE:20261110',
  'DTEND;VALUE=DATE:20261115',
  'UID:res-1',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n');

describe('Sincronização iCal, Preservação de Cache e Segurança da API', () => {
  let kv: KVNamespace;
  let env: WorkerEnv;

  beforeEach(() => {
    resetRateLimiterForTests();
    kv = createMemoryKV();
    env = {
      AVAILABILITY_KV: kv,
      AIRBNB_ICAL_URL: SECRET_ICAL_URL,
      ADMIN_SYNC_TOKEN: 'admin-secret-token-xyz',
      SYNC_INTERVAL_MINUTES: '15',
      STALE_THRESHOLD_MINUTES: '60',
      PROPERTY_TIMEZONE: 'America/Fortaleza',
    };
  });

  it('atualiza eventos removidos em sincronizações posteriores', async () => {
    const t1 = new Date('2026-10-15T12:00:00Z');
    const res1 = await syncAvailabilityCalendar(env, {
      force: true,
      now: t1,
      fetchImpl: async () => new Response(SAMPLE_ICS_V1, { status: 200 }),
    });
    expect(res1.ok).toBe(true);
    expect(res1.rangeCount).toBe(2);

    // Na segunda sincronização, o segundo evento (2026-11-20 a 2026-11-25) foi removido/cancelado no Airbnb
    const t2 = new Date('2026-10-15T12:15:00Z');
    const res2 = await syncAvailabilityCalendar(env, {
      force: true,
      now: t2,
      fetchImpl: async () => new Response(SAMPLE_ICS_V2_REMOVED_EVENT, { status: 200 }),
    });
    expect(res2.ok).toBe(true);
    expect(res2.rangeCount).toBe(1);

    const req = new Request(
      'https://casanaareiaprea.com.br/api/availability?start=2026-11-01&end=2026-11-30'
    );
    const apiRes = await handleApiRequest(req, env, undefined, { now: t2 });
    const body = (await apiRes.json()) as AvailabilityApiResponse;

    expect(body.unavailableRanges).toEqual([
      { startDate: '2026-11-10', endDate: '2026-11-15' },
    ]);
  });

  it('preserva a última sincronização válida se uma atualização subsequente falhar e sinaliza isStale', async () => {
    const t1 = new Date('2026-10-15T12:00:00Z');
    await syncAvailabilityCalendar(env, {
      force: true,
      now: t1,
      fetchImpl: async () => new Response(SAMPLE_ICS_V1, { status: 200 }),
    });

    // Sincronização seguinte falha com erro HTTP 503 do Airbnb
    const t2 = new Date('2026-10-15T12:15:00Z');
    const failedOutcome = await syncAvailabilityCalendar(env, {
      force: true,
      now: t2,
      fetchImpl: async () => new Response('Service Unavailable', { status: 503 }),
    });

    expect(failedOutcome.ok).toBe(false);
    expect(failedOutcome.status).toBe('error');

    // Consulta a API após a falha: os intervalos anteriores DEVEM continuar preservados
    const req = new Request(
      'https://casanaareiaprea.com.br/api/availability?start=2026-11-01&end=2026-11-30'
    );
    const apiRes = await handleApiRequest(req, env, undefined, { now: t2 });
    const body = (await apiRes.json()) as AvailabilityApiResponse;

    expect(body.hasReliableData).toBe(true);
    expect(body.isStale).toBe(true);
    expect(body.lastSyncedAt).toBe(t1.toISOString());
    expect(body.unavailableRanges).toHaveLength(2);
  });

  it('evita sincronizações concorrentes desnecessárias quando o lock está ativo', async () => {
    await kv.put(KV_KEYS.SYNC_LOCK, new Date().toISOString(), { expirationTtl: 60 });

    let fetchCalled = false;
    const outcome = await syncAvailabilityCalendar(env, {
      force: false,
      fetchImpl: async () => {
        fetchCalled = true;
        return new Response(SAMPLE_ICS_V1, { status: 200 });
      },
    });

    expect(outcome.skipped).toBe(true);
    expect(fetchCalled).toBe(false);
  });

  it('nunca expõe a URL privada do calendário iCal em respostas da API ou mensagens de erro', async () => {
    const sanitized = sanitizeErrorMessage(
      `Failed to fetch ${SECRET_ICAL_URL}: network error`,
      SECRET_ICAL_URL
    );
    expect(sanitized).not.toContain('secret_private_token_12345');
    expect(sanitized).not.toContain('airbnb.com.br/calendar/ical');

    // Simula falha de rede contendo a URL secreta no erro lançado pelo fetch
    await syncAvailabilityCalendar(env, {
      force: true,
      fetchImpl: async () => {
        throw new Error(`Fetch error while requesting ${SECRET_ICAL_URL}`);
      },
    });

    const reqAvail = new Request(
      'https://casanaareiaprea.com.br/api/availability?start=2026-11-01&end=2026-11-30'
    );
    const resAvail = await handleApiRequest(reqAvail, env);
    const textAvail = await resAvail.text();
    expect(textAvail).not.toContain(SECRET_ICAL_URL);
    expect(textAvail).not.toContain('secret_private_token_12345');

    const reqHealth = new Request('https://casanaareiaprea.com.br/api/health');
    const resHealth = await handleApiRequest(reqHealth, env);
    const textHealth = await resHealth.text();
    expect(textHealth).not.toContain(SECRET_ICAL_URL);
    expect(textHealth).not.toContain('secret_private_token_12345');
  });

  it('valida rigorosamente parâmetros inválidos na API /api/availability', async () => {
    // Formato inválido
    const r1 = await handleApiRequest(
      new Request('https://casanaareiaprea.com.br/api/availability?start=10-11-2026&end=2026-11-20'),
      env
    );
    expect(r1.status).toBe(400);

    // Data fim anterior ao início
    const r2 = await handleApiRequest(
      new Request('https://casanaareiaprea.com.br/api/availability?start=2026-11-20&end=2026-11-10'),
      env
    );
    expect(r2.status).toBe(400);

    // Intervalo maior que 366 dias
    const r3 = await handleApiRequest(
      new Request('https://casanaareiaprea.com.br/api/availability?start=2026-01-01&end=2027-06-01'),
      env
    );
    expect(r3.status).toBe(400);
  });

  it('protege o endpoint administrativo POST /api/admin/sync com autenticação Bearer', async () => {
    const unauthReq = new Request('https://casanaareiaprea.com.br/api/admin/sync', {
      method: 'POST',
    });
    const unauthRes = await handleApiRequest(unauthReq, env);
    expect(unauthRes.status).toBe(401);

    const wrongTokenReq = new Request('https://casanaareiaprea.com.br/api/admin/sync', {
      method: 'POST',
      headers: { Authorization: 'Bearer token-incorreto' },
    });
    const wrongRes = await handleApiRequest(wrongTokenReq, env);
    expect(wrongRes.status).toBe(401);

    const validReq = new Request('https://casanaareiaprea.com.br/api/admin/sync', {
      method: 'POST',
      headers: { Authorization: 'Bearer admin-secret-token-xyz' },
    });
    const validRes = await handleApiRequest(validReq, env, undefined, {
      fetchImpl: async () => new Response(SAMPLE_ICS_V1, { status: 200 }),
    });
    expect(validRes.status).toBe(200);
    const body = (await validRes.json()) as { ok: boolean; rangeCount: number };
    expect(body.ok).toBe(true);
    expect(body.rangeCount).toBe(2);
  });
});
