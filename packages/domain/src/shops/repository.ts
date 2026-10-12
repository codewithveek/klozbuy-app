import type { DbExecutor } from '@klozbuy/db';
import { shopLocations, shops, shopVerifications } from '@klozbuy/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export type ShopRow = typeof shops.$inferSelect;
export type LocationRow = typeof shopLocations.$inferSelect;

export async function insertShop(db: DbExecutor, values: typeof shops.$inferInsert) {
  await db.insert(shops).values(values);
}

export async function findShopById(db: DbExecutor, id: string): Promise<ShopRow | null> {
  const rows = await db.select().from(shops).where(eq(shops.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function findShopBySlug(db: DbExecutor, slug: string): Promise<ShopRow | null> {
  const rows = await db.select().from(shops).where(eq(shops.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function findShopsByOwner(db: DbExecutor, ownerId: string): Promise<ShopRow[]> {
  return db.select().from(shops).where(eq(shops.ownerId, ownerId)).orderBy(desc(shops.createdAt));
}

export async function shopSlugTaken(db: DbExecutor, slug: string): Promise<boolean> {
  return (await findShopBySlug(db, slug)) !== null;
}

export async function findPrimaryLocation(
  db: DbExecutor,
  shopId: string,
): Promise<LocationRow | null> {
  const rows = await db
    .select()
    .from(shopLocations)
    .where(and(eq(shopLocations.shopId, shopId), eq(shopLocations.isPrimary, true)))
    .limit(1);
  return rows[0] ?? null;
}

/** One primary location per shop for now: the new one replaces the old. */
export async function replacePrimaryLocation(
  db: DbExecutor,
  values: typeof shopLocations.$inferInsert,
) {
  await db.delete(shopLocations).where(eq(shopLocations.shopId, values.shopId));
  await db.insert(shopLocations).values({ ...values, isPrimary: true });
}

export async function insertVisit(db: DbExecutor, values: typeof shopVerifications.$inferInsert) {
  await db.insert(shopVerifications).values(values);
}

export async function updateVerification(
  db: DbExecutor,
  shopId: string,
  values: Pick<ShopRow, 'verificationStatus' | 'verifiedAt'>,
) {
  await db.update(shops).set(values).where(eq(shops.id, shopId));
}
