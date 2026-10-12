import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';
import type { AppEnv } from './app-env';
import { handleError, handleNotFound } from './errors';
import { requestLog } from './middleware/request-log';
import { services, tidbCloud, type DbFactory } from './middleware/services';
import { authRoutes } from './routes/auth';
import { categoryRoutes, listingRoutes } from './routes/catalog';
import { discoveryRoutes } from './routes/discovery';
import { goRoutes } from './routes/go';
import { healthRoutes } from './routes/health';
import { meRoutes } from './routes/me';
import { reportRoutes, requestRoutes } from './routes/requests';
import { myShopRoutes, shopRoutes } from './routes/shops';

export interface AppOptions {
  /** How each request gets its database. Defaults to TiDB Cloud's HTTP driver. */
  createDb?: DbFactory;
}

export function createApp({ createDb = tidbCloud }: AppOptions = {}) {
  const app = new Hono<AppEnv>()
    .use(requestId())
    .use(requestLog)
    .use(secureHeaders())
    .use(services(createDb))
    .use('/v1/*', (c, next) =>
      cors({
        origin: c.var.config.trustedOrigins,
        credentials: true,
        allowHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
        exposeHeaders: ['X-Request-Id'],
        maxAge: 600,
      })(c, next),
    )
    .route('/health', healthRoutes)
    .route('/v1/auth', authRoutes)
    .route('/v1/me/shops', myShopRoutes)
    .route('/v1/me', meRoutes)
    .route('/v1/categories', categoryRoutes)
    .route('/v1/listings', listingRoutes)
    .route('/v1/shops', shopRoutes)
    .route('/v1/requests', requestRoutes)
    .route('/v1/reports', reportRoutes)
    .route('/v1', discoveryRoutes)
    .route('/go', goRoutes);
  app.onError(handleError);
  app.notFound(handleNotFound);
  return app;
}

export type AppType = ReturnType<typeof createApp>;
