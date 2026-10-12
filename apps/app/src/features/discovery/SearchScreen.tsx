import { useSearch } from '@klozbuy/api-client';
import { KlozText, KlozView } from '@klozbuy/ui';
import { useLocalSearchParams } from 'expo-router';
import { AppHeader } from '../../lib/AppHeader';
import { Page } from '../../lib/Page';
import { HeaderActions } from '../identity/HeaderActions';
import { useBuyerLocation } from '../location/LocationProvider';
import { fromFeedItem } from './feed-items';
import { EmptyState, ListingGrid } from './ListingGrid';
import { SearchBar } from './SearchBar';

export function SearchScreen() {
  const { q = '' } = useLocalSearchParams<{ q?: string }>();
  const { location } = useBuyerLocation();
  const query = q.trim();
  const results = useSearch(
    { lat: location.lat, lng: location.lng, radiusKm: 10, verifiedOnly: false, q: query },
    query.length >= 2,
  );
  const items = results.data?.pages.flatMap((page) => page.items).map(fromFeedItem) ?? [];
  return (
    <Page header={<AppHeader actions={<HeaderActions />} />}>
      <KlozView gap={6} py={2}>
        <SearchBar key={query} initial={query} />
        <KlozText variant="title-1" level={1}>
          {query
            ? `“${query}” near ${location.source === 'device' ? 'you' : location.label}`
            : 'Search near you'}
        </KlozText>
        <ListingGrid
          items={items}
          loading={query.length >= 2 && results.isPending}
          hasMore={results.hasNextPage}
          loadingMore={results.isFetchingNextPage}
          onMore={() => results.fetchNextPage()}
          empty={
            <EmptyState
              title="No matches within 10 km"
              body="Try fewer or different words, like the brand or the item."
            />
          }
        />
      </KlozView>
    </Page>
  );
}
