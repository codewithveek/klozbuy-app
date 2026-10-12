import { REPORT_REASONS, REPORT_STATUSES, REPORT_TARGETS } from '@klozbuy/contracts';
import { index, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { id, primaryId, timestamps } from '../columns';

/** Moderation module. */
export const reports = mysqlTable(
  'reports',
  {
    id: primaryId(),
    reporterId: id(),
    targetType: varchar({ length: 16, enum: REPORT_TARGETS }).notNull(),
    targetId: id().notNull(),
    reason: varchar({ length: 32, enum: REPORT_REASONS }).notNull(),
    details: varchar({ length: 1000 }),
    status: varchar({ length: 16, enum: REPORT_STATUSES }).notNull().default('open'),
    ...timestamps,
  },
  (t) => [
    index('reports_queue_idx').on(t.status, t.createdAt),
    index('reports_target_idx').on(t.targetType, t.targetId),
  ],
);
