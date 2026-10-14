import type { Offer, RequestStatus, RequestSummary } from '@klozbuy/contracts';
import type { DbExecutor } from '@klozbuy/db';
import { getListingRow } from '../catalog';
import { getShopSnapshot } from '../shops';
import type { OfferRow, RequestRow } from './repository';

/** An open request past its expiry reads as expired; nothing needs to rewrite the row. */
export function effectiveStatus(row: RequestRow, now: Date): RequestStatus {
  return row.status === 'open' && row.expiresAt <= now ? 'expired' : row.status;
}

export interface SummaryExtras {
  offerCount: number;
  distanceKm: number | null;
  offered: boolean;
}

export function toRequestSummary(
  row: RequestRow,
  now: Date,
  extras: SummaryExtras,
): RequestSummary {
  return {
    id: row.id,
    text: row.text,
    categoryId: row.categoryId,
    budgetNgn: row.budgetNgn,
    status: effectiveStatus(row, now),
    ...extras,
    createdAt: row.createdAt.toISOString(),
    expiresAt: row.expiresAt.toISOString(),
  };
}

/** An offer with the shop that sent it; null when the shop is gone or suspended. */
export async function toOffer(db: DbExecutor, row: OfferRow): Promise<Offer | null> {
  const shop = await getShopSnapshot(db, row.shopId);
  if (!shop?.listable) return null;
  const listing = row.listingId ? await getListingRow(db, row.listingId) : null;
  const { id, slug, name, verified, ratingAvg, ratingCount } = shop;
  return {
    id: row.id,
    priceNgn: row.priceNgn,
    message: row.message,
    listingSlug: listing?.status === 'active' ? listing.slug : null,
    shop: { id, slug, name, verified, ratingAvg, ratingCount },
    createdAt: row.createdAt.toISOString(),
  };
}
