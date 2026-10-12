import type { FeedSort } from '@klozbuy/contracts';
import { isOpenAt, parseDays } from '@klozbuy/shared';
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

interface Sortable {
  priceNgn: number;
  updatedAt: Date;
}

/** Re-orders a distance-ranked list; "closest" keeps boosted-then-nearest. Sorting is stable. */
export function sortRanked<T extends Sortable>(ranked: Ranked<T>[], sort: FeedSort): Ranked<T>[] {
  if (sort === 'closest') return ranked;
  const copy = [...ranked];
  if (sort === 'price_asc') return copy.sort((a, b) => a.item.priceNgn - b.item.priceNgn);
  if (sort === 'price_desc') return copy.sort((a, b) => b.item.priceNgn - a.item.priceNgn);
  return copy.sort((a, b) => b.item.updatedAt.getTime() - a.item.updatedAt.getTime());
}

interface WithHours {
  opensAt: string | null;
  closesAt: string | null;
  openDays: string;
}

/** Only shops open right now (shops without hours are left out). */
export function openNow<T extends WithHours>(ranked: Ranked<T>[], now: Date): Ranked<T>[] {
  return ranked.filter(
    ({ item }) => isOpenAt({ ...item, openDays: parseDays(item.openDays) }, now) === true,
  );
}

export const PAGE_SIZE = 20;

/** Cursor pagination over an already ranked list; the cursor is the next offset. */
export function paginate<T>(items: T[], cursor: string | undefined, size = PAGE_SIZE) {
  const offset = Math.max(0, Number.parseInt(cursor ?? '0', 10) || 0);
  const page = items.slice(offset, offset + size);
  const next = offset + size;
  return { page, nextCursor: next < items.length ? String(next) : null };
}
