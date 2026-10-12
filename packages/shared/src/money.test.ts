import { describe, expect, it } from 'vitest';
import { formatNaira, isNaira, toNaira } from './money';

describe('formatNaira', () => {
  it('uses the naira sign and thousands separators, no kobo', () => {
    expect(formatNaira(520000)).toBe('₦520,000');
    expect(formatNaira(18500)).toBe('₦18,500');
    expect(formatNaira(0)).toBe('₦0');
  });
});

describe('toNaira', () => {
  it('accepts whole, non-negative amounts', () => {
    expect(toNaira(245000)).toBe(245000);
    expect(isNaira(1.5)).toBe(false);
    expect(isNaira(-1)).toBe(false);
  });

  it('throws on invalid amounts', () => {
    expect(() => toNaira(12.5)).toThrow(RangeError);
  });
});
