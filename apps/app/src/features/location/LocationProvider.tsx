import { useAreas } from '@klozbuy/api-client';
import type { Area, FEED_RADII_KM, PointInput } from '@klozbuy/contracts';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getDeviceLocation } from './device-location';
import { loadSavedArea, saveArea } from './saved-area';

export interface BuyerLocation extends PointInput {
  /** "Yaba", or "your location" when it came from the device. */
  label: string;
  source: 'area' | 'device';
  areaSlug?: string;
}

/** Until the buyer picks somewhere, the feed starts in Yaba, where Klozbuy launches. */
export const DEFAULT_LOCATION: BuyerLocation = {
  lat: 6.5095,
  lng: 3.3711,
  label: 'Yaba',
  source: 'area',
  areaSlug: 'yaba',
};

export type RadiusKm = (typeof FEED_RADII_KM)[number];

interface LocationContextValue {
  location: BuyerLocation;
  /** How far the buyer will go; the header and the distance filter share it. */
  radiusKm: RadiusKm;
  setRadius: (km: RadiusKm) => void;
  chooseArea: (area: Area) => void;
  locateDevice: () => Promise<boolean>;
}

const LocationContext = createContext<LocationContextValue | null>(null);

const fromArea = (area: Area): BuyerLocation => ({
  lat: area.lat,
  lng: area.lng,
  label: area.name,
  source: 'area',
  areaSlug: area.slug,
});

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [radiusKm, setRadius] = useState<RadiusKm>(3);
  const areas = useAreas();

  // Restore the saved area after hydration, so the server and first client render agree.
  useEffect(() => {
    const slug = loadSavedArea();
    const area = areas.data?.find((a) => a.slug === slug);
    if (area) setLocation(fromArea(area));
  }, [areas.data]);

  const value = useMemo<LocationContextValue>(
    () => ({
      location,
      radiusKm,
      setRadius,
      chooseArea: (area) => {
        saveArea(area.slug);
        setLocation(fromArea(area));
      },
      locateDevice: () =>
        getDeviceLocation().then(
          (point) => {
            setLocation({ ...point, label: 'your location', source: 'device' });
            return true;
          },
          () => false,
        ),
    }),
    [location, radiusKm],
  );
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useBuyerLocation(): LocationContextValue {
  const value = useContext(LocationContext);
  if (!value) throw new Error('useBuyerLocation needs a LocationProvider above it');
  return value;
}
