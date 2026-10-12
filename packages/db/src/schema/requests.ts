import { REQUEST_STATUSES } from '@klozbuy/contracts';
import { index, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';
import {
  h3Cell,
  id,
  latitude,
  longitude,
  naira,
  primaryId,
  timestamps,
  utcDatetime,
} from '../columns';

/** Requests module: buyers post what they need, nearby shops send offers. */
export const buyerRequests = mysqlTable(
  'buyer_requests',
  {
    id: primaryId(),
    buyerId: id().notNull(),
    text: varchar({ length: 500 }).notNull(),
    categoryId: id(),
    budgetNgn: naira(),
    lat: latitude(),
    lng: longitude(),
    h3r7: h3Cell().notNull(),
    status: varchar({ length: 16, enum: REQUEST_STATUSES }).notNull().default('open'),
    expiresAt: utcDatetime().notNull(),
    ...timestamps,
  },
  (t) => [
    // Open requests near a shop.
    index('buyer_requests_area_idx').on(t.h3r7, t.status, t.categoryId, t.createdAt),
    index('buyer_requests_buyer_idx').on(t.buyerId, t.createdAt),
  ],
);

export const requestOffers = mysqlTable(
  'request_offers',
  {
    id: primaryId(),
    requestId: id().notNull(),
    shopId: id().notNull(),
    listingId: id(),
    priceNgn: naira().notNull(),
    message: varchar({ length: 500 }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('request_offers_one_per_shop_uq').on(t.requestId, t.shopId),
    index('request_offers_request_idx').on(t.requestId, t.createdAt),
  ],
);
