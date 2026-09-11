import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';
import { createNotionLeadsStore } from '../../../lib/calNotionClient';
import {
  CAL_IDEMPOTENCY_TTL_SECONDS,
  calWebhookMethodNotAllowed,
  handleCalWebhookPost,
  resolveLeadsDataSourceId,
  type CalWebhookDeps
} from '../../../lib/calWebhookHandler';

export const prerender = false;

function createProductionDeps(): CalWebhookDeps {
  return {
    getEnv: () => ({
      CAL_WEBHOOK_SECRET: import.meta.env.CAL_WEBHOOK_SECRET,
      NOTION_TOKEN: import.meta.env.NOTION_TOKEN,
      NOTION_LEADS_DATABASE_ID: import.meta.env.NOTION_LEADS_DATABASE_ID,
      NOTION_LEADS_DATA_SOURCE_ID: import.meta.env.NOTION_LEADS_DATA_SOURCE_ID,
      UPSTASH_REDIS_REST_URL: import.meta.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: import.meta.env.UPSTASH_REDIS_REST_TOKEN
    }),
    claimIdempotency: async (key) => {
      const url = import.meta.env.UPSTASH_REDIS_REST_URL;
      const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
      if (!url || !token) throw new Error('redis_misconfigured');
      const redis = new Redis({ url, token });
      const result = await redis.set(key, '1', {
        nx: true,
        ex: CAL_IDEMPOTENCY_TTL_SECONDS
      });
      return Boolean(result);
    },
    releaseIdempotency: async (key) => {
      const url = import.meta.env.UPSTASH_REDIS_REST_URL;
      const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
      if (!url || !token) throw new Error('redis_misconfigured');
      const redis = new Redis({ url, token });
      await redis.del(key);
    },
    leads: {
      findByBookingId: async (uid) => {
        return notionStore().findByBookingId(uid);
      },
      create: async (write) => notionStore().create(write),
      update: async (pageId, write) => notionStore().update(pageId, write)
    }
  };
}

function notionStore() {
  const token = import.meta.env.NOTION_TOKEN;
  const dataSourceId = resolveLeadsDataSourceId({
    NOTION_TOKEN: token,
    NOTION_LEADS_DATABASE_ID: import.meta.env.NOTION_LEADS_DATABASE_ID,
    NOTION_LEADS_DATA_SOURCE_ID: import.meta.env.NOTION_LEADS_DATA_SOURCE_ID
  });
  if (!token || !dataSourceId) throw new Error('notion_misconfigured');
  return createNotionLeadsStore(token, dataSourceId);
}

export const POST: APIRoute = async ({ request }) =>
  handleCalWebhookPost(request, createProductionDeps());

/** Métodos distintos de POST → 405 Allow: POST */
export const ALL: APIRoute = async () => calWebhookMethodNotAllowed();
