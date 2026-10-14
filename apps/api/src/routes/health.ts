import { Hono } from 'hono';
import type { AppEnv } from '../app-env';

export const healthRoutes = new Hono<AppEnv>().get('/', (c) =>
  c.json({ status: 'ok' as const, environment: c.var.config.environment }),
);
