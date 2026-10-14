import type { Db } from '@klozbuy/db';
import type { Auth } from '@klozbuy/domain/identity';
import type { RequestIdVariables } from 'hono/request-id';
import type { Config, Env } from './env';

/** Hono's type parameter for this worker: bindings plus per-request variables. */
export interface AppEnv {
  Bindings: Env;
  Variables: RequestIdVariables & {
    config: Config;
    db: Db;
    /** Better Auth, created on first use in the request. */
    auth: () => Auth;
  };
}
