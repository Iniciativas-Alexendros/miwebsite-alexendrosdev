import { z } from 'zod';

export const HANDLED_CAL_TRIGGERS = [
  'BOOKING_CREATED',
  'BOOKING_PAID',
  'BOOKING_PAYMENT_INITIATED',
  'BOOKING_RESCHEDULED',
  'BOOKING_CANCELLED',
  'BOOKING_REJECTED'
] as const;

export type HandledCalTrigger = (typeof HANDLED_CAL_TRIGGERS)[number];

export const calWebhookEnvelopeSchema = z.object({
  triggerEvent: z.string().min(1),
  createdAt: z.string().optional(),
  payload: z.object({}).passthrough()
});

export type CalWebhookEnvelope = z.infer<typeof calWebhookEnvelopeSchema>;

export function parseCalWebhookEnvelope(data: unknown) {
  return calWebhookEnvelopeSchema.safeParse(data);
}

export function isHandledCalTrigger(value: string): value is HandledCalTrigger {
  return (HANDLED_CAL_TRIGGERS as readonly string[]).includes(value);
}

export function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function bookingUid(payload: Record<string, unknown>): string | undefined {
  return asNonEmptyString(payload.uid);
}
