import type { LeadChannel } from '@klozbuy/contracts';
import { formatNaira, type Naira } from '@klozbuy/shared';

export interface LeadTarget {
  title: string;
  priceNgn: number;
  whatsappNumber: string;
  location: { lat: number; lng: number } | null;
}

/** A ready-made first message, so the seller knows exactly what the buyer saw. */
export function whatsappMessage(target: LeadTarget): string {
  const price = formatNaira(target.priceNgn as Naira);
  return `Hello, I saw your ${target.title} (${price}) on Klozbuy. Is it still available?`;
}

/** Where each channel sends the buyer. Null when the shop has no location for directions. */
export function leadUrl(channel: LeadChannel, target: LeadTarget): string | null {
  const digits = target.whatsappNumber.replace(/\D/g, '');
  if (channel === 'whatsapp') {
    return `https://wa.me/${digits}?text=${encodeURIComponent(whatsappMessage(target))}`;
  }
  if (channel === 'call') return `tel:+${digits}`;
  if (!target.location) return null;
  const { lat, lng } = target.location;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
