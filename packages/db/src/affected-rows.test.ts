import { describe, expect, it } from 'vitest';
import { withMysqlAffectedRows, withoutWriteRowCount } from './affected-rows';

/** What @tidbcloud/serverless returns for a DELETE that removed one row. */
const deleteResult = {
  statement: 'delete from `verifications` where `id` = ?',
  types: {},
  rows: [],
  rowsAffected: 1,
  lastInsertId: '0',
  rowCount: 0,
};

describe('withoutWriteRowCount', () => {
  it('drops the returned-rows count from a write so rowsAffected is what readers see', () => {
    const result = withoutWriteRowCount(deleteResult) as Record<string, unknown>;
    expect(result).not.toHaveProperty('rowCount');
    expect(result.rowsAffected).toBe(1);
  });

  it('leaves selects (plain arrays) and other values alone', () => {
    const rows = [['a'], ['b']];
    expect(withoutWriteRowCount(rows)).toBe(rows);
    expect(withoutWriteRowCount(null)).toBeNull();
  });
});

describe('withMysqlAffectedRows', () => {
  function fakeConnection() {
    const tx = { execute: async () => deleteResult, commit: async () => deleteResult };
    return {
      label: 'connection',
      execute: async () => deleteResult,
      begin: async () => tx,
    };
  }

  it('fixes results from the connection and from transactions it begins', async () => {
    const connection = withMysqlAffectedRows(fakeConnection());
    expect(await connection.execute()).not.toHaveProperty('rowCount');
    const tx = await connection.begin();
    expect(await tx.execute()).not.toHaveProperty('rowCount');
    expect(await tx.commit()).toHaveProperty('rowCount');
  });

  it('passes other properties through', () => {
    expect(withMysqlAffectedRows(fakeConnection()).label).toBe('connection');
  });
});
