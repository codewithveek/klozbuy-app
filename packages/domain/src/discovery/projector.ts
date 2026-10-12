import type { Db, DbExecutor } from '@klozbuy/db';
import { searchTerms } from '@klozbuy/shared';
import { findShopListings, getListingRow, type ListingRow } from '../catalog';
import type { DomainEvent } from '../events';
import { getShopSnapshot, type ShopSnapshot } from '../shops';
import { nearestArea } from './ranking';
import * as repo from './repository';

const INDEXED_STATUSES = new Set<ListingRow['status']>(['active', 'sold']);

type Located = ShopSnapshot & { location: NonNullable<ShopSnapshot['location']> };

function toSearchRow(listing: ListingRow, shop: Located, areaId: string | null) {
  const { location } = shop;
  return {
    listingId: listing.id,
    slug: listing.slug,
    type: listing.type,
    title: listing.title,
    priceNgn: listing.priceNgn,
    negotiable: listing.negotiable,
    condition: listing.condition,
    stockStatus: listing.stockStatus,
    stockConfirmedAt: listing.stockConfirmedAt,
    categoryId: listing.categoryId,
    status: listing.status,
    shopId: shop.id,
    shopSlug: shop.slug,
    shopName: shop.name,
    verified: shop.verified,
    ratingAvg: shop.ratingAvg,
    ratingCount: shop.ratingCount,
    areaId,
    landmark: location.landmark,
    lat: location.lat,
    lng: location.lng,
    h3r7: location.h3r7,
    h3r8: location.h3r8,
  };
}

/** The listing and its located shop, or null when the listing should not be in the feed. */
async function loadIndexable(db: DbExecutor, listingId: string) {
  const listing = await getListingRow(db, listingId);
  if (!listing || !INDEXED_STATUSES.has(listing.status)) return null;
  const shop = await getShopSnapshot(db, listing.shopId);
  if (!shop?.listable || !shop.location) return null;
  const located: Located = { ...shop, location: shop.location };
  return { listing, shop: located };
}

/** Brings one listing's feed row and search words up to date, or removes them. */
export async function reindexListing(db: DbExecutor, listingId: string): Promise<void> {
  const indexable = await loadIndexable(db, listingId);
  if (!indexable) {
    await repo.removeFromIndex(db, listingId);
    return;
  }
  const { listing, shop } = indexable;
  const areaId =
    shop.location.areaId ?? nearestArea(await repo.findAreas(db), shop.location)?.id ?? null;
  await repo.upsertSearchRow(db, toSearchRow(listing, shop, areaId));
  const words = listing.status === 'active' ? searchTerms(listing.title) : [];
  await repo.replaceTerms(db, listingId, shop.location.h3r7, words);
}

export async function reindexShop(db: DbExecutor, shopId: string): Promise<void> {
  const listings = await findShopListings(db, shopId, [
    'active',
    'sold',
    'hidden',
    'draft',
    'removed',
  ]);
  for (const listing of listings) await reindexListing(db, listing.id);
}

/** Keeps the read model current from domain events. Wired up by the composition root. */
export async function handleEvents(db: Db, events: DomainEvent[]): Promise<void> {
  const seen = new Set<string>();
  for (const event of events) {
    const key = event.type === 'ShopChanged' ? `s:${event.shopId}` : `l:${event.listingId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (event.type === 'ShopChanged') await reindexShop(db, event.shopId);
    else await reindexListing(db, event.listingId);
  }
}
