import { haversineKm, type Point } from '@klozbuy/shared/geo';

interface Rankable {
  lat: number;
  lng: number;
  boostedUntil: Date | null;
}

export interface Ranked<T> {
  item: T;
  distanceKm: number;
  boosted: boolean;
}

/** Keeps candidates within the radius; boosted first, then nearest. Distances are per buyer, never cached. */
export function rankByDistance<T extends Rankable>(
  items: T[],
  point: Point,
  radiusKm: number,
  now: Date,
): Ranked<T>[] {
  return items
    .map((item) => ({
      item,
      distanceKm: haversineKm(point, item),
      boosted: item.boostedUntil !== null && item.boostedUntil > now,
    }))
    .filter((ranked) => ranked.distanceKm <= radiusKm)
    .sort((a, b) => Number(b.boosted) - Number(a.boosted) || a.distanceKm - b.distanceKm);
}

export const PAGE_SIZE = 20;

/** Cursor pagination over an already ranked list; the cursor is the next offset. */
export function paginate<T>(items: T[], cursor: string | undefined, size = PAGE_SIZE) {
  const offset = Math.max(0, Number.parseInt(cursor ?? '0', 10) || 0);
  const page = items.slice(offset, offset + size);
  const next = offset + size;
  return { page, nextCursor: next < items.length ? String(next) : null };
}

/** The nearest named area within reach, to label a location ("Yaba"). */
export function nearestArea<T extends { lat: number; lng: number }>(
  areas: T[],
  point: Point,
  maxKm = 4,
): T | null {
  let best: { area: T; km: number } | null = null;
  for (const area of areas) {
    const km = haversineKm(point, area);
    if (km <= maxKm && (!best || km < best.km)) best = { area, km };
  }
  return best?.area ?? null;
}
