import type { DbExecutor } from '@klozbuy/db';
import { buyerRequests, requestOffers } from '@klozbuy/db/schema';
import { and, count, desc, eq, gt, inArray } from 'drizzle-orm';

export type RequestRow = typeof buyerRequests.$inferSelect;
export type OfferRow = typeof requestOffers.$inferSelect;

export async function insertRequest(db: DbExecutor, values: typeof buyerRequests.$inferInsert) {
  await db.insert(buyerRequests).values(values);
}

export async function findRequestById(db: DbExecutor, id: string): Promise<RequestRow | null> {
  const [row] = await db.select().from(buyerRequests).where(eq(buyerRequests.id, id)).limit(1);
  return row ?? null;
}

const MAX_NEARBY = 200;

/** Open, unexpired requests in the cells; served by (h3r7, status, category, created_at). */
export async function findOpenRequests(db: DbExecutor, cells: string[], now: Date) {
  return db
    .select()
    .from(buyerRequests)
    .where(
      and(
        inArray(buyerRequests.h3r7, cells),
        eq(buyerRequests.status, 'open'),
        gt(buyerRequests.expiresAt, now),
      ),
    )
    .orderBy(desc(buyerRequests.createdAt))
    .limit(MAX_NEARBY);
}

export async function findBuyerRequests(db: DbExecutor, buyerId: string) {
  return db
    .select()
    .from(buyerRequests)
    .where(eq(buyerRequests.buyerId, buyerId))
    .orderBy(desc(buyerRequests.createdAt))
    .limit(50);
}

export async function setRequestStatus(db: DbExecutor, id: string, status: RequestRow['status']) {
  await db.update(buyerRequests).set({ status }).where(eq(buyerRequests.id, id));
}

/** Offers per request, for the "3 offers" counts. */
export async function countOffers(db: DbExecutor, requestIds: string[]) {
  if (requestIds.length === 0) return new Map<string, number>();
  const rows = await db
    .select({ requestId: requestOffers.requestId, total: count() })
    .from(requestOffers)
    .where(inArray(requestOffers.requestId, requestIds))
    .groupBy(requestOffers.requestId);
  return new Map(rows.map((row) => [row.requestId, row.total]));
}

/** Which of the requests this shop already answered. */
export async function offeredBy(db: DbExecutor, shopId: string, requestIds: string[]) {
  if (requestIds.length === 0) return new Set<string>();
  const rows = await db
    .select({ requestId: requestOffers.requestId })
    .from(requestOffers)
    .where(and(eq(requestOffers.shopId, shopId), inArray(requestOffers.requestId, requestIds)));
  return new Set(rows.map((row) => row.requestId));
}

export async function insertOffer(db: DbExecutor, values: typeof requestOffers.$inferInsert) {
  await db.insert(requestOffers).values(values);
}

export async function findOffer(db: DbExecutor, requestId: string, shopId: string) {
  const [row] = await db
    .select()
    .from(requestOffers)
    .where(and(eq(requestOffers.requestId, requestId), eq(requestOffers.shopId, shopId)))
    .limit(1);
  return row ?? null;
}

export async function findOfferById(db: DbExecutor, id: string): Promise<OfferRow | null> {
  const [row] = await db.select().from(requestOffers).where(eq(requestOffers.id, id)).limit(1);
  return row ?? null;
}

export async function findOffers(db: DbExecutor, requestId: string) {
  return db
    .select()
    .from(requestOffers)
    .where(eq(requestOffers.requestId, requestId))
    .orderBy(requestOffers.priceNgn);
}
