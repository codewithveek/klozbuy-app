import type { DbExecutor } from '@klozbuy/db';
import { leadEvents } from '@klozbuy/db/schema';
import { and, count, eq, gte, sql } from 'drizzle-orm';

/** Records a tap. The ID is the event ID, so a repeated delivery is ignored. */
export async function insertLead(db: DbExecutor, values: typeof leadEvents.$inferInsert) {
  await db
    .insert(leadEvents)
    .values(values)
    .onDuplicateKeyUpdate({ set: { id: sql`id` } });
}

/** Lead counts per day and channel since a date; served by (shop_id, created_at). */
export async function countLeadsByDay(db: DbExecutor, shopId: string, since: Date) {
  const day = sql<string>`DATE_FORMAT(${leadEvents.createdAt}, '%Y-%m-%d')`.as('day');
  return db
    .select({ day, channel: leadEvents.channel, total: count() })
    .from(leadEvents)
    .where(and(eq(leadEvents.shopId, shopId), gte(leadEvents.createdAt, since)))
    .groupBy(day, leadEvents.channel);
}
