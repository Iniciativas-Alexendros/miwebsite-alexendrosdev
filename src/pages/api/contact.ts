import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import {
  buildContactEmailHtml,
  handleContactPost,
  methodNotAllowed,
  type ContactDeps
} from '../../lib/contactHandler';

export const prerender = false;

const MAIL_FROM = 'operaciones@alexendros.dev';
const MAIL_TO = 'operaciones@alexendros.dev';

function createProductionDeps(): ContactDeps {
  return {
    getEnv: () => ({
      SMTP_HOST: import.meta.env.SMTP_HOST,
      SMTP_PORT: import.meta.env.SMTP_PORT,
      SMTP_USER: import.meta.env.SMTP_USER,
      SMTP_PASS: import.meta.env.SMTP_PASS,
      UPSTASH_REDIS_REST_URL: import.meta.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: import.meta.env.UPSTASH_REDIS_REST_TOKEN
    }),
    rateLimit: async (ip) => {
      const url = import.meta.env.UPSTASH_REDIS_REST_URL;
      const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
      if (!url || !token) throw new Error('redis_misconfigured');
      const ratelimit = new Ratelimit({
        redis: new Redis({ url, token }),
        limiter: Ratelimit.slidingWindow(10, '1 m'),
        prefix: 'alexendros:contact'
      });
      const result = await ratelimit.limit(ip);
      return { success: result.success, reset: result.reset };
    },
    sendMail: async ({ name, email, company, subject, message, smtp }) => {
      const { html, text, mailSubject } = buildContactEmailHtml({
        name,
        email,
        company,
        subject,
        message
      });
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.port === 465,
        auth: { user: smtp.user, pass: smtp.pass }
      });
      await transporter.sendMail({
        from: MAIL_FROM,
        to: MAIL_TO,
        replyTo: email,
        subject: mailSubject,
        html,
        text
      });
    }
  };
}

export const POST: APIRoute = async ({ request }) =>
  handleContactPost(request, createProductionDeps());

/** Métodos distintos de POST → 405 Allow: POST */
export const ALL: APIRoute = async () => methodNotAllowed();
