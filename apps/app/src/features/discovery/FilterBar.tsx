import { FEED_RADII_KM } from '@klozbuy/contracts';
import { createStyles, KlozMenu, KlozSwitch, KlozView } from '@klozbuy/ui';
import { useBuyerLocation } from '../location/LocationProvider';
import {
  CONDITION_OPTIONS,
  labelOf,
  PRICE_BANDS,
  SORT_OPTIONS,
  type FeedFilters,
} from './feed-filters';

const useStyles = createStyles((t) => ({
  bar: {
    zIndex: 20,
    paddingBottom: t.spacing[4],
    borderBottomWidth: t.stroke.hairline,
    borderBottomColor: t.colors.borderDefault,
  },
  sort: { marginLeft: 'auto' },
}));

const RADIUS_OPTIONS = FEED_RADII_KM.map((km) => ({ value: km, label: `${km} km` }));

interface Props {
  value: FeedFilters;
  onChange: (value: FeedFilters) => void;
  /** Products have a condition; services don't. */
  showCondition?: boolean;
}

/** Distance, price, condition, verified, open now and sort: the filter row from the mockup. */
export function FilterBar({ value, onChange, showCondition = true }: Props) {
  const styles = useStyles();
  const { radiusKm, setRadius } = useBuyerLocation();
  const set = (patch: Partial<FeedFilters>) => onChange({ ...value, ...patch });
  return (
    <KlozView row wrap align="center" gap={2} style={styles.bar}>
      <KlozMenu
        title="Distance"
        label={`Distance: ${radiusKm} km`}
        value={radiusKm}
        options={RADIUS_OPTIONS}
        onChange={setRadius}
      />
      <KlozMenu
        title="Price"
        label={value.price === 'any' ? 'Price' : labelOf(PRICE_BANDS, value.price)}
        value={value.price}
        options={PRICE_BANDS}
        onChange={(price) => set({ price })}
      />
      {showCondition && (
        <KlozMenu
          title="Condition"
          label={
            value.condition === 'any' ? 'Condition' : labelOf(CONDITION_OPTIONS, value.condition)
          }
          value={value.condition}
          options={CONDITION_OPTIONS}
          onChange={(condition) => set({ condition })}
        />
      )}
      <KlozSwitch
        label="Verified shops only"
        value={value.verifiedOnly}
        onChange={(verifiedOnly) => set({ verifiedOnly })}
      />
      <KlozSwitch label="Open now" value={value.openNow} onChange={(openNow) => set({ openNow })} />
      <KlozView style={styles.sort}>
        <KlozMenu
          variant="plain"
          align="end"
          title="Sort"
          label={`Sort: ${labelOf(SORT_OPTIONS, value.sort)}`}
          value={value.sort}
          options={SORT_OPTIONS}
          onChange={(sort) => set({ sort })}
        />
      </KlozView>
    </KlozView>
  );
}
