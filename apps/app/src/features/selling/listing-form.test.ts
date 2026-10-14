import { describe, expect, it } from 'vitest';
import { parsePrice, validateListingForm } from './listing-form';

const base = {
  type: 'product' as const,
  title: 'iPhone 13, 128 GB',
  price: '₦520,000',
  negotiable: true,
  condition: 'uk_used' as const,
  categoryId: 'cphones000000000',
  description: '',
};

describe('listing form', () => {
  it('reads prices the way people type them', () => {
    expect(parsePrice('520,000')).toBe(520000);
    expect(parsePrice('₦ 15000')).toBe(15000);
    expect(parsePrice('free')).toBeNull();
  });

  it('builds the API input', () => {
    const { input } = validateListingForm('a1B2c3D4e5F6g7H8', base);
    expect(input).toMatchObject({ priceNgn: 520000, condition: 'uk_used', description: undefined });
  });

  it('does not ask services for a condition', () => {
    const { input, errors } = validateListingForm('a1B2c3D4e5F6g7H8', {
      ...base,
      type: 'service',
      condition: undefined,
    });
    expect(errors).toEqual({});
    expect(input?.condition).toBeUndefined();
  });

  it('explains what is missing', () => {
    const { errors } = validateListingForm('a1B2c3D4e5F6g7H8', {
      ...base,
      title: '',
      price: '',
      categoryId: undefined,
      condition: undefined,
    });
    expect(Object.keys(errors).sort()).toEqual(['categoryId', 'condition', 'price', 'title']);
  });
});
