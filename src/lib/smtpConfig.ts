export type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
};

/** Parsea SMTP_PORT; default 587. Devuelve null si no es entero válido en rango. */
export function parseSmtpPort(raw: string | undefined): number | null {
  const value = raw === undefined || raw === '' ? '587' : raw;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) return null;
  return port;
}

/**
 * Resuelve configuración SMTP desde env.
 * Ausencia o puerto inválido → null (el handler debe responder 503 genérico).
 */
export function resolveSmtpConfig(env: {
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
}): SmtpConfig | null {
  const host = env.SMTP_HOST?.trim();
  const user = env.SMTP_USER?.trim();
  const pass = env.SMTP_PASS;
  const port = parseSmtpPort(env.SMTP_PORT);
  if (!host || !user || !pass || port === null) return null;
  return { host, port, user, pass };
}
