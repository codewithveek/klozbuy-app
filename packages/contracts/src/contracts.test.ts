import { describe, expect, it } from 'vitest';
import { createListingInputSchema, nearbyFeedQuerySchema, nigerianPhoneSchema } from './index';

describe('nearbyFeedQuerySchema', () => {
  it('coerces query-string values and applies defaults', () => {
    const query = nearbyFeedQuerySchema.parse({ lat: '6.5095', lng: '3.3711' });
    expect(query).toMatchObject({ lat: 6.5095, lng: 3.3711, radiusKm: 3, verifiedOnly: true });
  });

  it('rejects radii other than 1, 3, 5 and 10 km', () => {
    expect(nearbyFeedQuerySchema.safeParse({ lat: '6.5', lng: '3.3', radiusKm: '2' }).success).toBe(
      false,
    );
  });
});

describe('createListingInputSchema', () => {
  const base = {
    shopId: 'a1B2c3D4e5F6g7H8',
    type: 'product',
    title: '  iPhone 13, 128 GB  ',
    priceNgn: 520000,
    categoryId: 'Z9y8X7w6V5u4T3s2',
  };

  it('trims the title and defaults negotiable to false', () => {
    const input = createListingInputSchema.parse(base);
    expect(input.title).toBe('iPhone 13, 128 GB');
    expect(input.negotiable).toBe(false);
  });

  it('rejects kobo amounts', () => {
    expect(createListingInputSchema.safeParse({ ...base, priceNgn: 520000.5 }).success).toBe(false);
  });
});

describe('nigerianPhoneSchema', () => {
  it('accepts +234 mobile numbers only', () => {
    expect(nigerianPhoneSchema.safeParse('+2348012345678').success).toBe(true);
    expect(nigerianPhoneSchema.safeParse('08012345678').success).toBe(false);
  });
});
