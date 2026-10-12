import { createDb, type Db } from '@klozbuy/db';
import { createAuth, type Auth } from '@klozbuy/domain/identity';
import { createMiddleware } from 'hono/factory';
import type { AppEnv } from '../app-env';
import { parseConfig, type Config } from '../env';
import { createOtpSender } from '../otp';

export type DbFactory = (config: Config) => Db;

/** Production: TiDB Cloud over HTTP. */
export const tidbCloud: DbFactory = (config) => createDb({ url: config.databaseUrl });

/**
 * Builds this request's config, database handle and (lazily) Better Auth. Everything is
 * per request: the TiDB driver holds no connection, so there is nothing to share.
 */
export const services = (dbFactory: DbFactory) =>
  createMiddleware<AppEnv>(async (c, next) => {
    const config = parseConfig(c.env);
    const db = dbFactory(config);
    let auth: Auth | undefined;
    c.set('config', config);
    c.set('db', db);
    c.set('auth', () => {
      auth ??= createAuth({
        db,
        secret: config.authSecret,
        baseUrl: config.apiUrl,
        trustedOrigins: config.trustedOrigins,
        cookieDomain: config.cookieDomain,
        sendOtp: createOtpSender(config.otp),
      });
      return auth;
    });
    await next();
  });
