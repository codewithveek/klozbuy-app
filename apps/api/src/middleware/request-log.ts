import { createMiddleware } from 'hono/factory';
import type { AppEnv } from '../app-env';

/** One JSON line per request for Workers Logs, tagged with the request ID. */
export const requestLog = createMiddleware<AppEnv>(async (c, next) => {
  const started = Date.now();
  await next();
  console.info(
    JSON.stringify({
      requestId: c.var.requestId,
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      ms: Date.now() - started,
    }),
  );
});
