import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { calSignatureHex } from './calSignature';
import type { ExistingLead, LeadWrite } from './calNotionMapper';
import {
  CAL_WEBHOOK_MAX_BODY_BYTES,
  calWebhookMethodNotAllowed,
  handleCalWebhookPost,
  idempotencyKey,
  resolveLeadsDataSourceId,
  type CalWebhookDeps
} from './calWebhookHandler';

const SECRET = 'cal-test-secret';
const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), 'fixtures/cal');

function loadRaw(name: string): string {
  return readFileSync(join(fixturesDir, name), 'utf8');
}

type MemoryLead = ExistingLead & LeadWrite;

function deps(overrides: Partial<CalWebhookDeps> = {}): CalWebhookDeps & {
  store: Map<string, MemoryLead>;
  claimed: Set<string>;
} {
  const store = new Map<string, MemoryLead>();
  const claimed = new Set<string>();
  const pageById = new Map<string, MemoryLead>();
  let seq = 0;

  const base: CalWebhookDeps = {
    getEnv: () => ({
      CAL_WEBHOOK_SECRET: SECRET,
      NOTION_TOKEN: 'secret_test',
      NOTION_LEADS_DATABASE_ID: '84b33eb7-f117-46ad-aedd-120852b5cbb7',
      UPSTASH_REDIS_REST_URL: 'https://example.upstash.io',
      UPSTASH_REDIS_REST_TOKEN: 'token'
    }),
    claimIdempotency: async (key) => {
      if (claimed.has(key)) return false;
      claimed.add(key);
      return true;
    },
    releaseIdempotency: async (key) => {
      claimed.delete(key);
    },
    leads: {
      findByBookingId: async (uid) => {
        const row = store.get(uid);
        if (!row) return null;
        return { id: row.id, notes: row.notas, estado: row.estado };
      },
      create: async (write) => {
        seq += 1;
        const id = `page-${seq}`;
        const row: MemoryLead = { id, ...write };
        if (write.calBookingId) store.set(write.calBookingId, row);
        pageById.set(id, row);
        return { id };
      },
      update: async (pageId, write) => {
        const current = pageById.get(pageId);
        if (!current) throw new Error('missing');
        Object.assign(current, write);
      }
    },
    createRequestId: () => 'req-cal-test'
  };

  return { store, claimed, ...base, ...overrides };
}

function signedPost(raw: string, init?: RequestInit): Request {
  const signature = calSignatureHex(raw, SECRET);
  return new Request('https://alexendros.dev/api/cal/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Cal-Signature-256': signature,
      ...(init?.headers || {})
    },
    body: raw,
    ...init
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('calWebhookMethodNotAllowed', () => {
  it('GET → 405 Allow POST', () => {
    const res = calWebhookMethodNotAllowed();
    expect(res.status).toBe(405);
    expect(res.headers.get('Allow')).toBe('POST');
  });
});

describe('resolveLeadsDataSourceId', () => {
  it('prioriza NOTION_LEADS_DATA_SOURCE_ID y acepta DATABASE_ID como alias del data source', () => {
    expect(
      resolveLeadsDataSourceId({
        NOTION_LEADS_DATA_SOURCE_ID: '84b33eb7-f117-46ad-aedd-120852b5cbb7',
        NOTION_LEADS_DATABASE_ID: '7c26e759d97d4f398b7955944a084b69'
      })
    ).toBe('84b33eb7-f117-46ad-aedd-120852b5cbb7');
    expect(
      resolveLeadsDataSourceId({
        NOTION_LEADS_DATABASE_ID: '84b33eb7-f117-46ad-aedd-120852b5cbb7'
      })
    ).toBe('84b33eb7-f117-46ad-aedd-120852b5cbb7');
  });
});

describe('handleCalWebhookPost', () => {
  it('CREATED válido → 200 y create en Notion', async () => {
    const d = deps();
    const raw = loadRaw('booking-created.json');
    const res = await handleCalWebhookPost(signedPost(raw), d);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    const row = d.store.get('uid-created-diagnostico');
    expect(row?.estado).toBe('Agendado');
    expect(row?.canal).toBe('Cal.com');
    expect(row?.tipo).toBe('Sesión gratuita');
    expect(d.claimed.has(idempotencyKey('uid-created-diagnostico', 'BOOKING_CREATED'))).toBe(true);
  });

  it('duplicado mismo uid+trigger → 200 sin segundo create', async () => {
    const d = deps();
    const raw = loadRaw('booking-created.json');
    const first = await handleCalWebhookPost(signedPost(raw), d);
    const create = vi.fn(d.leads.create);
    const update = vi.fn(d.leads.update);
    d.leads.create = create;
    d.leads.update = update;
    const second = await handleCalWebhookPost(signedPost(raw), d);
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(create).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });

  it('PAID → Estado Pagado y stripe_payment_intent', async () => {
    const d = deps();
    await handleCalWebhookPost(signedPost(loadRaw('booking-payment-initiated.json')), d);
    const res = await handleCalWebhookPost(signedPost(loadRaw('booking-paid.json')), d);
    expect(res.status).toBe(200);
    const row = d.store.get('uid-paid-sesion');
    expect(row?.estado).toBe('Pagado');
    expect(row?.stripePaymentIntent).toBe('pi_test_123abc');
    expect(row?.notas).toContain('pago iniciado');
    expect(row?.notas).toContain('pago confirmado');
  });

  it('RESCHEDULED actualiza Fecha', async () => {
    const d = deps();
    await handleCalWebhookPost(signedPost(loadRaw('booking-created.json')), d);
    const res = await handleCalWebhookPost(signedPost(loadRaw('booking-rescheduled.json')), d);
    expect(res.status).toBe(200);
    expect(d.store.get('uid-created-diagnostico')?.fecha).toBe('2026-09-20T15:00:00.000Z');
  });

  it('CANCELLED → Descartado', async () => {
    const d = deps();
    await handleCalWebhookPost(signedPost(loadRaw('booking-created.json')), d);
    const res = await handleCalWebhookPost(signedPost(loadRaw('booking-cancelled.json')), d);
    expect(res.status).toBe(200);
    expect(d.store.get('uid-created-diagnostico')?.estado).toBe('Descartado');
  });

  it('REJECTED sin página previa crea lead Descartado', async () => {
    const d = deps();
    const res = await handleCalWebhookPost(signedPost(loadRaw('booking-rejected.json')), d);
    expect(res.status).toBe(200);
    expect(d.store.get('uid-rejected-001')?.estado).toBe('Descartado');
  });

  it('trigger no gestionado → 200 sin Notion', async () => {
    const d = deps();
    const body = JSON.stringify({
      triggerEvent: 'MEETING_STARTED',
      createdAt: '2026-09-11T09:00:00.000Z',
      payload: { uid: 'x' }
    });
    const create = vi.fn(d.leads.create);
    d.leads.create = create;
    const res = await handleCalWebhookPost(signedPost(body), d);
    expect(res.status).toBe(200);
    expect(create).not.toHaveBeenCalled();
  });

  it('firma inválida → 401', async () => {
    const d = deps();
    const raw = loadRaw('booking-created.json');
    const res = await handleCalWebhookPost(
      new Request('https://alexendros.dev/api/cal/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Cal-Signature-256': '00'.repeat(32)
        },
        body: raw
      }),
      d
    );
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthorized' });
    expect(d.store.size).toBe(0);
  });

  it('secreto ausente → 503 genérico', async () => {
    const d = deps({
      getEnv: () => ({
        UPSTASH_REDIS_REST_URL: 'https://example.upstash.io',
        UPSTASH_REDIS_REST_TOKEN: 'token',
        NOTION_TOKEN: 'secret_test',
        NOTION_LEADS_DATABASE_ID: '84b33eb7-f117-46ad-aedd-120852b5cbb7'
      })
    });
    const res = await handleCalWebhookPost(signedPost(loadRaw('booking-created.json')), d);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: 'Service unavailable' });
  });

  it('Redis ausente → 503 fail-closed', async () => {
    const d = deps({
      getEnv: () => ({
        CAL_WEBHOOK_SECRET: SECRET,
        NOTION_TOKEN: 'secret_test',
        NOTION_LEADS_DATABASE_ID: '84b33eb7-f117-46ad-aedd-120852b5cbb7'
      })
    });
    const res = await handleCalWebhookPost(signedPost(loadRaw('booking-created.json')), d);
    expect(res.status).toBe(503);
  });

  it('Notion ausente → 503 fail-closed', async () => {
    const d = deps({
      getEnv: () => ({
        CAL_WEBHOOK_SECRET: SECRET,
        UPSTASH_REDIS_REST_URL: 'https://example.upstash.io',
        UPSTASH_REDIS_REST_TOKEN: 'token'
      })
    });
    const res = await handleCalWebhookPost(signedPost(loadRaw('booking-created.json')), d);
    expect(res.status).toBe(503);
  });

  it('error Notion libera la clave de idempotencia', async () => {
    const d = deps();
    d.leads.create = async () => {
      throw new Error('notion down');
    };
    const res = await handleCalWebhookPost(signedPost(loadRaw('booking-created.json')), d);
    expect(res.status).toBe(503);
    expect(d.claimed.size).toBe(0);
  });

  it('Content-Type no JSON → 415', async () => {
    const res = await handleCalWebhookPost(
      new Request('https://alexendros.dev/api/cal/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: '{}'
      }),
      deps()
    );
    expect(res.status).toBe(415);
  });

  it('payload excesivo → 413', async () => {
    const res = await handleCalWebhookPost(
      new Request('https://alexendros.dev/api/cal/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': String(CAL_WEBHOOK_MAX_BODY_BYTES + 1)
        },
        body: '{}'
      }),
      deps()
    );
    expect(res.status).toBe(413);
  });

  it('logs no incluyen PII (email/nombre)', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const d = deps();
    await handleCalWebhookPost(signedPost(loadRaw('booking-created.json')), d);
    const dumped = [...info.mock.calls, ...error.mock.calls].flat().join(' ');
    expect(dumped).not.toContain('ana@example.com');
    expect(dumped).not.toContain('Ana Cliente');
    expect(dumped).toContain('cal_webhook_processed');
  });
});
