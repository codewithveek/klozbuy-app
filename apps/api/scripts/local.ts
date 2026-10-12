/**
 * Runs the API in Node against a local TiDB, for development without a TiDB Cloud
 * cluster. The deployed worker uses TiDB Cloud's HTTP driver, which a local TiDB does
 * not serve, so this swaps in a plain MySQL connection. See the README.
 *
 *   LOCAL_DATABASE_URL=mysql://root@127.0.0.1:4000/klozbuy_local pnpm --filter @klozbuy/api dev:local
 */
import { serve } from '@hono/node-server';
import { createTestDb } from '@klozbuy/db/testing';
import { createApp } from '../src/app';
import type { Env } from '../src/env';

const url = process.env.LOCAL_DATABASE_URL ?? 'mysql://root@127.0.0.1:4000/klozbuy_local';
const port = Number(process.env.PORT ?? 8787);
const allowAll = { limit: async () => ({ success: true }) };

const env: Env = {
  ENVIRONMENT: 'development',
  API_URL: `http://localhost:${port}`,
  TRUSTED_ORIGINS: process.env.TRUSTED_ORIGINS ?? 'http://localhost:8081,klozbuy://',
  OTP_SENDER: 'console',
  DATABASE_URL: url,
  BETTER_AUTH_SECRET:
    process.env.BETTER_AUTH_SECRET ?? 'local-development-secret-not-for-production',
  AUTH_IP_LIMITER: allowAll,
  OTP_PHONE_LIMITER: allowAll,
};

const { db } = createTestDb(url);
const app = createApp({ createDb: () => db });

serve({ fetch: (request) => app.fetch(request, env), port }, () => {
  console.info(`API on http://localhost:${port} using ${url.replace(/\/\/[^@]*@/, '//')}`);
});
