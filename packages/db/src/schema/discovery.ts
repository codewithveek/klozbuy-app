import { CONDITIONS, LISTING_STATUSES, LISTING_TYPES } from '@klozbuy/contracts';
import {
  boolean,
  double,
  index,
  int,
  mysqlTable,
  primaryKey,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';
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

/**
 * Discovery module. listing_search is a read model: one row per listing with everything
 * a feed card shows, kept current from catalog and shops events, so the feed never joins.
 */
export const areas = mysqlTable(
  'areas',
  {
    id: primaryId(),
    slug: varchar({ length: 80 }).notNull(),
    name: varchar({ length: 80 }).notNull(),
    city: varchar({ length: 80 }).notNull(),
    state: varchar({ length: 40 }).notNull(),
    lat: latitude(),
    lng: longitude(),
    ...timestamps,
  },
  (t) => [uniqueIndex('areas_slug_uq').on(t.slug)],
);

export const listingSearch = mysqlTable(
  'listing_search',
  {
    listingId: id().primaryKey(),
    slug: varchar({ length: 80 }).notNull(),
    type: varchar({ length: 16, enum: LISTING_TYPES }).notNull(),
    title: varchar({ length: 120 }).notNull(),
    priceNgn: naira().notNull(),
    negotiable: boolean().notNull(),
    condition: varchar({ length: 16, enum: CONDITIONS }),
    coverImageKey: varchar({ length: 255 }),
    categoryId: id().notNull(),
    status: varchar({ length: 16, enum: LISTING_STATUSES }).notNull(),
    shopId: id().notNull(),
    shopSlug: varchar({ length: 80 }).notNull(),
    shopName: varchar({ length: 100 }).notNull(),
    verified: boolean().notNull(),
    ratingAvg: double(),
    ratingCount: int({ unsigned: true }).notNull().default(0),
    areaId: id(),
    landmark: varchar({ length: 150 }).notNull(),
    lat: latitude(),
    lng: longitude(),
    h3r7: h3Cell().notNull(),
    h3r8: h3Cell().notNull(),
    /** Ordering score for category and area pages; higher first. */
    rank: int().notNull().default(0),
    boostedUntil: utcDatetime(),
    ...timestamps,
  },
  (t) => [
    // Near-me feed within 3 to 10 km, and within 1 km.
    index('listing_search_r7_idx').on(t.h3r7, t.status, t.categoryId),
    index('listing_search_r8_idx').on(t.h3r8, t.status, t.categoryId),
    // Category and area pages.
    index('listing_search_area_idx').on(t.areaId, t.categoryId, t.status, t.rank),
    index('listing_search_shop_idx').on(t.shopId),
    // Sitemaps.
    index('listing_search_status_idx').on(t.status, t.updatedAt),
  ],
);

/** Inverted index for text search: one row per normalized word per listing. */
export const searchTerms = mysqlTable(
  'search_terms',
  {
    term: varchar({ length: 40 }).notNull(),
    h3r7: h3Cell().notNull(),
    listingId: id().notNull(),
    ...timestamps,
  },
  (t) => [
    // "iphone" near a point is one range scan on the primary key.
    primaryKey({ name: 'search_terms_pk', columns: [t.term, t.h3r7, t.listingId] }),
    index('search_terms_listing_idx').on(t.listingId),
  ],
);
