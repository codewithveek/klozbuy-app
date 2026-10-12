import type { Area } from '@klozbuy/contracts';
import type { DbExecutor } from '@klozbuy/db';
import { areas } from '@klozbuy/db/schema';
import { ok } from '@klozbuy/shared';
import { haversineKm, type Point } from '@klozbuy/shared/geo';
import { eq } from 'drizzle-orm';
import type { Ctx } from '../context';
import type { DomainResult } from '../errors';

/** Places module: the neighbourhoods and markets people navigate by. */
export type PlaceRow = typeof areas.$inferSelect;

export async function findPlaces(db: DbExecutor): Promise<PlaceRow[]> {
  return db.select().from(areas);
}

export async function findPlace(db: DbExecutor, id: string): Promise<PlaceRow | null> {
  const rows = await db.select().from(areas).where(eq(areas.id, id)).limit(1);
  return rows[0] ?? null;
}

/** The nearest neighbourhood within reach, to label a location ("Yaba"). Markets are skipped. */
export function nearestArea<T extends { lat: number; lng: number; kind?: string }>(
  places: T[],
  point: Point,
  maxKm = 4,
): T | null {
  let best: { place: T; km: number } | null = null;
  for (const place of places) {
    if (place.kind === 'market') continue;
    const km = haversineKm(point, place);
    if (km <= maxKm && (!best || km < best.km)) best = { place, km };
  }
  return best?.place ?? null;
}

export function toArea(row: PlaceRow): Area {
  const { id, slug, kind, name, description, city, lat, lng } = row;
  return { id, slug, kind, name, description, city, lat, lng };
}

export async function listAreas(ctx: Ctx): Promise<DomainResult<Area[]>> {
  const rows = await findPlaces(ctx.db);
  return ok(rows.map(toArea).sort((a, b) => a.name.localeCompare(b.name)));
}
