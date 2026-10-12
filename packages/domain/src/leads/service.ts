import type { LeadChannel, ShopStats } from '@klozbuy/contracts';
import { createId, err, ok } from '@klozbuy/shared';
import { getListingRow } from '../catalog';
import type { Ctx } from '../context';
import { notFound, type DomainResult } from '../errors';
import { getShopSnapshot, requireShopOwner } from '../shops';
import { leadUrl } from './links';
import { countLeadsByDay, insertLead } from './repository';

/**
 * Records a buyer's tap on WhatsApp, call or directions and returns where to send them.
 * Works signed out; the buyer is attached when signed in.
 */
export async function startLead(
  ctx: Ctx,
  listingId: string,
  channel: LeadChannel,
): Promise<DomainResult<string>> {
  const listing = await getListingRow(ctx.db, listingId);
  const shop = listing ? await getShopSnapshot(ctx.db, listing.shopId) : null;
  if (!listing || listing.status !== 'active' || !shop?.listable) {
    return err(notFound('LISTING_NOT_FOUND', 'That listing'));
  }
  const url = leadUrl(channel, {
    ...listing,
    whatsappNumber: shop.whatsappNumber,
    location: shop.location,
  });
  if (!url) return err(notFound('NOT_FOUND', 'The shop location'));
  await insertLead(ctx.db, {
    id: createId(),
    listingId,
    shopId: shop.id,
    buyerId: ctx.actor?.userId ?? null,
    channel,
  });
  return ok(url);
}

const DAY_MS = 24 * 60 * 60 * 1000;
const isoDay = (date: Date) => date.toISOString().slice(0, 10);

/** Leads per day for the last `days` days, every day present (zeros included). */
export async function shopStats(
  ctx: Ctx,
  shopId: string,
  days = 14,
): Promise<DomainResult<ShopStats>> {
  const shop = await requireShopOwner(ctx, shopId);
  if (!shop.ok) return shop;
  const now = ctx.clock.now();
  const start = new Date(Date.parse(isoDay(now)) - (days - 1) * DAY_MS);
  const rows = await countLeadsByDay(ctx.db, shopId, start);
  const series = Array.from({ length: days }, (_, i) => ({
    day: isoDay(new Date(start.getTime() + i * DAY_MS)),
    whatsapp: 0,
    call: 0,
    directions: 0,
  }));
  const byDay = new Map(series.map((entry) => [entry.day, entry]));
  for (const row of rows) {
    const entry = byDay.get(row.day);
    if (entry) entry[row.channel] += row.total;
  }
  const totals = { whatsapp: 0, call: 0, directions: 0 };
  for (const entry of series) {
    totals.whatsapp += entry.whatsapp;
    totals.call += entry.call;
    totals.directions += entry.directions;
  }
  return ok({ totals, days: series });
}
