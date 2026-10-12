import { VERIFICATION_STATUSES, VERIFICATION_VISIT_RESULTS } from '@klozbuy/contracts';
import {
  boolean,
  double,
  index,
  int,
  mysqlTable,
  text,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';
import { h3Cell, id, latitude, longitude, primaryId, timestamps, utcDatetime } from '../columns';

/** Shops module. */
export const shops = mysqlTable(
  'shops',
  {
    id: primaryId(),
    ownerId: id().notNull(),
    slug: varchar({ length: 80 }).notNull(),
    name: varchar({ length: 100 }).notNull(),
    categoryId: id().notNull(),
    description: varchar({ length: 500 }),
    whatsappNumber: varchar({ length: 16 }).notNull(),
    verificationStatus: varchar({ length: 16, enum: VERIFICATION_STATUSES })
      .notNull()
      .default('unverified'),
    verifiedAt: utcDatetime(),
    /** Opening hours in Lagos time, "08:00"; days are ISO weekdays, "1,2,3,4,5,6". */
    opensAt: varchar({ length: 5 }),
    closesAt: varchar({ length: 5 }),
    openDays: varchar({ length: 16 }).notNull().default('1,2,3,4,5,6'),
    /** Derived from published reviews by the reviews module's events. */
    ratingAvg: double(),
    ratingCount: int({ unsigned: true }).notNull().default(0),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('shops_slug_uq').on(t.slug),
    index('shops_owner_idx').on(t.ownerId),
    // Verification visit queue.
    index('shops_verification_idx').on(t.verificationStatus, t.createdAt),
  ],
);

export const shopLocations = mysqlTable(
  'shop_locations',
  {
    id: primaryId(),
    shopId: id().notNull(),
    lat: latitude(),
    lng: longitude(),
    h3r7: h3Cell().notNull(),
    h3r8: h3Cell().notNull(),
    /** How buyers find the shop: "Opposite Tejuosho Market, Gate 2". */
    landmark: varchar({ length: 150 }).notNull(),
    address: varchar({ length: 255 }),
    areaId: id(),
    isPrimary: boolean().notNull().default(true),
    ...timestamps,
  },
  (t) => [
    index('shop_locations_shop_idx').on(t.shopId),
    index('shop_locations_h3r7_idx').on(t.h3r7),
  ],
);

/** Each in-person verification visit by a field agent. */
export const shopVerifications = mysqlTable(
  'shop_verifications',
  {
    id: primaryId(),
    shopId: id().notNull(),
    agentId: id().notNull(),
    scheduledFor: utcDatetime(),
    visitedAt: utcDatetime(),
    result: varchar({ length: 16, enum: VERIFICATION_VISIT_RESULTS }),
    notes: text(),
    ...timestamps,
  },
  (t) => [
    index('shop_verifications_shop_idx').on(t.shopId, t.createdAt),
    index('shop_verifications_agent_idx').on(t.agentId, t.scheduledFor),
  ],
);
