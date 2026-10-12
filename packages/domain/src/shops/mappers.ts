import type { MyShop, ShopHours, ShopLocation, ShopPublic, ShopSummary } from '@klozbuy/contracts';
import { parseDays } from '@klozbuy/shared';
import type { LocationRow, ShopRow } from './repository';

export function toShopSummary(shop: ShopRow): ShopSummary {
  return {
    id: shop.id,
    slug: shop.slug,
    name: shop.name,
    verified: shop.verificationStatus === 'verified',
    ratingAvg: shop.ratingAvg,
    ratingCount: shop.ratingCount,
  };
}

export function toShopHours(row: Pick<ShopRow, 'opensAt' | 'closesAt' | 'openDays'>): ShopHours {
  return { opensAt: row.opensAt, closesAt: row.closesAt, openDays: parseDays(row.openDays) };
}

export function toShopLocation(
  location: LocationRow | null,
  areaName: string | null = null,
): ShopLocation | null {
  if (!location) return null;
  const { lat, lng, landmark, address, areaId } = location;
  return { lat, lng, landmark, address, areaId, areaName };
}

export function toShopPublic(
  shop: ShopRow,
  location: LocationRow | null,
  areaName: string | null,
): ShopPublic {
  return {
    ...toShopSummary(shop),
    categoryId: shop.categoryId,
    description: shop.description,
    verifiedAt: shop.verifiedAt?.toISOString() ?? null,
    location: toShopLocation(location, areaName),
    hours: toShopHours(shop),
    createdAt: shop.createdAt.toISOString(),
  };
}

export function toMyShop(
  shop: ShopRow,
  location: LocationRow | null,
  areaName: string | null,
): MyShop {
  return {
    ...toShopPublic(shop, location, areaName),
    whatsappNumber: shop.whatsappNumber,
    verificationStatus: shop.verificationStatus,
  };
}
