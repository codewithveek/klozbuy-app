import type { LeadChannel } from '@klozbuy/contracts';
import { API_URL } from './config';

/**
 * Tracked links: the API records the lead, then redirects to WhatsApp, the dialler or maps.
 * The buyer's distance, when known, tells the seller how far their buyers come from.
 */
export function goUrl(channel: LeadChannel, listingId: string, distanceKm?: number): string {
  const distance = distanceKm === undefined ? '' : `?d=${distanceKm.toFixed(1)}`;
  return `${API_URL}/go/${channel}/${listingId}${distance}`;
}

/** WhatsApp the shop behind an offer on the buyer's own request. */
export function offerUrl(offerId: string): string {
  return `${API_URL}/go/offer/${offerId}`;
}

/** Directions to a shop (public; shops are places people walk to). */
export function mapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
