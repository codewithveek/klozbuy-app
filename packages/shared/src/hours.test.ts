import { describe, expect, it } from 'vitest';
import { describeHours, formatTime, isOpenAt, lagosClock, parseDays } from './hours';

const weekdays = { opensAt: '08:00', closesAt: '19:00', openDays: [1, 2, 3, 4, 5, 6] };
// 2026-10-12 is a Monday.
const at = (iso: string) => new Date(iso);

describe('opening hours', () => {
  it('reads the Lagos clock (UTC+1)', () => {
    expect(lagosClock(at('2026-10-12T23:30:00Z'))).toEqual({ day: 2, minutes: 30 });
  });

  it('is open during hours on open days only', () => {
    expect(isOpenAt(weekdays, at('2026-10-12T09:00:00Z'))).toBe(true); // 10am Monday
    expect(isOpenAt(weekdays, at('2026-10-12T18:30:00Z'))).toBe(false); // 7:30pm
    expect(isOpenAt(weekdays, at('2026-10-18T10:00:00Z'))).toBe(false); // Sunday
    expect(
      isOpenAt({ opensAt: null, closesAt: null, openDays: [] }, at('2026-10-12T10:00:00Z')),
    ).toBeNull();
  });

  it('describes the state like the mockups', () => {
    expect(describeHours(weekdays, at('2026-10-12T09:00:00Z'))).toBe('Open now · closes 7pm');
    expect(describeHours(weekdays, at('2026-10-12T05:00:00Z'))).toBe('Closed · opens 8am');
    expect(describeHours(weekdays, at('2026-10-18T10:00:00Z'))).toBe('Closed today');
  });

  it('formats times and parses stored days', () => {
    expect(formatTime('09:30')).toBe('9:30am');
    expect(formatTime('12:00')).toBe('12pm');
    expect(parseDays('1,2,9,x,7')).toEqual([1, 2, 7]);
  });
});
