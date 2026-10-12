import type { LeadChannel } from '@klozbuy/contracts';
import { API_URL } from './config';

/** Tracked links: the API records the lead, then redirects to WhatsApp, the dialler or maps. */
export function goUrl(channel: LeadChannel, listingId: string): string {
  return `${API_URL}/go/${channel}/${listingId}`;
}

/** Directions to a shop (public; shops are places people walk to). */
export function mapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
