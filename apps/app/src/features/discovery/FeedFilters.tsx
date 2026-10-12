import { useAreas, useCategories } from '@klozbuy/api-client';
import { FEED_RADII_KM } from '@klozbuy/contracts';
import { KlozChip, KlozText, KlozView } from '@klozbuy/ui';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useBuyerLocation } from '../location/LocationProvider';

export interface FeedFilterValues {
  radiusKm: (typeof FEED_RADII_KM)[number];
  verifiedOnly: boolean;
  categoryId?: string;
}

interface Props {
  value: FeedFilterValues;
  onChange: (value: FeedFilterValues) => void;
}

function AreaPicker({ onDone }: { onDone: () => void }) {
  const areas = useAreas();
  const { chooseArea, locateDevice } = useBuyerLocation();
  const [locating, setLocating] = useState(false);
  const [declined, setDeclined] = useState(false);
  async function useMyLocation() {
    setLocating(true);
    const found = await locateDevice();
    setLocating(false);
    if (found) onDone();
    else setDeclined(true);
  }
  return (
    <KlozView gap={2} p={4} bg="surface" radius="lg" border>
      <KlozView row wrap gap={2}>
        <KlozChip icon="navigate" onPress={useMyLocation}>
          {locating ? 'Finding you…' : 'Use my location'}
        </KlozChip>
        {areas.data?.map((area) => (
          <KlozChip key={area.id} onPress={() => (chooseArea(area), onDone())}>
            {area.name}
          </KlozChip>
        ))}
      </KlozView>
      {declined && (
        <KlozText variant="caption" tone="secondary" announce>
          We couldn't get your location. Pick the area you're in instead.
        </KlozText>
      )}
    </KlozView>
  );
}

/** Where, how far, what kind and whether only checked shops: the four things a buyer filters by. */
export function FeedFilters({ value, onChange }: Props) {
  const { location } = useBuyerLocation();
  const categories = useCategories();
  const [picking, setPicking] = useState(false);
  return (
    <KlozView gap={3}>
      <KlozView row wrap gap={2}>
        <KlozChip
          icon="pin"
          selected={picking}
          onPress={() => setPicking(!picking)}
          testID="area-chip"
        >
          {location.source === 'device' ? 'Near you' : `Near ${location.label}`}
        </KlozChip>
        {FEED_RADII_KM.map((km) => (
          <KlozChip
            key={km}
            selected={value.radiusKm === km}
            onPress={() => onChange({ ...value, radiusKm: km })}
          >
            {`${km} km`}
          </KlozChip>
        ))}
        <KlozChip
          icon="shield-check"
          selected={value.verifiedOnly}
          onPress={() => onChange({ ...value, verifiedOnly: !value.verifiedOnly })}
        >
          Verified only
        </KlozChip>
      </KlozView>
      {picking && <AreaPicker onDone={() => setPicking(false)} />}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <KlozView row gap={2}>
          <KlozChip
            selected={!value.categoryId}
            onPress={() => onChange({ ...value, categoryId: undefined })}
          >
            All
          </KlozChip>
          {categories.data?.map((category) => (
            <KlozChip
              key={category.id}
              selected={value.categoryId === category.id}
              onPress={() => onChange({ ...value, categoryId: category.id })}
            >
              {category.name}
            </KlozChip>
          ))}
        </KlozView>
      </ScrollView>
    </KlozView>
  );
}
