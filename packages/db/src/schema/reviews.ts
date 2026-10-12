import { REVIEW_STATUSES } from '@klozbuy/contracts';
import { index, mysqlTable, text, tinyint, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';
import { id, primaryId, timestamps } from '../columns';

/** Reviews module. A review needs a lead the buyer confirmed as a purchase. */
export const reviews = mysqlTable(
  'reviews',
  {
    id: primaryId(),
    shopId: id().notNull(),
    leadId: id().notNull(),
    buyerId: id().notNull(),
    rating: tinyint({ unsigned: true }).notNull(),
    body: text(),
    status: varchar({ length: 16, enum: REVIEW_STATUSES }).notNull().default('published'),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('reviews_lead_uq').on(t.leadId),
    index('reviews_shop_idx').on(t.shopId, t.status, t.createdAt),
  ],
);
