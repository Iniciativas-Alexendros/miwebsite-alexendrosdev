import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { escapeHtml, isHoneypotFilled, parseContactBody } from '../../lib/contactSchema';

export const prerender = false;

const MAIL_FROM = 'operaciones@alexendros.dev';
const MAIL_TO = 'operaciones@alexendros.dev';

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip') || 'unknown';
}

function getRatelimit(): Ratelimit | null {
  const url = import.meta.env.UPSTASH_REDIS_REST_URL;
  const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    prefix: 'alexendros:contact'
  });
}

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json().catch(() => null);
  const parsed = parseContactBody(data);

  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (isHoneypotFilled(parsed.data.honeypot)) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const ip = clientIp(request);
  const ratelimit = getRatelimit();
  if (ratelimit) {
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      console.info(JSON.stringify({ event: 'contact_rate_limited', ok: false }));
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  const { name, email, company, subject, message } = parsed.data;
  const host = import.meta.env.SMTP_HOST;
  const user = import.meta.env.SMTP_USER;
  const pass = import.meta.env.SMTP_PASS;
  const port = Number(import.meta.env.SMTP_PORT || 587);

  if (!host || !user || !pass) {
    console.error(JSON.stringify({ event: 'contact_smtp_misconfigured', ok: false }));
    return new Response(JSON.stringify({ error: 'Service unavailable' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = escapeHtml(company || '—');
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  const html = `
    <h2>Nuevo contacto — alexendros.dev</h2>
    <p><strong>Nombre:</strong> ${safeName}</p>
    <p><strong>Email:</strong> ${safeEmail}</p>
    <p><strong>Empresa:</strong> ${safeCompany}</p>
    <p><strong>Asunto:</strong> ${safeSubject}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${safeMessage}</p>
  `;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: email,
      subject: `[alexendros.dev] ${subject} - ${name}`,
      html,
      text: `Nombre: ${name}\nEmail: ${email}\nEmpresa: ${company || '—'}\nAsunto: ${subject}\n\n${message}`
    });

    console.info(
      JSON.stringify({
        event: 'contact_sent',
        ok: true,
        subjectLen: subject.length,
        messageLen: message.length
      })
    );

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    console.error(JSON.stringify({ event: 'contact_smtp_error', ok: false }));
    return new Response(JSON.stringify({ error: 'Send failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
