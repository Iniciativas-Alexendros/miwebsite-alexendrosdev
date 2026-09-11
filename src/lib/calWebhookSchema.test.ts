import { describe, expect, it } from 'vitest';
import { bookingUid, isHandledCalTrigger, parseCalWebhookEnvelope } from './calWebhookSchema';

describe('parseCalWebhookEnvelope', () => {
  it('acepta sobre mínimo con payload objeto', () => {
    const parsed = parseCalWebhookEnvelope({
      triggerEvent: 'BOOKING_CREATED',
      createdAt: '2026-09-11T09:00:00.000Z',
      payload: { uid: 'abc' }
    });
    expect(parsed.success).toBe(true);
  });

  it('rechaza sin triggerEvent o payload no objeto', () => {
    expect(parseCalWebhookEnvelope({ payload: { uid: 'x' } }).success).toBe(false);
    expect(parseCalWebhookEnvelope({ triggerEvent: 'BOOKING_CREATED' }).success).toBe(false);
    expect(parseCalWebhookEnvelope({ triggerEvent: 'X', payload: [] }).success).toBe(false);
  });
});

describe('isHandledCalTrigger', () => {
  it('filtra los 6 eventos de reserva', () => {
    expect(isHandledCalTrigger('BOOKING_CREATED')).toBe(true);
    expect(isHandledCalTrigger('MEETING_STARTED')).toBe(false);
    expect(isHandledCalTrigger('FORM_SUBMITTED')).toBe(false);
  });
});

describe('bookingUid', () => {
  it('lee payload.uid', () => {
    expect(bookingUid({ uid: '  uid-1  ' })).toBe('uid-1');
    expect(bookingUid({})).toBeUndefined();
  });
});
