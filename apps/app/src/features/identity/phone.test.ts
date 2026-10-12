import { describe, expect, it } from 'vitest';
import { formatLocalPhone, toInternationalPhone } from './phone';

describe('toInternationalPhone', () => {
  it.each(['0803 123 4567', '803 123 4567', '2348031234567', '+234 803-123-4567'])(
    'reads %s',
    (input) => {
      expect(toInternationalPhone(input)).toBe('+2348031234567');
    },
  );

  it.each(['', '0803 123', '0103 123 4567', '+44 7700 900123'])('rejects %s', (input) => {
    expect(toInternationalPhone(input)).toBeNull();
  });
});

describe('formatLocalPhone', () => {
  it('writes the number the local way', () => {
    expect(formatLocalPhone('+2348031234567')).toBe('0803 123 4567');
  });
});
