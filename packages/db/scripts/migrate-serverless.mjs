// Applies the SQL migrations in ./drizzle to a TiDB Cloud database over its HTTPS driver, and
// creates the database first if it does not exist. `pnpm migrate` (drizzle-kit) needs a direct
// MySQL connection on port 4000; use this where only HTTPS gets out, e.g. a CI job or a
// cloud sandbox. It records migrations in the same table, so the two can be mixed.
import { connect } from '@tidbcloud/serverless';
import { drizzle } from 'drizzle-orm/tidb-serverless';
import { migrate } from 'drizzle-orm/tidb-serverless/migrator';
import { fileURLToPath } from 'node:url';

const url = new URL(process.env.DATABASE_URL ?? '');
const database = url.pathname.slice(1);
if (!/^[A-Za-z0-9_]+$/.test(database)) {
  console.error('Set DATABASE_URL to mysql://user:password@host:4000/database');
  process.exit(1);
}

const server = new URL('/', url);
await connect({ url: server.toString() }).execute(`CREATE DATABASE IF NOT EXISTS \`${database}\``);

const client = connect({ url: url.toString() });
await migrate(drizzle({ client, casing: 'snake_case' }), {
  migrationsFolder: fileURLToPath(new URL('../drizzle', import.meta.url)),
});
console.info(`Database ${database} is migrated.`);
