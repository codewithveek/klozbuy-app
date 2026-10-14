import { defineConfig } from 'drizzle-kit';

/**
 * `pnpm generate` writes SQL migrations from the schema (no database needed).
 * `pnpm migrate` applies them; DATABASE_URL must include TLS for TiDB Cloud, see .env.example.
 */
export default defineConfig({
  dialect: 'mysql',
  schema: './src/schema/index.ts',
  out: './drizzle',
  casing: 'snake_case',
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
});
