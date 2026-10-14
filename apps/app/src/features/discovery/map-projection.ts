import type { Point } from '@klozbuy/shared';

export interface MapFrame {
  width: number;
  height: number;
  /** Radius ring size in px. */
  ring: number;
}

const KM_PER_DEGREE_LAT = 110.57;

/**
 * Places a point on a flat map centred on the buyer, so the ring is the search radius.
 * Good enough within 10 km; points outside the frame are pulled onto its edge.
 */
export function project(centre: Point, point: Point, radiusKm: number, frame: MapFrame) {
  const kmPerDegreeLng = 111.32 * Math.cos((centre.lat * Math.PI) / 180);
  const scale = frame.ring / radiusKm;
  const x = frame.width / 2 + (point.lng - centre.lng) * kmPerDegreeLng * scale;
  const y = frame.height / 2 - (point.lat - centre.lat) * KM_PER_DEGREE_LAT * scale;
  const clamp = (value: number, max: number) => Math.min(Math.max(value, 12), max - 12);
  return { x: clamp(x, frame.width), y: clamp(y, frame.height) };
}
