import { createId, ID_LENGTH } from '@klozbuy/shared';
import { sql } from 'drizzle-orm';
import { bigint, customType, datetime, double } from 'drizzle-orm/mysql-core';

/**
 * Column helpers shared by every table, so each convention from the system design doc
 * is written once. Column names come from the keys (snake_case), see `casing` in client.ts.
 */

/** Fixed-length ASCII text compared byte for byte. IDs mix upper and lower case. */
function asciiChar(length: number) {
  return customType<{ data: string; driverData: string }>({
    dataType: () => `char(${length}) CHARACTER SET ascii COLLATE ascii_bin`,
  })();
}

/** Random 16-character ID created in the app. Random keys spread TiDB writes across regions. */
export const id = () => asciiChar(ID_LENGTH);

/** Primary key that fills itself with a new random ID on insert. */
export const primaryId = () =>
  id()
    .primaryKey()
    .$defaultFn(() => createId());

/** An H3 cell index such as 872a1072bffffff. */
export const h3Cell = () => asciiChar(15);

/** Whole naira. Never kobo, never floats. */
export const naira = () => bigint({ mode: 'number', unsigned: true });

export const latitude = () => double().notNull();
export const longitude = () => double().notNull();

/** UTC time with millisecond precision. */
export const utcDatetime = () => datetime({ mode: 'date', fsp: 3 });

/** created_at and updated_at, present on every table. */
export const timestamps = {
  createdAt: utcDatetime()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: utcDatetime()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .$onUpdate(() => new Date()),
};
