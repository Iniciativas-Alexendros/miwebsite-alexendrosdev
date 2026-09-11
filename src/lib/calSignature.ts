import { createHmac, timingSafeEqual } from 'node:crypto';

/** Cabecera que Cal.com envía al firmar el body en crudo (HMAC-SHA256 hex). */
export const CAL_SIGNATURE_HEADER = 'x-cal-signature-256';

export function calSignatureHex(rawBody: string, secret: string): string {
  return createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
}

/**
 * Compara de forma timing-safe la firma HMAC-SHA256 del body en crudo.
 * Ausencia o longitud distinta → false (no lanza).
 */
export function verifyCalSignature(
  rawBody: string,
  header: string | null,
  secret: string
): boolean {
  if (!header || !secret) return false;
  const expected = calSignatureHex(rawBody, secret);
  const given = header.trim();
  const a = Buffer.from(given, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
