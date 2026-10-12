import { useNearbyFeed, useSearch } from '@klozbuy/api-client';
import type { FeedItem, Listing } from '@klozbuy/contracts';
import { useBuyerLocation } from '../location/LocationProvider';
import { filterQuery, type FeedFilters } from './feed-filters';

interface FeedOptions {
  q?: string;
  type?: Listing['type'];
  limit?: number;
}

type FeedQuery = ReturnType<typeof useNearbyFeed>;

/** Pages flattened into one list, with the paging state the screens need. */
function pageState(query: FeedQuery) {
  const pages = query.data?.pages ?? [];
  const items: FeedItem[] = pages.flatMap((page) => page.items);
  return {
    items,
    total: pages[0]?.total ?? 0,
    loading: query.isPending,
    hasMore: query.hasNextPage,
    loadingMore: query.isFetchingNextPage,
    more: () => query.fetchNextPage(),
  };
}

/** The near-me feed or, with words, search results, for the buyer's place and filters. */
export function useFeed(filters: FeedFilters, { q = '', type, limit = 20 }: FeedOptions = {}) {
  const { location, radiusKm } = useBuyerLocation();
  const base = {
    lat: location.lat,
    lng: location.lng,
    radiusKm,
    type,
    limit,
    ...filterQuery(filters),
  };
  const searching = q.length >= 2;
  const feed = useNearbyFeed(base, !searching);
  const search = useSearch({ ...base, q }, searching);
  return pageState(searching ? search : feed);
}
