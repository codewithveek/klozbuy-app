import { KlozButton, KlozView } from '@klozbuy/ui';
import { useState } from 'react';
import { Panel } from '../../lib/Panel';
import { useBuyerLocation } from '../location/LocationProvider';
import { PostRequestCard } from '../requests/PostRequestCard';
import { BuyerShell } from '../shell/BuyerShell';
import { CategoryChips } from './CategoryChips';
import { DEFAULT_FILTERS, type FeedFilters } from './feed-filters';
import { FeedHeading, type FeedView } from './FeedHeading';
import { EmptyState, FeedResults } from './FeedResults';
import { FilterBar } from './FilterBar';
import { MapCard, toPins } from './MapCard';
import { RadiusMap } from './RadiusMap';
import { SaferCard } from './SaferCard';
import { TrustedServices } from './TrustedServices';
import { useFeed } from './use-feed';

function WiderButton() {
  const { radiusKm, setRadius } = useBuyerLocation();
  const wider = ([1, 3, 5, 10] as const).find((km) => km > radiusKm);
  if (!wider) return null;
  return (
    <KlozButton
      variant="outline"
      onPress={() => setRadius(wider)}
    >{`Look within ${wider} km`}</KlozButton>
  );
}

/** The home screen and search results: what is in stock near the buyer, as in the mockup. */
export function NearMeScreen({ q }: { q?: string }) {
  const { location, radiusKm } = useBuyerLocation();
  const [filters, setFilters] = useState<FeedFilters>(DEFAULT_FILTERS);
  const [view, setView] = useState<FeedView>('list');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const feed = useFeed(filters, { q, type: q ? undefined : 'product' });
  const aside = (
    <>
      <MapCard items={feed.items} onOpen={() => setView('map')} />
      <PostRequestCard />
      <SaferCard />
    </>
  );
  return (
    <BuyerShell active="near" aside={aside}>
      <FeedHeading
        title={q ? `“${q}” near you` : 'In stock near you'}
        total={feed.total}
        loading={feed.loading}
        view={view}
        onView={setView}
        filtersOpen={filtersOpen}
        onFilters={() => setFiltersOpen(!filtersOpen)}
      />
      {!q && (
        <CategoryChips
          type="product"
          value={filters.categoryId}
          onChange={(categoryId) => setFilters({ ...filters, categoryId })}
        />
      )}
      <KlozView responsive={filtersOpen ? undefined : 'show-from-md'}>
        <FilterBar value={filters} onChange={setFilters} />
      </KlozView>
      {view === 'map' && (
        <Panel flush>
          <RadiusMap centre={location} radiusKm={radiusKm} pins={toPins(feed.items)} tall />
        </Panel>
      )}
      <FeedResults
        items={feed.items}
        loading={feed.loading}
        hasMore={feed.hasMore}
        loadingMore={feed.loadingMore}
        onMore={feed.more}
        empty={
          <EmptyState
            title={
              q
                ? `Nothing matches “${q}” within ${radiusKm} km`
                : `Nothing listed within ${radiusKm} km yet`
            }
            body="Shops here are still joining. Look a little further, change the filters, or post a request and let sellers come to you."
            action={<WiderButton />}
          />
        }
      />
      {!q && <TrustedServices />}
    </BuyerShell>
  );
}
