import { resetTestDb } from '@klozbuy/db/testing';
import type { TestProject } from 'vitest/node';

/**
 * Database tests run when TEST_DATABASE_URL points at a TiDB (CI starts one; see the
 * README for running it locally). The database is recreated and migrated once per run.
 * The provided value is typed in src/vitest.d.ts.
 */
export default async function setup(project: TestProject) {
  const url = process.env.TEST_DATABASE_URL ?? null;
  if (url) await resetTestDb(url);
  project.provide('testDatabaseUrl', url);
}
