import { describe, expect, it } from 'vitest';
import { nearestArea } from '../places';
import { paginate, rankByDistance } from './ranking';

const yaba = { lat: 6.5095, lng: 3.3711 };
const now = new Date('2026-03-01T12:00:00Z');
const at = (lat: number, lng: number, boostedUntil: Date | null = null) => ({
  lat,
  lng,
  boostedUntil,
});

describe('rankByDistance', () => {
  it('drops listings beyond the radius and sorts the rest by distance', () => {
    const near = at(6.511, 3.372);
    const farther = at(6.52, 3.375);
    const outside = at(6.6, 3.35); // Ikeja, about 10 km away
    const ranked = rankByDistance([farther, outside, near], yaba, 3, now);
    expect(ranked.map((r) => r.item)).toEqual([near, farther]);
    expect(ranked[0]?.distanceKm).toBeLessThan(0.3);
  });

  it('puts boosted listings first, but only while the boost lasts', () => {
    const near = at(6.511, 3.372);
    const boosted = at(6.52, 3.375, new Date('2026-03-02T00:00:00Z'));
    const expired = at(6.512, 3.373, new Date('2026-02-01T00:00:00Z'));
    const ranked = rankByDistance([near, expired, boosted], yaba, 3, now);
    expect(ranked.map((r) => r.item)).toEqual([boosted, near, expired]);
    expect(ranked.map((r) => r.boosted)).toEqual([true, false, false]);
  });
});

describe('paginate', () => {
  const items = Array.from({ length: 45 }, (_, i) => i);

  it('pages with an offset cursor', () => {
    const first = paginate(items, undefined);
    expect(first.page).toHaveLength(20);
    const second = paginate(items, first.nextCursor ?? undefined);
    expect(second.page[0]).toBe(20);
    const third = paginate(items, second.nextCursor ?? undefined);
    expect(third.page).toEqual([40, 41, 42, 43, 44]);
    expect(third.nextCursor).toBeNull();
  });

  it('treats a bad cursor as the start', () => {
    expect(paginate(items, 'nonsense').page[0]).toBe(0);
  });
});

describe('nearestArea', () => {
  const areas = [
    { name: 'Yaba', lat: 6.5095, lng: 3.3711, kind: 'area' },
    { name: 'Surulere', lat: 6.5005, lng: 3.354, kind: 'area' },
    { name: 'Tejuosho Market', lat: 6.5052, lng: 3.358, kind: 'market' },
  ];

  it('names the closest area within reach', () => {
    expect(nearestArea(areas, { lat: 6.505, lng: 3.358 })?.name).toBe('Surulere');
    expect(nearestArea(areas, { lat: 6.6, lng: 3.5 })).toBeNull();
  });
});
