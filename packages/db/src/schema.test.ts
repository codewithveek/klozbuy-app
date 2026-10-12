import { getTableConfig, MySqlTable } from 'drizzle-orm/mysql-core';
import { describe, expect, it } from 'vitest';
import * as schema from './schema';

const tables = Object.values(schema).filter((value) => value instanceof MySqlTable);
const ID_TYPE = 'char(16) CHARACTER SET ascii COLLATE ascii_bin';
/** Better Auth's names for values issued by other systems (provider and its account ID). */
const EXTERNAL_IDS = new Set(['accountId', 'providerId']);

/**
 * Conventions from the system design doc, checked for every table. Column names here are
 * the schema keys; the driver turns them into snake_case.
 */
describe.each(tables.map((table) => [getTableConfig(table).name, table] as const))(
  '%s',
  (_, table) => {
    const { columns } = getTableConfig(table);

    it('has created_at and updated_at', () => {
      const names = columns.map((column) => column.name);
      expect(names).toEqual(expect.arrayContaining(['createdAt', 'updatedAt']));
    });

    it('stores every ID as a 16-character ASCII key', () => {
      const idColumns = columns.filter(
        (column) =>
          (column.name === 'id' || column.name.endsWith('Id')) && !EXTERNAL_IDS.has(column.name),
      );
      for (const column of idColumns) {
        expect(column.getSQLType(), column.name).toBe(ID_TYPE);
      }
    });

    it('never stores money as a float', () => {
      const moneyColumns = columns.filter((column) => column.name.endsWith('Ngn'));
      for (const column of moneyColumns) {
        expect(column.getSQLType(), column.name).toBe('bigint unsigned');
      }
    });
  },
);
