import type { DbExecutor } from '@klozbuy/db';
import { leadEvents, listingDailyStats, shopDailyStats } from '@klozbuy/db/schema';
import { and, count, desc, eq, gte, inArray, isNotNull, lt, sql, sum } from 'drizzle-orm';

export type LeadRow = typeof leadEvents.$inferSelect;

/** Records a tap. The ID is the event ID, so a repeated delivery is ignored. */
export async function insertLead(db: DbExecutor, values: typeof leadEvents.$inferInsert) {
  await db
    .insert(leadEvents)
    .values(values)
    .onDuplicateKeyUpdate({ set: { id: sql`id` } });
}

/** One more view for a listing and its shop today (upserts, so concurrent views add up). */
export async function addView(db: DbExecutor, listingId: string, shopId: string, day: string) {
  await db
    .insert(listingDailyStats)
    .values({ listingId, shopId, day, views: 1 })
    .onDuplicateKeyUpdate({ set: { views: sql`${listingDailyStats.views} + 1` } });
  await db
    .insert(shopDailyStats)
    .values({ shopId, day, views: 1 })
    .onDuplicateKeyUpdate({ set: { views: sql`${shopDailyStats.views} + 1` } });
}

const leadDay = sql<string>`DATE_FORMAT(${leadEvents.createdAt}, '%Y-%m-%d')`;

/** Lead counts per day and channel in [from, to); served by (shop_id, created_at). */
export async function countLeadsByDay(db: DbExecutor, shopId: string, from: Date, to: Date) {
  const day = leadDay.as('day');
  return db
    .select({ day, channel: leadEvents.channel, total: count() })
    .from(leadEvents)
    .where(
      and(
        eq(leadEvents.shopId, shopId),
        gte(leadEvents.createdAt, from),
        lt(leadEvents.createdAt, to),
      ),
    )
    .groupBy(day, leadEvents.channel);
}

export async function sumShopViews(
  db: DbExecutor,
  shopId: string,
  fromDay: string,
  toDay: string,
): Promise<number> {
  const rows = await db
    .select({ total: sum(shopDailyStats.views) })
    .from(shopDailyStats)
    .where(
      and(
        eq(shopDailyStats.shopId, shopId),
        gte(shopDailyStats.day, fromDay),
        lt(shopDailyStats.day, toDay),
      ),
    );
  return Number(rows[0]?.total ?? 0);
}

export async function leadDistances(db: DbExecutor, shopId: string, from: Date): Promise<number[]> {
  const rows = await db
    .select({ km: leadEvents.distanceKm })
    .from(leadEvents)
    .where(
      and(
        eq(leadEvents.shopId, shopId),
        gte(leadEvents.createdAt, from),
        isNotNull(leadEvents.distanceKm),
      ),
    );
  return rows.map((r) => r.km ?? 0);
}

export async function viewsByListing(db: DbExecutor, shopId: string, fromDay: string) {
  return db
    .select({ listingId: listingDailyStats.listingId, total: sum(listingDailyStats.views) })
    .from(listingDailyStats)
    .where(and(eq(listingDailyStats.shopId, shopId), gte(listingDailyStats.day, fromDay)))
    .groupBy(listingDailyStats.listingId);
}

export async function whatsappByListing(db: DbExecutor, shopId: string, from: Date) {
  return db
    .select({ listingId: leadEvents.listingId, total: count() })
    .from(leadEvents)
    .where(
      and(
        eq(leadEvents.shopId, shopId),
        eq(leadEvents.channel, 'whatsapp'),
        gte(leadEvents.createdAt, from),
      ),
    )
    .groupBy(leadEvents.listingId);
}

export async function recentLeads(db: DbExecutor, shopId: string, limit = 100): Promise<LeadRow[]> {
  return db
    .select()
    .from(leadEvents)
    .where(eq(leadEvents.shopId, shopId))
    .orderBy(desc(leadEvents.createdAt))
    .limit(limit);
}

/** A buyer's own contacts, newest first; served by (buyer_id, created_at). */
export async function buyerLeads(db: DbExecutor, buyerId: string, limit = 50): Promise<LeadRow[]> {
  return db
    .select()
    .from(leadEvents)
    .where(eq(leadEvents.buyerId, buyerId))
    .orderBy(desc(leadEvents.createdAt))
    .limit(limit);
}

export const listingIdsOf = (rows: { listingId: string | null }[]) => [
  ...new Set(rows.map((r) => r.listingId).filter((id): id is string => id !== null)),
];

export { inArray };
