import { useNearbyFeed } from '@klozbuy/api-client';
import { KlozButton, KlozText, KlozView } from '@klozbuy/ui';
import { useState } from 'react';
import { AppHeader } from '../../lib/AppHeader';
import { Page } from '../../lib/Page';
import { HeaderActions } from '../identity/HeaderActions';
import { useBuyerLocation } from '../location/LocationProvider';
import { fromFeedItem } from './feed-items';
import { FeedFilters, type FeedFilterValues } from './FeedFilters';
import { EmptyState, ListingGrid } from './ListingGrid';
import { SearchBar } from './SearchBar';

/** The home screen: what is in stock near the buyer, nearest first. */
export function FeedScreen() {
  const { location } = useBuyerLocation();
  const [filters, setFilters] = useState<FeedFilterValues>({ radiusKm: 3, verifiedOnly: false });
  const feed = useNearbyFeed({ lat: location.lat, lng: location.lng, ...filters });
  const items = feed.data?.pages.flatMap((page) => page.items).map(fromFeedItem) ?? [];
  const wider = [1, 3, 5, 10].find((km) => km > filters.radiusKm) as
    FeedFilterValues['radiusKm'] | undefined;
  return (
    <Page header={<AppHeader actions={<HeaderActions />} />}>
      <KlozView gap={6} py={2}>
        <SearchBar />
        <FeedFilters value={filters} onChange={setFilters} />
        <KlozView gap={1}>
          <KlozText variant="title-1" level={1}>
            {location.source === 'device' ? 'In stock near you' : `In stock near ${location.label}`}
          </KlozText>
          <KlozText tone="secondary">Nearest first, within {filters.radiusKm} km.</KlozText>
        </KlozView>
        <ListingGrid
          items={items}
          loading={feed.isPending}
          hasMore={feed.hasNextPage}
          loadingMore={feed.isFetchingNextPage}
          onMore={() => feed.fetchNextPage()}
          empty={
            <EmptyState
              title={`Nothing listed within ${filters.radiusKm} km yet`}
              body="Shops here are still joining. Look a little further, or try another area."
              action={
                wider && (
                  <KlozButton
                    variant="outline"
                    onPress={() => setFilters({ ...filters, radiusKm: wider })}
                  >{`Look within ${wider} km`}</KlozButton>
                )
              }
            />
          }
        />
      </KlozView>
    </Page>
  );
}
