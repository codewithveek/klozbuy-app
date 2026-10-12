import type { ListingDetail } from '@klozbuy/contracts';
import { describe, expect, it } from 'vitest';
import { listingDescription, listingJsonLd, listingTitle } from './seo';

const listing: ListingDetail = {
  id: 'a1B2c3D4e5F6g7H8',
  shopId: 'Z9y8X7w6V5u4T3s2',
  slug: 'iphone-13-128-gb-k3x9q',
  type: 'product',
  title: 'iPhone 13, 128 GB',
  description: 'Clean UK used. Test it in the shop.',
  priceNgn: 520000,
  negotiable: true,
  condition: 'uk_used',
  stockStatus: 'in_stock',
  stockConfirmedAt: '2026-10-12T08:00:00.000Z',
  status: 'active',
  categoryId: 'cphones000000000',
  createdAt: '2026-10-01T08:00:00.000Z',
  updatedAt: '2026-10-12T08:00:00.000Z',
  category: { id: 'cphones000000000', slug: 'phones-tablets', name: 'Phones and tablets' },
  shop: {
    id: 'Z9y8X7w6V5u4T3s2',
    slug: 'tunde-gadgets',
    name: 'Tunde Gadgets',
    verified: true,
    ratingAvg: null,
    ratingCount: 0,
    location: {
      lat: 6.51,
      lng: 3.37,
      landmark: 'Tejuosho Market, Block C',
      address: null,
      areaId: null,
    },
  },
};

describe('listing SEO', () => {
  it('puts the item, price and shop in the title', () => {
    expect(listingTitle(listing)).toBe('iPhone 13, 128 GB – ₦520,000 at Tunde Gadgets | Klozbuy');
  });

  it('describes where it is and that the shop was checked', () => {
    const description = listingDescription(listing);
    expect(description).toContain('near Tejuosho Market, Block C');
    expect(description).toContain('checked in person');
  });

  it('marks sold listings out of stock in structured data', () => {
    const data = listingJsonLd({ ...listing, status: 'sold' }, 'https://klozbuy.com/l/x');
    expect(data.offers).toMatchObject({
      priceCurrency: 'NGN',
      price: 520000,
      availability: 'https://schema.org/OutOfStock',
    });
  });
});
