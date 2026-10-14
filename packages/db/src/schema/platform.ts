import { index, json, mysqlTable, primaryKey, smallint, varchar } from 'drizzle-orm/mysql-core';
import { primaryId, timestamps, utcDatetime } from '../columns';

/**
 * Cross-cutting tables. A domain write and its outbox row commit in one transaction;
 * a Cron job drains unsent rows into Queues, so no event is lost.
 */
export const outbox = mysqlTable(
  'outbox',
  {
    id: primaryId(),
    topic: varchar({ length: 64 }).notNull(),
    payload: json().$type<Record<string, unknown>>().notNull(),
    attempts: smallint({ unsigned: true }).notNull().default(0),
    sentAt: utcDatetime(),
    ...timestamps,
  },
  (t) => [index('outbox_unsent_idx').on(t.sentAt, t.createdAt)],
);

/** Remembers the first response to a write, so a client retry gets the same result. */
export const idempotencyKeys = mysqlTable(
  'idempotency_keys',
  {
    /** Who sent it: a user ID, or a hashed IP for signed-out requests. */
    scope: varchar({ length: 64 }).notNull(),
    key: varchar({ length: 64 }).notNull(),
    requestHash: varchar({ length: 64 }).notNull(),
    responseStatus: smallint({ unsigned: true }).notNull(),
    responseBody: json().notNull(),
    expiresAt: utcDatetime().notNull(),
    ...timestamps,
  },
  (t) => [
    primaryKey({ name: 'idempotency_keys_pk', columns: [t.scope, t.key] }),
    index('idempotency_keys_expiry_idx').on(t.expiresAt),
  ],
);
