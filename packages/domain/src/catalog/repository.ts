import type { DbExecutor } from '@klozbuy/db';
import { categories, listings } from '@klozbuy/db/schema';
import { and, asc, desc, eq, inArray } from 'drizzle-orm';

export type ListingRow = typeof listings.$inferSelect;
export type CategoryRow = typeof categories.$inferSelect;
type ListingStatus = ListingRow['status'];

export async function insertListing(db: DbExecutor, values: typeof listings.$inferInsert) {
  await db.insert(listings).values(values);
}

export async function updateListingRow(
  db: DbExecutor,
  id: string,
  values: Partial<typeof listings.$inferInsert>,
) {
  await db.update(listings).set(values).where(eq(listings.id, id));
}

export async function findListingById(db: DbExecutor, id: string): Promise<ListingRow | null> {
  const rows = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function findListingBySlug(db: DbExecutor, slug: string): Promise<ListingRow | null> {
  const rows = await db.select().from(listings).where(eq(listings.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function listingSlugTaken(db: DbExecutor, slug: string): Promise<boolean> {
  return (await findListingBySlug(db, slug)) !== null;
}

/** A shop's listings with the given statuses, most recently changed first. */
export async function findShopListings(db: DbExecutor, shopId: string, statuses: ListingStatus[]) {
  return db
    .select()
    .from(listings)
    .where(and(eq(listings.shopId, shopId), inArray(listings.status, statuses)))
    .orderBy(desc(listings.updatedAt))
    .limit(200);
}

export async function findCategories(db: DbExecutor): Promise<CategoryRow[]> {
  return db.select().from(categories).orderBy(asc(categories.position));
}

export async function findCategory(db: DbExecutor, id: string): Promise<CategoryRow | null> {
  const rows = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return rows[0] ?? null;
}
