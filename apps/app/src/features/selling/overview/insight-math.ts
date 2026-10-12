import type { ShopInsights } from '@klozbuy/contracts';

export type Period = 7 | 30;
export type Metric = keyof ShopInsights['totals'];

export interface Change {
  label: string;
  direction: 'up' | 'down' | 'flat';
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "18% vs last week", "New this month", or null when there is nothing to compare. */
export function change(current: number, previous: number, period: Period): Change | null {
  const span = period === 7 ? 'last week' : 'last month';
  if (previous === 0) return current > 0 ? { label: `New since ${span}`, direction: 'up' } : null;
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) return { label: `Same as ${span}`, direction: 'flat' };
  return { label: `${Math.abs(pct)}% vs ${span}`, direction: pct > 0 ? 'up' : 'down' };
}

/** "6 to 12 Oct" or "13 Sep to 12 Oct". */
export function periodLabel(from: string, to: string): string {
  const [a, b] = [new Date(`${from}T00:00:00Z`), new Date(`${to}T00:00:00Z`)];
  const month = (d: Date) => MONTHS[d.getUTCMonth()] ?? '';
  const start =
    a.getUTCMonth() === b.getUTCMonth() ? `${a.getUTCDate()}` : `${a.getUTCDate()} ${month(a)}`;
  return `${start} to ${b.getUTCDate()} ${month(b)}`;
}

/** Good morning / afternoon / evening, by the clock in Lagos (UTC+1). */
export function greeting(now: Date): string {
  const hour = (now.getUTCHours() + 1) % 24;
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/** The headline over the chats chart, stated as a fact. */
export function chatsHeadline(insights: ShopInsights): string {
  const now = insights.totals.whatsapp;
  const before = insights.previous.whatsapp;
  const span = insights.days === 7 ? 'last week' : 'last month';
  if (now === 0) return 'No WhatsApp chats yet in this period';
  if (before === 0) return `${now} WhatsApp ${now === 1 ? 'chat' : 'chats'}, up from none ${span}`;
  const pct = Math.round(((now - before) / before) * 100);
  if (pct === 0) return `WhatsApp chats are level with ${span}`;
  return `WhatsApp chats are ${pct > 0 ? 'up' : 'down'} ${Math.abs(pct)}% on ${span}`;
}
