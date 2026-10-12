import type { MyShop, ShopLocation, ShopPublic, ShopSummary } from '@klozbuy/contracts';
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

export function toShopLocation(location: LocationRow | null): ShopLocation | null {
  if (!location) return null;
  const { lat, lng, landmark, address, areaId } = location;
  return { lat, lng, landmark, address, areaId };
}

export function toShopPublic(shop: ShopRow, location: LocationRow | null): ShopPublic {
  return {
    ...toShopSummary(shop),
    categoryId: shop.categoryId,
    description: shop.description,
    verifiedAt: shop.verifiedAt?.toISOString() ?? null,
    location: toShopLocation(location),
    createdAt: shop.createdAt.toISOString(),
  };
}

export function toMyShop(shop: ShopRow, location: LocationRow | null): MyShop {
  return {
    ...toShopPublic(shop, location),
    whatsappNumber: shop.whatsappNumber,
    verificationStatus: shop.verificationStatus,
  };
}
