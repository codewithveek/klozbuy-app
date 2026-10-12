import type { Area, FeedItem } from '@klozbuy/contracts';
import type { Ranked } from './ranking';
import type { AreaRow, SearchRow } from './repository';

export function toFeedItem({ item, distanceKm, boosted }: Ranked<SearchRow>): FeedItem {
  return {
    listingId: item.listingId,
    slug: item.slug,
    type: item.type,
    title: item.title,
    priceNgn: item.priceNgn,
    negotiable: item.negotiable,
    condition: item.condition,
    stockStatus: item.stockStatus,
    landmark: item.landmark,
    distanceKm: Math.round(distanceKm * 10) / 10,
    boosted,
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

export function toArea(row: AreaRow): Area {
  return { id: row.id, slug: row.slug, name: row.name, city: row.city, lat: row.lat, lng: row.lng };
}
