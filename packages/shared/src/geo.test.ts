import { describe, expect, it } from 'vitest';
import { cellsForPoint, haversineKm, roundPoint, searchArea } from './geo';

const yabaBusStop = { lat: 6.5095, lng: 3.3711 };
const computerVillage = { lat: 6.5965, lng: 3.3421 };

describe('cellsForPoint', () => {
  it('returns resolution 7 and 8 cells', () => {
    const cells = cellsForPoint(yabaBusStop);
    expect(cells.h3r7).toMatch(/^87/);
    expect(cells.h3r8).toMatch(/^88/);
  });
});

describe('searchArea', () => {
  it('uses 19 resolution-8 cells for 1 km', () => {
    const area = searchArea(yabaBusStop, 1);
    expect(area.resolution).toBe(8);
    expect(area.cells).toHaveLength(19);
  });

  it('uses 19 resolution-7 cells for 3 km, including the point itself', () => {
    const area = searchArea(yabaBusStop, 3);
    expect(area.resolution).toBe(7);
    expect(area.cells).toHaveLength(19);
    expect(area.cells).toContain(cellsForPoint(yabaBusStop).h3r7);
  });

  it('widens the ring for larger radii', () => {
    expect(searchArea(yabaBusStop, 10).cells.length).toBeGreaterThan(19);
  });
});

describe('haversineKm', () => {
  it('measures Yaba to Computer Village at about 10 km', () => {
    expect(haversineKm(yabaBusStop, computerVillage)).toBeCloseTo(10.2, 0);
  });
});

describe('roundPoint', () => {
  it('rounds to three decimals', () => {
    expect(roundPoint({ lat: 6.50951, lng: 3.37118 })).toEqual({ lat: 6.51, lng: 3.371 });
  });
});
