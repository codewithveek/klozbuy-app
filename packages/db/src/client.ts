import { connect } from '@tidbcloud/serverless';
import type {
  MySqlDatabase,
  MySqlQueryResultHKT,
  PreparedQueryHKTBase,
} from 'drizzle-orm/mysql-core';
import { drizzle } from 'drizzle-orm/tidb-serverless';
import * as schema from './schema';

export interface DbOptions {
  /** TiDB Cloud connection URL: mysql://user:password@host/database */
  url: string;
  /** Queries slower than this are aborted, so a slow database cannot hang a request. */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 3_000;

/** Shared by every driver, so repositories run on TiDB's HTTP driver and in tests alike. */
export const DRIZZLE_CONFIG = { schema, casing: 'snake_case' } as const;

/** Any Drizzle MySQL database over this schema. Repositories depend on this, not a driver. */
export type Db = MySqlDatabase<MySqlQueryResultHKT, PreparedQueryHKTBase, typeof schema>;

/** A transaction handle; accepts the same queries as Db. */
export type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];

/** Repositories accept either, so a service can run them inside or outside a transaction. */
export type DbExecutor = Db | Tx;

/**
 * Creates a database handle over TiDB's HTTP driver. Create one per request (it holds no
 * open connection) and pass it to services through ctx; never keep it in a module global.
 */
export function createDb({ url, timeoutMs = DEFAULT_TIMEOUT_MS }: DbOptions): Db {
  const client = connect({
    url,
    fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(timeoutMs) }),
  });
  return drizzle({ client, ...DRIZZLE_CONFIG });
}
