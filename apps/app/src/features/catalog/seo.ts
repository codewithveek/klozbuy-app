import type { ListingDetail, ShopPublic } from '@klozbuy/contracts';
import { formatNaira, toNaira } from '@klozbuy/shared';

const SITE = 'Klozbuy';

/** "iPhone 13, 128 GB – ₦520,000 at Tunde Gadgets, Yaba | Klozbuy" */
export function listingTitle(listing: ListingDetail): string {
  return `${listing.title} – ${formatNaira(toNaira(listing.priceNgn))} at ${listing.shop.name} | ${SITE}`;
}

export function listingDescription(listing: ListingDetail): string {
  const where = listing.shop.location ? ` near ${listing.shop.location.landmark}` : '';
  const checked = listing.shop.verified ? ' Shop checked in person by Klozbuy.' : '';
  const lead = listing.description ? ` ${listing.description.slice(0, 120)}` : '';
  return `${listing.title} for ${formatNaira(toNaira(listing.priceNgn))}${where}.${checked}${lead}`.trim();
}

/** schema.org Product with an offer and the seller, for search engines and answer engines. */
export function listingJsonLd(listing: ListingDetail, url: string) {
  const location = listing.shop.location;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    description: listing.description ?? undefined,
    category: listing.category.name,
    url,
    offers: {
      '@type': 'Offer',
      price: listing.priceNgn,
      priceCurrency: 'NGN',
      availability:
        listing.status === 'active' && listing.stockStatus !== 'out_of_stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'LocalBusiness',
        name: listing.shop.name,
        address: location
          ? {
              '@type': 'PostalAddress',
              streetAddress: location.landmark,
              addressLocality: 'Lagos',
              addressCountry: 'NG',
            }
          : undefined,
        geo: location
          ? { '@type': 'GeoCoordinates', latitude: location.lat, longitude: location.lng }
          : undefined,
      },
    },
  };
}

export function shopTitle(shop: ShopPublic): string {
  const where = shop.location ? `, ${shop.location.landmark}` : '';
  return `${shop.name}${where} | ${SITE}`;
}

export function shopJsonLd(shop: ShopPublic, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: shop.name,
    description: shop.description ?? undefined,
    url,
    address: shop.location
      ? {
          '@type': 'PostalAddress',
          streetAddress: shop.location.landmark,
          addressLocality: 'Lagos',
          addressCountry: 'NG',
        }
      : undefined,
    geo: shop.location
      ? { '@type': 'GeoCoordinates', latitude: shop.location.lat, longitude: shop.location.lng }
      : undefined,
  };
}
