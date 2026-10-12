import type { ShopInsights } from '@klozbuy/contracts';
import { findShopListings } from '../catalog';
import type { Ctx } from '../context';
import * as repo from './repository';

const DAY_MS = 24 * 60 * 60 * 1000;
export const isoDay = (date: Date) => date.toISOString().slice(0, 10);
const startOfDay = (date: Date) => new Date(Date.parse(isoDay(date)));

type Counts = ShopInsights['totals'];

async function periodCounts(ctx: Ctx, shopId: string, from: Date, to: Date): Promise<Counts> {
  const rows = await repo.countLeadsByDay(ctx.db, shopId, from, to);
  const counts: Counts = {
    views: await repo.sumShopViews(ctx.db, shopId, isoDay(from), isoDay(to)),
    whatsapp: 0,
    call: 0,
    directions: 0,
  };
  for (const row of rows) counts[row.channel] += row.total;
  return counts;
}

async function whatsappSeries(ctx: Ctx, shopId: string, from: Date, days: number) {
  const rows = await repo.countLeadsByDay(
    ctx.db,
    shopId,
    from,
    new Date(from.getTime() + days * DAY_MS),
  );
  const byDay = new Map<string, number>();
  for (const row of rows)
    if (row.channel === 'whatsapp') byDay.set(row.day, (byDay.get(row.day) ?? 0) + row.total);
  return Array.from({ length: days }, (_, i) => {
    const day = isoDay(new Date(from.getTime() + i * DAY_MS));
    return { day, count: byDay.get(day) ?? 0 };
  });
}

/** Shares of leads by distance; null when no lead carried a distance. */
export function distanceShares(distances: number[]): ShopInsights['distance'] {
  if (distances.length === 0) return null;
  const share = (test: (km: number) => boolean) =>
    Math.round((distances.filter(test).length / distances.length) * 100);
  return {
    under1: share((km) => km < 1),
    from1to2: share((km) => km >= 1 && km < 2),
    from2to3: share((km) => km >= 2 && km < 3),
    over3: share((km) => km >= 3),
  };
}

/** Every live listing with its views and chats in the period, busiest first. */
async function listingFigures(
  ctx: Ctx,
  shopId: string,
  from: Date,
): Promise<ShopInsights['listings']> {
  const [views, chats, rows] = await Promise.all([
    repo.viewsByListing(ctx.db, shopId, isoDay(from)),
    repo.whatsappByListing(ctx.db, shopId, from),
    findShopListings(ctx.db, shopId, ['active', 'hidden']),
  ]);
  const viewsOf = new Map(views.map((v) => [v.listingId, Number(v.total ?? 0)]));
  const chatsOf = new Map(chats.map((c) => [c.listingId ?? '', c.total]));
  return rows
    .map((row) => ({
      listingId: row.id,
      slug: row.slug,
      title: row.title,
      type: row.type,
      condition: row.condition,
      priceNgn: row.priceNgn,
      stockStatus: row.stockStatus,
      status: row.status,
      views: viewsOf.get(row.id) ?? 0,
      whatsapp: chatsOf.get(row.id) ?? 0,
      updatedAt: row.updatedAt.toISOString(),
    }))
    .sort((a, b) => b.whatsapp - a.whatsapp || b.views - a.views);
}

/** How buyers found a shop over the last 7 or 30 days, against the period before. */
export async function buildInsights(ctx: Ctx, shopId: string, days: 7 | 30): Promise<ShopInsights> {
  const end = new Date(startOfDay(ctx.clock.now()).getTime() + DAY_MS);
  const from = new Date(end.getTime() - days * DAY_MS);
  const before = new Date(from.getTime() - days * DAY_MS);
  const [totals, previous, whatsappByDay, distances, listings] = await Promise.all([
    periodCounts(ctx, shopId, from, end),
    periodCounts(ctx, shopId, before, from),
    whatsappSeries(ctx, shopId, from, days),
    repo.leadDistances(ctx.db, shopId, from),
    listingFigures(ctx, shopId, from),
  ]);
  return {
    days,
    from: isoDay(from),
    to: isoDay(new Date(end.getTime() - DAY_MS)),
    totals,
    previous,
    whatsappByDay,
    distance: distanceShares(distances),
    listings,
  };
}
