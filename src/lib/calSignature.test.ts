import { describe, expect, it } from 'vitest';
import { calSignatureHex, verifyCalSignature } from './calSignature';

const secret = 'test-webhook-secret';
const body = '{"triggerEvent":"BOOKING_CREATED","payload":{"uid":"abc"}}';

describe('verifyCalSignature', () => {
  it('acepta HMAC-SHA256 hex del body en crudo', () => {
    const header = calSignatureHex(body, secret);
    expect(verifyCalSignature(body, header, secret)).toBe(true);
  });

  it('rechaza firma incorrecta', () => {
    const header = calSignatureHex(body, secret);
    expect(verifyCalSignature(body, header, 'otra-clave')).toBe(false);
    expect(verifyCalSignature('{"tampered":true}', header, secret)).toBe(false);
  });

  it('rechaza ausencia o longitud distinta sin lanzar', () => {
    expect(verifyCalSignature(body, null, secret)).toBe(false);
    expect(verifyCalSignature(body, '', secret)).toBe(false);
    expect(verifyCalSignature(body, 'abc', secret)).toBe(false);
  });
});
