import type { DbExecutor } from '@klozbuy/db';
import { findPlace } from '../places';
import { toShopHours, toShopSummary } from './mappers';
import { findPrimaryLocation, findShopById, type LocationRow } from './repository';

export async function areaNameOf(
  db: DbExecutor,
  location: LocationRow | null,
): Promise<string | null> {
  return location?.areaId ? ((await findPlace(db, location.areaId))?.name ?? null) : null;
}

/** What discovery copies into its read model, and what pages and lead links need. */
export async function getShopSnapshot(db: DbExecutor, shopId: string) {
  const shop = await findShopById(db, shopId);
  if (!shop) return null;
  const location = await findPrimaryLocation(db, shopId);
  return {
    ...toShopSummary(shop),
    listable: shop.verificationStatus !== 'suspended',
    whatsappNumber: shop.whatsappNumber,
    hours: toShopHours(shop),
    location,
    areaName: await areaNameOf(db, location),
  };
}

export type ShopSnapshot = NonNullable<Awaited<ReturnType<typeof getShopSnapshot>>>;
