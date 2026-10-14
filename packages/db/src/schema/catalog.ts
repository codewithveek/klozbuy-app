import { CONDITIONS, LISTING_STATUSES, LISTING_TYPES, STOCK_STATUSES } from '@klozbuy/contracts';
import {
  boolean,
  index,
  int,
  mysqlTable,
  smallint,
  text,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';
import { id, naira, primaryId, timestamps, utcDatetime } from '../columns';

/** Catalog module. */
export const categories = mysqlTable(
  'categories',
  {
    id: primaryId(),
    parentId: id(),
    slug: varchar({ length: 80 }).notNull(),
    name: varchar({ length: 80 }).notNull(),
    type: varchar({ length: 16, enum: LISTING_TYPES }).notNull(),
    position: smallint({ unsigned: true }).notNull().default(0),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('categories_slug_uq').on(t.slug),
    index('categories_parent_idx').on(t.parentId, t.position),
  ],
);

export const listings = mysqlTable(
  'listings',
  {
    id: primaryId(),
    shopId: id().notNull(),
    slug: varchar({ length: 80 }).notNull(),
    type: varchar({ length: 16, enum: LISTING_TYPES }).notNull(),
    title: varchar({ length: 120 }).notNull(),
    description: text(),
    priceNgn: naira().notNull(),
    negotiable: boolean().notNull().default(false),
    condition: varchar({ length: 16, enum: CONDITIONS }),
    stockStatus: varchar({ length: 16, enum: STOCK_STATUSES }).notNull().default('in_stock'),
    /** Last time the seller confirmed the item is still available. */
    stockConfirmedAt: utcDatetime(),
    status: varchar({ length: 16, enum: LISTING_STATUSES }).notNull().default('draft'),
    categoryId: id().notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('listings_slug_uq').on(t.slug),
    // Seller dashboard: a shop's listings by status, most recently changed first.
    index('listings_shop_status_idx').on(t.shopId, t.status, t.updatedAt),
  ],
);

export const listingMedia = mysqlTable(
  'listing_media',
  {
    id: primaryId(),
    listingId: id().notNull(),
    /** Object key in R2; resized variants are served by Cloudflare Images. */
    objectKey: varchar({ length: 255 }).notNull(),
    width: int({ unsigned: true }).notNull(),
    height: int({ unsigned: true }).notNull(),
    position: smallint({ unsigned: true }).notNull().default(0),
    ...timestamps,
  },
  (t) => [index('listing_media_listing_idx').on(t.listingId, t.position)],
);
