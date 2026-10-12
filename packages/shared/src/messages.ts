import { formatNaira, type Naira } from './money';

/**
 * The message WhatsApp opens with, so the seller knows exactly what the buyer saw.
 * Shown on the listing page too, so buyers know what will be sent.
 */
export function listingMessage(input: {
  shopName: string;
  title: string;
  priceNgn: number;
  url: string;
}): string {
  const price = formatNaira(input.priceNgn as Naira);
  return `Hi ${input.shopName}, is the ${input.title} (${price}) you listed on Klozbuy still available? ${input.url}`;
}

export function offerMessage(input: {
  shopName: string;
  request: string;
  priceNgn: number;
}): string {
  const price = formatNaira(input.priceNgn as Naira);
  return `Hi ${input.shopName}, I saw your offer of ${price} for my request "${input.request}" on Klozbuy. Is it still available?`;
}
