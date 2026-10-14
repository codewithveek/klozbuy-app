import type { Brand } from './brand';

/** Whole naira. Klozbuy never stores or shows kobo. */
export type Naira = Brand<number, 'Naira'>;

export const MAX_NAIRA = 10_000_000_000;

export function isNaira(value: number): value is Naira {
  return Number.isSafeInteger(value) && value >= 0 && value <= MAX_NAIRA;
}

export function toNaira(value: number): Naira {
  if (!isNaira(value)) throw new RangeError(`Not a valid naira amount: ${value}`);
  return value;
}

const grouping = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 });

/** ₦520,000 — the only money format the UI uses. */
export function formatNaira(amount: number): string {
  return `₦${grouping.format(Math.round(amount))}`;
}
