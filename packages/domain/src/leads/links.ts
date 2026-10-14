import type { LeadChannel } from '@klozbuy/contracts';
import { listingMessage } from '@klozbuy/shared';

export interface LeadTarget {
  title: string;
  priceNgn: number;
  slug: string;
  shopName: string;
  whatsappNumber: string;
  location: { lat: number; lng: number } | null;
}

export const whatsappUrl = (phone: string, message: string) =>
  `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

/** Where each channel sends the buyer. Null when the shop has no location for directions. */
export function leadUrl(channel: LeadChannel, target: LeadTarget, siteUrl: string): string | null {
  if (channel === 'whatsapp') {
    const url = `${siteUrl}/l/${target.slug}`;
    return whatsappUrl(
      target.whatsappNumber,
      listingMessage({
        shopName: target.shopName,
        title: target.title,
        priceNgn: target.priceNgn,
        url,
      }),
    );
  }
  if (channel === 'call') return `tel:+${target.whatsappNumber.replace(/\D/g, '')}`;
  if (!target.location) return null;
  const { lat, lng } = target.location;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
