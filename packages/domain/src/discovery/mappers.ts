import type { FeedItem } from '@klozbuy/contracts';
import { parseDays } from '@klozbuy/shared';
import { roundPoint } from '@klozbuy/shared/geo';
import type { Ranked } from './ranking';
import type { SearchRow } from './repository';

export function toFeedItem({ item, distanceKm, boosted }: Ranked<SearchRow>): FeedItem {
  const pin = roundPoint(item);
  return {
    listingId: item.listingId,
    slug: item.slug,
    type: item.type,
    title: item.title,
    summary: item.summary,
    priceNgn: item.priceNgn,
    negotiable: item.negotiable,
    condition: item.condition,
    categoryId: item.categoryId,
    stockStatus: item.stockStatus,
    landmark: item.landmark,
    lat: pin.lat,
    lng: pin.lng,
    distanceKm: Math.round(distanceKm * 10) / 10,
    boosted,
    hours: { opensAt: item.opensAt, closesAt: item.closesAt, openDays: parseDays(item.openDays) },
    shop: {
      id: item.shopId,
      slug: item.shopSlug,
      name: item.shopName,
      verified: item.verified,
      ratingAvg: item.ratingAvg,
      ratingCount: item.ratingCount,
    },
  };
}
