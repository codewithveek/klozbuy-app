import type { FeedItem, Listing } from '@klozbuy/contracts';
import { formatDistance, stockLine } from '../../lib/format';
import type { ListingCardData } from './ListingCard';

export function fromFeedItem(item: FeedItem): ListingCardData & { key: string } {
  return {
    key: item.listingId,
    ...item,
    meta: `${formatDistance(item.distanceKm)} · ${item.landmark}`,
    shop: { name: item.shop.name, verified: item.shop.verified },
  };
}

export function fromListing(listing: Listing, now: Date): ListingCardData & { key: string } {
  return { key: listing.id, ...listing, meta: stockLine(listing, now) };
}
