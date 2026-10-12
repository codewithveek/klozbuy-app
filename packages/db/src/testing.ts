/// <reference types="node" />
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { createConnection, createPool } from 'mysql2/promise';
import { DRIZZLE_CONFIG, type Db } from './client';

/**
 * Helpers for integration tests against a local TiDB (see the README). Production code
 * uses createDb, which talks HTTP to TiDB Cloud; these use a plain MySQL connection.
 */
export function createTestDb(url: string): { db: Db; close: () => Promise<void> } {
  const pool = createPool({ uri: url, connectionLimit: 4 });
  const db: Db = drizzle({ client: pool, mode: 'default', ...DRIZZLE_CONFIG });
  return { db, close: () => pool.end() };
}

const MIGRATIONS_FOLDER = decodeURIComponent(new URL('../drizzle', import.meta.url).pathname);

/** Drops and recreates the database named in the URL, then applies every migration. */
export async function resetTestDb(url: string): Promise<void> {
  const target = new URL(url);
  const database = target.pathname.slice(1);
  if (!/^[a-z0-9_]*test[a-z0-9_]*$/.test(database)) {
    throw new Error(`Refusing to reset "${database}": test database names must contain "test".`);
  }
  const server = await createConnection({ uri: new URL('/', target).toString() });
  await server.query(`DROP DATABASE IF EXISTS \`${database}\``);
  await server.query(`CREATE DATABASE \`${database}\``);
  await server.end();

  const connection = await createConnection({ uri: url });
  await migrate(drizzle({ client: connection }), { migrationsFolder: MIGRATIONS_FOLDER });
  await connection.end();
}
