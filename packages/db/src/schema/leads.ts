import { LEAD_CHANNELS, LEAD_OUTCOMES } from '@klozbuy/contracts';
import { date, double, index, int, mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core';
import { id, timestamps, utcDatetime } from '../columns';

/** Leads module. */
export const leadEvents = mysqlTable(
  'lead_events',
  {
    /** The event ID from the queue message, so a redelivered message is ignored. */
    id: id().primaryKey(),
    listingId: id(),
    shopId: id().notNull(),
    buyerId: id(),
    channel: varchar({ length: 16, enum: LEAD_CHANNELS }).notNull(),
    /** How far the buyer was from the shop when they tapped, when the app knew. */
    distanceKm: double(),
    /** Set when the buyer contacted a shop about its offer on their request. */
    offerId: id(),
    outcome: varchar({ length: 16, enum: LEAD_OUTCOMES }).notNull().default('unknown'),
    /** When the next-day "did you buy?" message went out. */
    followedUpAt: utcDatetime(),
    ...timestamps,
  },
  (t) => [
    index('lead_events_shop_idx').on(t.shopId, t.createdAt),
    index('lead_events_follow_up_idx').on(t.followedUpAt, t.createdAt),
    index('lead_events_buyer_idx').on(t.buyerId, t.createdAt),
  ],
);

/** Hourly rollup of Analytics Engine counts, read by the seller dashboard. */
export const shopDailyStats = mysqlTable(
  'shop_daily_stats',
  {
    shopId: id().notNull(),
    day: date({ mode: 'string' }).notNull(),
    views: int({ unsigned: true }).notNull().default(0),
    whatsappTaps: int({ unsigned: true }).notNull().default(0),
    calls: int({ unsigned: true }).notNull().default(0),
    directions: int({ unsigned: true }).notNull().default(0),
    ...timestamps,
  },
  (t) => [primaryKey({ name: 'shop_daily_stats_pk', columns: [t.shopId, t.day] })],
);

/** Listing page views per day, counted when the page opens. */
export const listingDailyStats = mysqlTable(
  'listing_daily_stats',
  {
    listingId: id().notNull(),
    day: date({ mode: 'string' }).notNull(),
    shopId: id().notNull(),
    views: int({ unsigned: true }).notNull().default(0),
    ...timestamps,
  },
  (t) => [
    primaryKey({ name: 'listing_daily_stats_pk', columns: [t.listingId, t.day] }),
    index('listing_daily_stats_shop_idx').on(t.shopId, t.day),
  ],
);
