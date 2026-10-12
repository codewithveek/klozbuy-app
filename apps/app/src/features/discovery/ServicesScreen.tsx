import { KlozButton, KlozGrid, KlozSkeleton, KlozText, KlozView } from '@klozbuy/ui';
import { useState } from 'react';
import { useBuyerLocation } from '../location/LocationProvider';
import { PostRequestCard } from '../requests/PostRequestCard';
import { BuyerShell } from '../shell/BuyerShell';
import { CategoryChips } from './CategoryChips';
import { DEFAULT_FILTERS, type FeedFilters } from './feed-filters';
import { EmptyState } from './FeedResults';
import { FilterBar } from './FilterBar';
import { MapCard } from './MapCard';
import { SaferCard } from './SaferCard';
import { ServiceCard } from './ServiceCard';
import { useFeed } from './use-feed';

function Loading() {
  return (
    <KlozGrid min={220}>
      {[0, 1, 2].map((i) => (
        <KlozSkeleton key={i} height={210} />
      ))}
    </KlozGrid>
  );
}

/** Plumbers, tailors, electricians, repairers near the buyer, checked ones first by default. */
export function ServicesScreen() {
  const { radiusKm } = useBuyerLocation();
  const [filters, setFilters] = useState<FeedFilters>(DEFAULT_FILTERS);
  const feed = useFeed(filters, { type: 'service' });
  return (
    <BuyerShell
      active="services"
      aside={
        <>
          <MapCard items={feed.items} />
          <PostRequestCard />
          <SaferCard />
        </>
      }
    >
      <KlozView gap={1}>
        <KlozText variant="title-1" level={1}>
          Services near you
        </KlozText>
        <KlozText variant="body-sm" tone="secondary">
          {feed.loading
            ? `Looking within ${radiusKm} km…`
            : `${feed.total} within ${radiusKm} km · closest first`}
        </KlozText>
      </KlozView>
      <CategoryChips
        type="service"
        value={filters.categoryId}
        onChange={(categoryId) => setFilters({ ...filters, categoryId })}
      />
      <FilterBar value={filters} onChange={setFilters} showCondition={false} />
      {feed.loading ? (
        <Loading />
      ) : feed.items.length === 0 ? (
        <EmptyState
          title={`No services listed within ${radiusKm} km yet`}
          body="Tell us what you need with a request, and providers nearby can answer."
          action={
            <KlozButton variant="outline" href="/requests">
              Post a request
            </KlozButton>
          }
        />
      ) : (
        <KlozGrid min={220} list>
          {feed.items.map((item) => (
            <ServiceCard key={item.listingId} item={item} />
          ))}
        </KlozGrid>
      )}
      {feed.hasMore && (
        <KlozButton variant="outline" onPress={feed.more} loading={feed.loadingMore}>
          Show more
        </KlozButton>
      )}
    </BuyerShell>
  );
}
