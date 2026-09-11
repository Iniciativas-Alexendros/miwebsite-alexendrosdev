import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { toNotionProperties } from './calNotionClient';
import {
  appendLeadNote,
  hashedLinkPresent,
  mapCalEventToLeadWrite,
  mapEventSlugToTipo,
  NOTION_PROP,
  stripePaymentIntentId
} from './calNotionMapper';
import type { HandledCalTrigger } from './calWebhookSchema';

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), 'fixtures/cal');

function loadFixture(name: string): {
  triggerEvent: HandledCalTrigger;
  createdAt?: string;
  payload: Record<string, unknown>;
} {
  return JSON.parse(readFileSync(join(fixturesDir, name), 'utf8')) as {
    triggerEvent: HandledCalTrigger;
    createdAt?: string;
    payload: Record<string, unknown>;
  };
}

describe('mapEventSlugToTipo', () => {
  it('diagnostico → Sesión gratuita', () => {
    expect(mapEventSlugToTipo('diagnostico-web', false)).toBe('Sesión gratuita');
  });

  it('sesion-tecnica / sesion_tecnica → Sesión de pago', () => {
    expect(mapEventSlugToTipo('sesion-tecnica', false)).toBe('Sesión de pago');
    expect(mapEventSlugToTipo('sesion_tecnica-60', false)).toBe('Sesión de pago');
  });

  it('retainer o hashedLink → Retainer/cubierto', () => {
    expect(mapEventSlugToTipo('retainer-mensual', false)).toBe('Retainer/cubierto');
    expect(mapEventSlugToTipo('office-hours', true)).toBe('Retainer/cubierto');
  });

  it('resto → Lead contacto', () => {
    expect(mapEventSlugToTipo('consulta', false)).toBe('Lead contacto');
  });
});

describe('mapCalEventToLeadWrite fixtures', () => {
  it('CREATED diagnostico → Canal Cal.com, Estado Agendado, Tipo Sesión gratuita', () => {
    const fx = loadFixture('booking-created.json');
    const write = mapCalEventToLeadWrite({
      trigger: fx.triggerEvent,
      payload: fx.payload,
      uid: String(fx.payload.uid),
      createdAt: fx.createdAt,
      existing: null
    });
    expect(write.canal).toBe('Cal.com');
    expect(write.estado).toBe('Agendado');
    expect(write.tipo).toBe('Sesión gratuita');
    expect(write.nombre).toBe('Ana Cliente');
    expect(write.email).toBe('ana@example.com');
    expect(write.fecha).toBe('2026-09-15T10:00:00.000Z');
    expect(write.asunto).toBe('Diagnóstico web 30 min');
    expect(write.calBookingId).toBe('uid-created-diagnostico');
  });

  it('CREATED con hashedLink → Retainer/cubierto', () => {
    const fx = loadFixture('booking-created-retainer.json');
    expect(hashedLinkPresent(fx.payload)).toBe(true);
    const write = mapCalEventToLeadWrite({
      trigger: fx.triggerEvent,
      payload: fx.payload,
      uid: String(fx.payload.uid),
      createdAt: fx.createdAt,
      existing: null
    });
    expect(write.tipo).toBe('Retainer/cubierto');
  });

  it('PAID → Pagado y stripe_payment_intent si externalId es pi_', () => {
    const fx = loadFixture('booking-paid.json');
    expect(stripePaymentIntentId(fx.payload)).toBe('pi_test_123abc');
    const write = mapCalEventToLeadWrite({
      trigger: fx.triggerEvent,
      payload: fx.payload,
      uid: String(fx.payload.uid),
      createdAt: fx.createdAt,
      existing: { id: 'page-1', notes: 'prev' }
    });
    expect(write.estado).toBe('Pagado');
    expect(write.stripePaymentIntent).toBe('pi_test_123abc');
    expect(write.notas).toContain('BOOKING_PAID');
  });

  it('PAYMENT_INITIATED sobre existente → solo notas', () => {
    const fx = loadFixture('booking-payment-initiated.json');
    const write = mapCalEventToLeadWrite({
      trigger: fx.triggerEvent,
      payload: fx.payload,
      uid: String(fx.payload.uid),
      createdAt: fx.createdAt,
      existing: { id: 'page-1', notes: 'hola', estado: 'Agendado' }
    });
    expect(write.estado).toBeUndefined();
    expect(write.canal).toBeUndefined();
    expect(write.notas).toContain('pago iniciado');
    expect(write.notas).toContain('hola');
  });

  it('RESCHEDULED → Fecha nueva y nota con rescheduleUid', () => {
    const fx = loadFixture('booking-rescheduled.json');
    const write = mapCalEventToLeadWrite({
      trigger: fx.triggerEvent,
      payload: fx.payload,
      uid: String(fx.payload.uid),
      createdAt: fx.createdAt,
      existing: { id: 'page-1', estado: 'Agendado' }
    });
    expect(write.fecha).toBe('2026-09-20T15:00:00.000Z');
    expect(write.notas).toContain('rescheduleUid=uid-previous-slot');
    expect(write.estado).toBeUndefined();
  });

  it('CANCELLED / REJECTED → Descartado', () => {
    const cancelled = loadFixture('booking-cancelled.json');
    expect(
      mapCalEventToLeadWrite({
        trigger: cancelled.triggerEvent,
        payload: cancelled.payload,
        uid: String(cancelled.payload.uid),
        createdAt: cancelled.createdAt,
        existing: { id: 'page-1' }
      }).estado
    ).toBe('Descartado');

    const rejected = loadFixture('booking-rejected.json');
    expect(
      mapCalEventToLeadWrite({
        trigger: rejected.triggerEvent,
        payload: rejected.payload,
        uid: String(rejected.payload.uid),
        createdAt: rejected.createdAt,
        existing: null
      }).estado
    ).toBe('Descartado');
  });

  it('CREATED no degrada Estado Pagado', () => {
    const fx = loadFixture('booking-created.json');
    const write = mapCalEventToLeadWrite({
      trigger: fx.triggerEvent,
      payload: fx.payload,
      uid: String(fx.payload.uid),
      createdAt: fx.createdAt,
      existing: { id: 'page-1', estado: 'Pagado' }
    });
    expect(write.estado).toBeUndefined();
    expect(write.canal).toBe('Cal.com');
  });
});

describe('appendLeadNote', () => {
  it('concatena y recorta por el inicio si supera 2000', () => {
    const long = 'x'.repeat(1990);
    const next = appendLeadNote(
      long,
      '2026-01-01T00:00:00.000Z',
      'BOOKING_PAID',
      'pago confirmado'
    );
    expect(next.length).toBeLessThanOrEqual(2000);
    expect(next).toContain('BOOKING_PAID');
  });
});

describe('toNotionProperties', () => {
  it('usa los nombres canónicos de la data source', () => {
    const props = toNotionProperties({
      nombre: 'Ana',
      email: 'ana@example.com',
      canal: 'Cal.com',
      tipo: 'Sesión gratuita',
      estado: 'Agendado',
      asunto: 'Diag',
      mensaje: 'Hola',
      calBookingId: 'uid-1',
      stripePaymentIntent: 'pi_x',
      fuente: 'cal.com/diagnostico-web',
      fecha: '2026-09-15T10:00:00.000Z',
      notas: 'n1'
    });
    expect(Object.keys(props).sort()).toEqual(
      [
        NOTION_PROP.asunto,
        NOTION_PROP.calBookingId,
        NOTION_PROP.canal,
        NOTION_PROP.email,
        NOTION_PROP.estado,
        NOTION_PROP.fecha,
        NOTION_PROP.fuente,
        NOTION_PROP.mensaje,
        NOTION_PROP.nombre,
        NOTION_PROP.notas,
        NOTION_PROP.stripePaymentIntent,
        NOTION_PROP.tipo
      ].sort()
    );
    expect(props[NOTION_PROP.canal]).toEqual({ select: { name: 'Cal.com' } });
    expect(props[NOTION_PROP.email]).toEqual({ email: 'ana@example.com' });
  });

  it('omite email inválido', () => {
    const props = toNotionProperties({ email: 'no-email' });
    expect(props[NOTION_PROP.email]).toBeUndefined();
  });
});
