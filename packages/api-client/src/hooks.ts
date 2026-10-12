import type {
  CreateListingInput,
  CreateShopWithLocationInput,
  Listing,
  ListingDetail,
  ShopPublic,
  NearbyFeedQuery,
  SearchQuery,
  SetListingStatusInput,
} from '@klozbuy/contracts';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from './provider';

/** Query keys in one place, so mutations know what to refresh. */
export const keys = {
  categories: ['categories'] as const,
  areas: ['areas'] as const,
  feed: (input: Omit<NearbyFeedQuery, 'cursor'>) => ['feed', input] as const,
  search: (input: Omit<SearchQuery, 'cursor'>) => ['search', input] as const,
  listing: (slug: string) => ['listing', slug] as const,
  shop: (slug: string) => ['shop', slug] as const,
  shopListings: (slug: string) => ['shop-listings', slug] as const,
  myShops: ['my-shops'] as const,
  myShop: (id: string) => ['my-shop', id] as const,
  myListings: (id: string) => ['my-listings', id] as const,
  stats: (id: string) => ['shop-stats', id] as const,
};

const HOUR = 60 * 60 * 1000;

export function useCategories() {
  const api = useApiClient();
  return useQuery({ queryKey: keys.categories, queryFn: api.catalog.categories, staleTime: HOUR });
}

export function useAreas() {
  const api = useApiClient();
  return useQuery({ queryKey: keys.areas, queryFn: api.discovery.areas, staleTime: HOUR });
}

/** The near-me feed, a page at a time. */
export function useNearbyFeed(input: Omit<NearbyFeedQuery, 'cursor'>) {
  const api = useApiClient();
  return useInfiniteQuery({
    queryKey: keys.feed(input),
    queryFn: ({ pageParam }) => api.discovery.nearby({ ...input, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

export function useSearch(input: Omit<SearchQuery, 'cursor'>, enabled = true) {
  const api = useApiClient();
  return useInfiniteQuery({
    queryKey: keys.search(input),
    enabled,
    queryFn: ({ pageParam }) => api.discovery.search({ ...input, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

export function useMyShops(enabled = true) {
  const api = useApiClient();
  return useQuery({ queryKey: keys.myShops, queryFn: api.shops.mine, enabled });
}

export function useMyShop(id: string) {
  const api = useApiClient();
  return useQuery({ queryKey: keys.myShop(id), queryFn: () => api.shops.myShop(id) });
}

export function useMyListings(shopId: string) {
  const api = useApiClient();
  return useQuery({
    queryKey: keys.myListings(shopId),
    queryFn: () => api.shops.myListings(shopId),
  });
}

export function useShopStats(shopId: string) {
  const api = useApiClient();
  return useQuery({ queryKey: keys.stats(shopId), queryFn: () => api.shops.stats(shopId) });
}

export function useCreateShop() {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateShopWithLocationInput) => api.shops.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.myShops }),
  });
}

/** Refreshes everything a listing change can affect: the seller's list and the feeds. */
function useListingMutation<Input>(mutate: (input: Input) => Promise<{ shopId: string }>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutate,
    onSuccess: async (listing) => {
      await queryClient.invalidateQueries({ queryKey: keys.myListings(listing.shopId) });
      await queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useCreateListing() {
  const api = useApiClient();
  return useListingMutation((input: CreateListingInput) => api.catalog.create(input));
}

export function useSetListingStatus() {
  const api = useApiClient();
  return useListingMutation((input: { id: string } & SetListingStatusInput) =>
    api.catalog.setStatus(input.id, { status: input.status }),
  );
}

export function useConfirmStock() {
  const api = useApiClient();
  return useListingMutation((id: string) => api.catalog.confirmStock(id));
}

/** Public pages: server-rendered data seeds the cache, so the browser doesn't fetch it again. */
export function useListing(slug: string, initialData?: ListingDetail) {
  const api = useApiClient();
  return useQuery({
    queryKey: keys.listing(slug),
    queryFn: () => api.catalog.listing(slug),
    initialData,
  });
}

export function useShop(slug: string, initialData?: ShopPublic) {
  const api = useApiClient();
  return useQuery({ queryKey: keys.shop(slug), queryFn: () => api.shops.shop(slug), initialData });
}

export function useShopListings(slug: string, initialData?: Listing[]) {
  const api = useApiClient();
  return useQuery({
    queryKey: keys.shopListings(slug),
    queryFn: () => api.shops.listings(slug),
    initialData,
  });
}
