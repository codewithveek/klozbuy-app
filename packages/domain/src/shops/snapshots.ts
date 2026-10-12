import type { DbExecutor } from '@klozbuy/db';
import { toShopSummary } from './mappers';
import { findPrimaryLocation, findShopById } from './repository';

/** What discovery copies into its read model and what lead links need. */
export async function getShopSnapshot(db: DbExecutor, shopId: string) {
  const shop = await findShopById(db, shopId);
  if (!shop) return null;
  const location = await findPrimaryLocation(db, shopId);
  return {
    ...toShopSummary(shop),
    listable: shop.verificationStatus !== 'suspended',
    whatsappNumber: shop.whatsappNumber,
    location,
  };
}

export type ShopSnapshot = NonNullable<Awaited<ReturnType<typeof getShopSnapshot>>>;
