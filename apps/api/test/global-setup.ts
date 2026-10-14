import { resetTestDb } from '@klozbuy/db/testing';
import type { TestProject } from 'vitest/node';

/**
 * API database tests use their own database (the domain tests reset theirs in parallel),
 * named after TEST_DATABASE_URL's with an "_api" suffix. Typed in src/vitest.d.ts.
 */
export default async function setup(project: TestProject) {
  const base = process.env.TEST_DATABASE_URL;
  const url = base ? base.replace(/\/([^/?]+)(\?|$)/, '/$1_api$2') : null;
  if (url) await resetTestDb(url);
  project.provide('apiTestDatabaseUrl', url);
}
