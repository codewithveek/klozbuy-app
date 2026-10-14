import type { ListingDetail } from '@klozbuy/contracts';
import { formatTime } from '@klozbuy/shared';
import { CONDITION_LABELS, daysAgo } from '../../lib/format';

const STOCK = { in_stock: 'In stock', low: 'Low stock', out_of_stock: 'Out of stock' } as const;

/** "UK used · Phones and tablets". */
export function listingSubtitle(listing: ListingDetail): string {
  const condition = listing.condition ? CONDITION_LABELS[listing.condition] : null;
  return [condition, listing.category.name].filter(Boolean).join(' · ');
}

/** "In stock · confirmed today at 9:40am" (Lagos time), or just the stock state. */
export function stockSentence(listing: ListingDetail, now: Date): string {
  const base = STOCK[listing.stockStatus];
  if (!listing.stockConfirmedAt) return base;
  const day = daysAgo(listing.stockConfirmedAt, now);
  const time = lagosTime(listing.stockConfirmedAt);
  return `${base} · confirmed ${day}${day === 'today' || day === 'yesterday' ? ` at ${time}` : ''}`;
}

/** "9:40am" in Lagos (UTC+1, no daylight saving). */
function lagosTime(iso: string): string {
  const lagos = new Date(Date.parse(iso) + 60 * 60 * 1000);
  const hh = String(lagos.getUTCHours()).padStart(2, '0');
  const mm = String(lagos.getUTCMinutes()).padStart(2, '0');
  return formatTime(`${hh}:${mm}`);
}

/** Rows of the Details list, only for facts the listing has. */
export function detailRows(listing: ListingDetail, now: Date): [string, string][] {
  const rows: [string, string | null][] = [
    ['Condition', listing.condition ? CONDITION_LABELS[listing.condition] : null],
    ['Category', listing.category.name],
    ['Type', listing.type === 'service' ? 'Service' : 'Item'],
    ['Stock', STOCK[listing.stockStatus]],
    ['Price', listing.negotiable ? 'Negotiable' : 'Fixed'],
    ['Listed', daysAgo(listing.createdAt, now)],
  ];
  return rows.filter((row): row is [string, string] => row[1] !== null);
}

/** About 5 km an hour on foot, rounded to whole minutes. */
export function walkingMinutes(km: number): number {
  return Math.max(1, Math.round((km / 5) * 60));
}
