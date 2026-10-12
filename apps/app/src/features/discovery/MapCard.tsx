import type { FeedItem } from '@klozbuy/contracts';
import { KlozView, KlozText } from '@klozbuy/ui';
import { Panel, SectionHeading } from '../../lib/Panel';
import { useBuyerLocation } from '../location/LocationProvider';
import { RadiusMap } from './RadiusMap';

export const toPins = (items: FeedItem[]) =>
  items.map((item) => ({ key: item.listingId, label: item.title, lat: item.lat, lng: item.lng }));

/** "On the map": the listings on this page around the buyer. */
export function MapCard({ items, onOpen }: { items: FeedItem[]; onOpen?: () => void }) {
  const { location, radiusKm } = useBuyerLocation();
  return (
    <Panel flush>
      <KlozView px={4} py={3}>
        <SectionHeading
          title="On the map"
          link={onOpen && { label: 'Open map', onPress: onOpen }}
        />
      </KlozView>
      <RadiusMap centre={location} radiusKm={radiusKm} pins={toPins(items)} />
      <KlozView px={4} py={3}>
        <KlozText variant="body-sm" tone="secondary">
          Dashed ring shows your {radiusKm} km radius
        </KlozText>
      </KlozView>
    </Panel>
  );
}
