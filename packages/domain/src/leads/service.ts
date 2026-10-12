import type { LeadChannel, ShopInsights } from '@klozbuy/contracts';
import { createId, err, offerMessage, ok } from '@klozbuy/shared';
import { getListingRow } from '../catalog';
import type { Ctx } from '../context';
import { notFound, requireActor, type DomainResult } from '../errors';
import { getOfferForContact } from '../requests';
import { getShopSnapshot, requireShopOwner } from '../shops';
import { buildInsights, isoDay } from './insights';
import { leadUrl, whatsappUrl } from './links';
import * as repo from './repository';

export interface LeadOptions {
  /** The public site, for the listing link in the WhatsApp message. */
  siteUrl: string;
  /** How far the buyer was, when the app knew. */
  distanceKm?: number;
}

/**
 * Records a buyer's tap on WhatsApp, call or directions and returns where to send them.
 * Works signed out; the buyer is attached when signed in.
 */
export async function startLead(
  ctx: Ctx,
  listingId: string,
  channel: LeadChannel,
  options: LeadOptions,
): Promise<DomainResult<string>> {
  const listing = await getListingRow(ctx.db, listingId);
  const shop = listing ? await getShopSnapshot(ctx.db, listing.shopId) : null;
  if (!listing || listing.status !== 'active' || !shop?.listable)
    return err(notFound('LISTING_NOT_FOUND', 'That listing'));
  const target = {
    ...listing,
    shopName: shop.name,
    whatsappNumber: shop.whatsappNumber,
    location: shop.location,
  };
  const url = leadUrl(channel, target, options.siteUrl);
  if (!url) return err(notFound('NOT_FOUND', 'The shop location'));
  await repo.insertLead(ctx.db, {
    id: createId(),
    listingId,
    shopId: shop.id,
    buyerId: ctx.actor?.userId ?? null,
    channel,
    distanceKm: options.distanceKm ?? null,
  });
  return ok(url);
}

/** The buyer who posted a request messages a shop about its offer. */
export async function startOfferLead(ctx: Ctx, offerId: string): Promise<DomainResult<string>> {
  const offer = await getOfferForContact(ctx, offerId);
  if (!offer.ok) return offer;
  const shop = await getShopSnapshot(ctx.db, offer.value.shopId);
  if (!shop?.listable) return err(notFound('NOT_FOUND', 'That offer'));
  await repo.insertLead(ctx.db, {
    id: createId(),
    listingId: offer.value.listingId,
    shopId: shop.id,
    buyerId: ctx.actor?.userId ?? null,
    channel: 'whatsapp',
    offerId,
  });
  return ok(
    whatsappUrl(
      shop.whatsappNumber,
      offerMessage({
        shopName: shop.name,
        request: offer.value.requestText,
        priceNgn: offer.value.priceNgn,
      }),
    ),
  );
}

/** Counts a listing page view for the seller's figures. */
export async function recordView(ctx: Ctx, listingId: string): Promise<DomainResult<null>> {
  const listing = await getListingRow(ctx.db, listingId);
  if (!listing) return err(notFound('LISTING_NOT_FOUND', 'That listing'));
  await repo.addView(ctx.db, listingId, listing.shopId, isoDay(ctx.clock.now()));
  return ok(null);
}

export async function shopInsights(
  ctx: Ctx,
  shopId: string,
  days: 7 | 30 = 7,
): Promise<DomainResult<ShopInsights>> {
  const shop = await requireShopOwner(ctx, shopId);
  if (!shop.ok) return shop;
  return ok(await buildInsights(ctx, shopId, days));
}

/** Every tap on a shop's listings, newest first, for the seller's Leads page. */
export async function listShopLeads(ctx: Ctx, shopId: string) {
  const shop = await requireShopOwner(ctx, shopId);
  if (!shop.ok) return shop;
  const leads = await repo.recentLeads(ctx.db, shopId);
  const titles = new Map(
    (await Promise.all(repo.listingIdsOf(leads).map((id) => getListingRow(ctx.db, id))))
      .filter((l) => l !== null)
      .map((l) => [l.id, l.title]),
  );
  return ok(
    leads.map((lead) => ({
      id: lead.id,
      channel: lead.channel,
      listingTitle: lead.listingId ? (titles.get(lead.listingId) ?? null) : null,
      distanceKm: lead.distanceKm,
      outcome: lead.outcome,
      createdAt: lead.createdAt.toISOString(),
    })),
  );
}

/** The signed-in buyer's recent contacts with shops: the "Chats" list. */
export async function listMyChats(ctx: Ctx) {
  const actor = requireActor(ctx);
  if (!actor.ok) return actor;
  const leads = await repo.buyerLeads(ctx.db, actor.value.userId);
  const listings = new Map(
    (await Promise.all(repo.listingIdsOf(leads).map((id) => getListingRow(ctx.db, id))))
      .filter((l) => l !== null)
      .map((l) => [l.id, l]),
  );
  const shops = new Map(
    (
      await Promise.all(
        [...new Set(leads.map((l) => l.shopId))].map((id) => getShopSnapshot(ctx.db, id)),
      )
    )
      .filter((s) => s !== null)
      .map((s) => [s.id, s]),
  );
  const chats = leads.flatMap((lead) => {
    const shop = shops.get(lead.shopId);
    if (!shop) return [];
    const listing = lead.listingId ? listings.get(lead.listingId) : undefined;
    const { id, slug, name, verified, ratingAvg, ratingCount } = shop;
    return [
      {
        id: lead.id,
        channel: lead.channel,
        listing: listing
          ? { id: listing.id, slug: listing.slug, title: listing.title, priceNgn: listing.priceNgn }
          : null,
        shop: { id, slug, name, verified, ratingAvg, ratingCount },
        createdAt: lead.createdAt.toISOString(),
      },
    ];
  });
  return ok(chats);
}
