import { gridDisk, latLngToCell } from 'h3-js';
import type { Point } from './distance';

export { haversineKm, type Point } from './distance';

/** Cell sizes used for search: r7 cells are about 1.2 km across, r8 about 0.5 km. */
export const SEARCH_RESOLUTIONS = { wide: 7, close: 8 } as const;
export type SearchResolution = (typeof SEARCH_RESOLUTIONS)[keyof typeof SEARCH_RESOLUTIONS];

export interface LocationCells {
  readonly h3r7: string;
  readonly h3r8: string;
}

/** Cells stored with every location, computed once on write. */
export function cellsForPoint(point: Point): LocationCells {
  return {
    h3r7: latLngToCell(point.lat, point.lng, SEARCH_RESOLUTIONS.wide),
    h3r8: latLngToCell(point.lat, point.lng, SEARCH_RESOLUTIONS.close),
  };
}

export interface SearchArea {
  readonly resolution: SearchResolution;
  readonly cells: string[];
}

/**
 * Cells to query for a radius. Two rings of r8 cells cover about 1 km; two rings of
 * r7 cells cover about 3 km; wider radii use more r7 rings. Exact distance is
 * checked afterwards with haversineKm.
 */
export function searchArea(point: Point, radiusKm: number): SearchArea {
  if (radiusKm <= 1) {
    const origin = latLngToCell(point.lat, point.lng, SEARCH_RESOLUTIONS.close);
    return { resolution: SEARCH_RESOLUTIONS.close, cells: gridDisk(origin, 2) };
  }
  const rings = radiusKm <= 3 ? 2 : Math.ceil(radiusKm / 1.2);
  const origin = latLngToCell(point.lat, point.lng, SEARCH_RESOLUTIONS.wide);
  return { resolution: SEARCH_RESOLUTIONS.wide, cells: gridDisk(origin, rings) };
}

/** Rounds a buyer's point to about 100 m, for privacy and so nearby buyers share cache keys. */
export function roundPoint(point: Point): Point {
  return { lat: Math.round(point.lat * 1000) / 1000, lng: Math.round(point.lng * 1000) / 1000 };
}
