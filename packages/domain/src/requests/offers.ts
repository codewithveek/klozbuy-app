import type { Offer, SendOfferInput } from '@klozbuy/contracts';
import { createId, err, ok } from '@klozbuy/shared';
import { getListingRow } from '../catalog';
import type { Ctx } from '../context';
import { domainError, forbidden, notFound, type DomainResult } from '../errors';
import { requireShopOwner } from '../shops';
import { effectiveStatus, toOffer } from './mappers';
import * as repo from './repository';

/** The listing an offer points to must be the shop's own and still for sale. */
async function checkListing(ctx: Ctx, shopId: string, listingId: string | undefined) {
  if (!listingId) return true;
  const listing = await getListingRow(ctx.db, listingId);
  return listing?.shopId === shopId && listing.status === 'active';
}

/** Why the shop cannot answer this request, or null when it can. */
async function offerBlocker(ctx: Ctx, requestId: string, ownerId: string, input: SendOfferInput) {
  const request = await repo.findRequestById(ctx.db, requestId);
  if (!request || effectiveStatus(request, ctx.clock.now()) !== 'open') {
    return notFound('REQUEST_NOT_FOUND', 'That open request');
  }
  if (request.buyerId === ownerId) return forbidden('This is your own request');
  if (!(await checkListing(ctx, input.shopId, input.listingId))) {
    return notFound('LISTING_NOT_FOUND', 'That listing');
  }
  if (await repo.findOffer(ctx.db, requestId, input.shopId)) {
    return domainError('CONFLICT', 'Your shop already sent an offer for this request');
  }
  return null;
}

/** A seller answers a buyer's request with a price. One offer per shop per request. */
export async function sendOffer(
  ctx: Ctx,
  requestId: string,
  input: SendOfferInput,
): Promise<DomainResult<Offer>> {
  const shop = await requireShopOwner(ctx, input.shopId);
  if (!shop.ok) return shop;
  const blocker = await offerBlocker(ctx, requestId, shop.value.ownerId, input);
  if (blocker) return err(blocker);
  const id = createId();
  await repo.insertOffer(ctx.db, {
    id,
    requestId,
    shopId: input.shopId,
    listingId: input.listingId ?? null,
    priceNgn: input.priceNgn,
    message: input.message ?? null,
  });
  const row = await repo.findOfferById(ctx.db, id);
  const offer = row ? await toOffer(ctx.db, row) : null;
  return offer ? ok(offer) : err(notFound('SHOP_NOT_FOUND', 'That shop'));
}

export interface OfferContact {
  shopId: string;
  listingId: string | null;
  priceNgn: number;
  requestText: string;
}

/** What the buyer needs to message the shop behind an offer on their own request. */
export async function getOfferForContact(
  ctx: Ctx,
  offerId: string,
): Promise<DomainResult<OfferContact>> {
  const offer = await repo.findOfferById(ctx.db, offerId);
  const request = offer ? await repo.findRequestById(ctx.db, offer.requestId) : null;
  if (!offer || !request || request.buyerId !== ctx.actor?.userId) {
    return err(notFound('NOT_FOUND', 'That offer'));
  }
  return ok({
    shopId: offer.shopId,
    listingId: offer.listingId,
    priceNgn: offer.priceNgn,
    requestText: request.text,
  });
}
