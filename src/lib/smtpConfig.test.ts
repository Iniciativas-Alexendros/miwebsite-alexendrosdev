import { describe, expect, it } from 'vitest';
import { parseSmtpPort, resolveSmtpConfig } from './smtpConfig';

describe('parseSmtpPort', () => {
  it('usa 587 por defecto', () => {
    expect(parseSmtpPort(undefined)).toBe(587);
    expect(parseSmtpPort('')).toBe(587);
  });

  it('acepta enteros válidos', () => {
    expect(parseSmtpPort('465')).toBe(465);
    expect(parseSmtpPort('587')).toBe(587);
  });

  it('rechaza valores no enteros o fuera de rango', () => {
    expect(parseSmtpPort('abc')).toBeNull();
    expect(parseSmtpPort('587.5')).toBeNull();
    expect(parseSmtpPort('0')).toBeNull();
    expect(parseSmtpPort('65536')).toBeNull();
  });
});

describe('resolveSmtpConfig', () => {
  const valid = {
    SMTP_HOST: 'smtp.example.com',
    SMTP_PORT: '587',
    SMTP_USER: 'user@example.com',
    SMTP_PASS: 'app-password-sample'
  };

  it('devuelve config cuando todo es válido', () => {
    expect(resolveSmtpConfig(valid)).toEqual({
      host: 'smtp.example.com',
      port: 587,
      user: 'user@example.com',
      pass: 'app-password-sample'
    });
  });

  it('devuelve null si falta host, user o pass', () => {
    expect(resolveSmtpConfig({ ...valid, SMTP_HOST: undefined })).toBeNull();
    expect(resolveSmtpConfig({ ...valid, SMTP_USER: '' })).toBeNull();
    expect(resolveSmtpConfig({ ...valid, SMTP_PASS: undefined })).toBeNull();
  });

  it('devuelve null si el puerto es inválido', () => {
    expect(resolveSmtpConfig({ ...valid, SMTP_PORT: 'nope' })).toBeNull();
  });
});
