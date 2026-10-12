// Creates the database named in DATABASE_URL if it does not exist, so `pnpm migrate` can run
// against a fresh local TiDB. TiDB Cloud databases are created in the console instead.
import { createConnection } from 'mysql2/promise';

const url = new URL(process.env.DATABASE_URL ?? '');
const database = url.pathname.slice(1);
if (!/^[A-Za-z0-9_]+$/.test(database)) {
  console.error('Set DATABASE_URL to mysql://user:password@host:port/database');
  process.exit(1);
}
const server = await createConnection({ uri: new URL('/', url).toString() });
await server.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
await server.end();
console.info(`Database ${database} is ready.`);
