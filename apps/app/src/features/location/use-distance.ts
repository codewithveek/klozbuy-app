import { haversineKm, type Point } from '@klozbuy/shared';
import { useBuyerLocation } from './LocationProvider';

/** How far a place is from the buyer, in km; null when the place has no location. */
export function useDistanceTo(point: Point | null | undefined): number | null {
  const { location } = useBuyerLocation();
  return point ? haversineKm(location, point) : null;
}
