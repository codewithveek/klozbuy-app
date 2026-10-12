import { KlozChip, KlozSegmented, KlozText, KlozView } from '@klozbuy/ui';
import { useBuyerLocation } from '../location/LocationProvider';

export type FeedView = 'list' | 'map';
const VIEWS = [
  { value: 'list', label: 'List' },
  { value: 'map', label: 'Map' },
] as const;

interface Props {
  title: string;
  total: number;
  loading: boolean;
  view: FeedView;
  onView: (view: FeedView) => void;
  /** Phones: the filter row is folded away behind this chip. */
  filtersOpen: boolean;
  onFilters: () => void;
}

/** "In stock near you · 32 listings within 3 km of Yaba · closest first", and List / Map. */
export function FeedHeading({
  title,
  total,
  loading,
  view,
  onView,
  filtersOpen,
  onFilters,
}: Props) {
  const { location, radiusKm } = useBuyerLocation();
  const where = location.source === 'device' ? 'you' : location.label;
  const count = total === 1 ? '1 listing' : `${total} listings`;
  return (
    <KlozView row align="end" justify="between" gap={3} responsive="stack-md">
      <KlozView flex={1}>
        <KlozText variant="title-1" level={1}>
          {title}
        </KlozText>
        <KlozText variant="body-sm" tone="secondary">
          {loading
            ? `Looking within ${radiusKm} km…`
            : `${count} within ${radiusKm} km of ${where}`}
        </KlozText>
      </KlozView>
      <KlozView row align="center" gap={2}>
        <KlozView responsive="show-below-md">
          <KlozChip icon="chevron-down" selected={filtersOpen} onPress={onFilters}>
            Filters
          </KlozChip>
        </KlozView>
        <KlozView responsive="show-below-md">
          <KlozChip
            icon="map"
            selected={view === 'map'}
            onPress={() => onView(view === 'map' ? 'list' : 'map')}
          >
            Map
          </KlozChip>
        </KlozView>
        <KlozView responsive="show-from-md">
          <KlozSegmented label="View" value={view} options={VIEWS} onChange={onView} />
        </KlozView>
      </KlozView>
    </KlozView>
  );
}
