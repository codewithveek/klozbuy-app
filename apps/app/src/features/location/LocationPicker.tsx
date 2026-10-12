import { useAreas } from '@klozbuy/api-client';
import { KlozChip, KlozText, KlozView } from '@klozbuy/ui';
import { useState } from 'react';
import { useBuyerLocation } from './LocationProvider';

/** "Use my location", or one of the neighbourhoods Klozbuy knows. */
export function LocationPicker({ onDone }: { onDone: () => void }) {
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
  const neighbourhoods = areas.data?.filter((area) => area.kind === 'area') ?? [];
  return (
    <KlozView gap={3} p={2}>
      <KlozText variant="label">Where are you?</KlozText>
      <KlozChip icon="navigate" onPress={useMyLocation}>
        {locating ? 'Finding you…' : 'Use my location'}
      </KlozChip>
      <KlozView row wrap gap={2}>
        {neighbourhoods.map((area) => (
          <KlozChip
            key={area.id}
            onPress={() => {
              chooseArea(area);
              onDone();
            }}
          >
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
