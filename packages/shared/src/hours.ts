/**
 * Opening hours in Lagos time (UTC+1 all year, no daylight saving). Hours are "HH:MM";
 * days are ISO weekdays, 1 = Monday … 7 = Sunday.
 */
export interface OpeningHours {
  opensAt: string | null;
  closesAt: string | null;
  openDays: number[];
}

const LAGOS_OFFSET_MINUTES = 60;
export const HOURS_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const toMinutes = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

/** Weekday (1–7) and minutes since midnight in Lagos. */
export function lagosClock(date: Date): { day: number; minutes: number } {
  const local = new Date(date.getTime() + LAGOS_OFFSET_MINUTES * 60_000);
  const day = local.getUTCDay() === 0 ? 7 : local.getUTCDay();
  return { day, minutes: local.getUTCHours() * 60 + local.getUTCMinutes() };
}

/** "7pm", "9:30am". */
export function formatTime(hhmm: string): string {
  const hours = Number(hhmm.slice(0, 2));
  const minutes = hhmm.slice(3, 5);
  const suffix = hours >= 12 ? 'pm' : 'am';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return minutes === '00' ? `${hour12}${suffix}` : `${hour12}:${minutes}${suffix}`;
}

export function isOpenAt(hours: OpeningHours, date: Date): boolean | null {
  if (!hours.opensAt || !hours.closesAt) return null;
  const { day, minutes } = lagosClock(date);
  if (!hours.openDays.includes(day)) return false;
  return minutes >= toMinutes(hours.opensAt) && minutes < toMinutes(hours.closesAt);
}

/** "Open now · closes 7pm", "Closed · opens 8am", "Closed today", or null without hours. */
export function describeHours(hours: OpeningHours, date: Date): string | null {
  const open = isOpenAt(hours, date);
  if (open === null || !hours.opensAt || !hours.closesAt) return null;
  if (open) return `Open now · closes ${formatTime(hours.closesAt)}`;
  const { day, minutes } = lagosClock(date);
  if (hours.openDays.includes(day) && minutes < toMinutes(hours.opensAt)) {
    return `Closed · opens ${formatTime(hours.opensAt)}`;
  }
  return 'Closed today';
}

/** "1,2,3,4,5,6" ↔ [1, 2, 3, 4, 5, 6], as stored in the database. */
export const parseDays = (value: string | null | undefined): number[] =>
  (value ?? '')
    .split(',')
    .map(Number)
    .filter((d) => d >= 1 && d <= 7);
export const formatDays = (days: number[]): string => [...new Set(days)].sort().join(',');
