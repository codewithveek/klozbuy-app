import { describe, expect, it } from 'vitest';
import { daysAgo, formatDistance, safeNext, stockLine, verifiedLine } from './format';

const now = new Date('2026-10-12T12:00:00Z');

describe('format', () => {
  it('writes distances with one decimal', () => {
    expect(formatDistance(0.62)).toBe('0.6 km');
    expect(formatDistance(0.01)).toBe('0.1 km');
  });

  it('says how recently stock was checked', () => {
    expect(daysAgo('2026-10-12T08:00:00Z', now)).toBe('today');
    expect(daysAgo('2026-10-11T08:00:00Z', now)).toBe('yesterday');
    expect(
      stockLine({ stockStatus: 'in_stock', stockConfirmedAt: '2026-10-07T08:00:00Z' }, now),
    ).toBe('In stock, checked 5 days ago');
    expect(stockLine({ stockStatus: 'out_of_stock', stockConfirmedAt: null }, now)).toBe(
      'Out of stock',
    );
  });

  it('dates verification', () => {
    expect(verifiedLine('2026-09-03T10:00:00Z')).toBe('Checked in person, Sep 2026');
  });

  it('only follows same-site next links', () => {
    expect(safeNext('/sell')).toBe('/sell');
    expect(safeNext('//evil.example')).toBe('/');
    expect(safeNext('https://evil.example')).toBe('/');
    expect(safeNext(undefined, '/x')).toBe('/x');
  });
});
