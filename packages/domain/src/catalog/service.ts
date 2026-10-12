import type {
  Category,
  CreateListingInput,
  Listing,
  ListingDetail,
  SetListingStatusInput,
  UpdateListingInput,
} from '@klozbuy/contracts';
import { createId, err, ok } from '@klozbuy/shared';
import type { Ctx } from '../context';
import { domainError, notFound, type DomainResult } from '../errors';
import { getShopSnapshot, requireShopOwner, toShopLocation } from '../shops';
import { uniqueSlug } from '../slugs';
import { toCategory, toListing } from './mappers';
import * as repo from './repository';

const PUBLIC_STATUSES = ['active', 'sold'] as const;

async function checkCategory(ctx: Ctx, categoryId: string, type: Listing['type']) {
  const category = await repo.findCategory(ctx.db, categoryId);
  return category && category.type === type
    ? ok(category)
    : err(domainError('CATEGORY_NOT_FOUND', 'Choose a category that matches the listing type'));
}

/** Loads a listing and checks the actor owns its shop. */
async function requireOwnListing(
  ctx: Ctx,
  listingId: string,
): Promise<DomainResult<repo.ListingRow>> {
  const listing = await repo.findListingById(ctx.db, listingId);
  if (!listing) return err(notFound('LISTING_NOT_FOUND', 'That listing'));
  const shop = await requireShopOwner(ctx, listing.shopId);
  return shop.ok ? ok(listing) : shop;
}

/** Publishes a listing at once, with stock confirmed now. */
export async function createListing(
  ctx: Ctx,
  input: CreateListingInput,
): Promise<DomainResult<Listing>> {
  const shop = await requireShopOwner(ctx, input.shopId);
  if (!shop.ok) return shop;
  const category = await checkCategory(ctx, input.categoryId, input.type);
  if (!category.ok) return category;
  const id = createId();
  const slug = await uniqueSlug(input.title, (s) => repo.listingSlugTaken(ctx.db, s), {
    alwaysSuffix: true,
  });
  await repo.insertListing(ctx.db, {
    ...input,
    id,
    slug,
    description: input.description ?? null,
    condition: input.type === 'product' ? (input.condition ?? null) : null,
    status: 'active',
    stockConfirmedAt: ctx.clock.now(),
  });
  return changed(ctx, id);
}

async function changed(ctx: Ctx, listingId: string): Promise<DomainResult<Listing>> {
  await ctx.publish([{ type: 'ListingChanged', listingId }]);
  const row = await repo.findListingById(ctx.db, listingId);
  return row ? ok(toListing(row)) : err(notFound('LISTING_NOT_FOUND', 'That listing'));
}

export async function updateListing(
  ctx: Ctx,
  listingId: string,
  input: UpdateListingInput,
): Promise<DomainResult<Listing>> {
  const listing = await requireOwnListing(ctx, listingId);
  if (!listing.ok) return listing;
  if (input.categoryId) {
    const category = await checkCategory(ctx, input.categoryId, listing.value.type);
    if (!category.ok) return category;
  }
  await repo.updateListingRow(ctx.db, listingId, input);
  return changed(ctx, listingId);
}

/** Mark sold, hide, or put back on sale. */
export async function setListingStatus(
  ctx: Ctx,
  listingId: string,
  input: SetListingStatusInput,
): Promise<DomainResult<Listing>> {
  const listing = await requireOwnListing(ctx, listingId);
  if (!listing.ok) return listing;
  await repo.updateListingRow(ctx.db, listingId, { status: input.status });
  return changed(ctx, listingId);
}

/** "Still in stock": buyers see how recently the seller checked. */
export async function confirmStock(ctx: Ctx, listingId: string): Promise<DomainResult<Listing>> {
  const listing = await requireOwnListing(ctx, listingId);
  if (!listing.ok) return listing;
  await repo.updateListingRow(ctx.db, listingId, {
    stockConfirmedAt: ctx.clock.now(),
    stockStatus: 'in_stock',
  });
  return changed(ctx, listingId);
}

/** The public listing page, with its shop and category. */
export async function getListingPage(ctx: Ctx, slug: string): Promise<DomainResult<ListingDetail>> {
  const listing = await repo.findListingBySlug(ctx.db, slug);
  const visible = listing && (PUBLIC_STATUSES as readonly string[]).includes(listing.status);
  const shop = visible ? await getShopSnapshot(ctx.db, listing.shopId) : null;
  const category = visible ? await repo.findCategory(ctx.db, listing.categoryId) : null;
  if (!listing || !shop?.listable || !category)
    return err(notFound('LISTING_NOT_FOUND', 'That listing'));
  const { listable: _listable, whatsappNumber: _phone, location, ...summary } = shop;
  return ok({
    ...toListing(listing),
    shop: { ...summary, location: toShopLocation(location) },
    category: { id: category.id, slug: category.slug, name: category.name },
  });
}

/** Listings on a shop's public page. */
export async function listShopListings(ctx: Ctx, shopId: string): Promise<DomainResult<Listing[]>> {
  const rows = await repo.findShopListings(ctx.db, shopId, ['active']);
  return ok(rows.map(toListing));
}

/** Every listing of a shop the actor owns, for the seller dashboard. */
export async function listMyListings(ctx: Ctx, shopId: string): Promise<DomainResult<Listing[]>> {
  const shop = await requireShopOwner(ctx, shopId);
  if (!shop.ok) return shop;
  const rows = await repo.findShopListings(ctx.db, shopId, ['active', 'sold', 'hidden', 'draft']);
  return ok(rows.map(toListing));
}

export async function listCategories(ctx: Ctx): Promise<DomainResult<Category[]>> {
  return ok((await repo.findCategories(ctx.db)).map(toCategory));
}
