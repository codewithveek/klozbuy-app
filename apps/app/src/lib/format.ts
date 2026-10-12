import type { Listing } from '@klozbuy/contracts';

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** One decimal with a space: 0.6 km. */
export function formatDistance(km: number): string {
  return `${Math.max(km, 0.1).toFixed(1)} km`;
}

export const CONDITION_LABELS: Record<NonNullable<Listing['condition']>, string> = {
  new: 'New',
  uk_used: 'UK used',
  used: 'Used',
  refurbished: 'Refurbished',
};

/** "today", "yesterday" or "5 days ago", in the seller's favour only when it is true. */
export function daysAgo(iso: string, now: Date): string {
  const days = Math.floor((now.getTime() - Date.parse(iso)) / DAY_MS);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

/** What buyers need to know about stock, as a specific statement. */
export function stockLine(
  listing: Pick<Listing, 'stockStatus'> & { stockConfirmedAt?: string | null },
  now: Date,
): string {
  if (listing.stockStatus === 'out_of_stock') return 'Out of stock';
  const base = listing.stockStatus === 'low' ? 'Low stock' : 'In stock';
  return listing.stockConfirmedAt
    ? `${base}, checked ${daysAgo(listing.stockConfirmedAt, now)}`
    : base;
}

/** "Checked in person, Sep 2026". */
export function verifiedLine(verifiedAt: string | null): string {
  if (!verifiedAt) return 'Checked in person';
  const date = new Date(verifiedAt);
  return `Checked in person, ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** Only same-site paths, so a crafted ?next= can't send someone elsewhere after sign-in. */
export function safeNext(next: string | undefined, fallback = '/'): string {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : fallback;
}
