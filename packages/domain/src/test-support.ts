import type { UserRole } from '@klozbuy/contracts';
import type { Db } from '@klozbuy/db';
import { users } from '@klozbuy/db/schema';
import { createId } from '@klozbuy/shared';
import { systemClock, type Actor, type Clock, type Ctx, type UserId } from './context';
import { createEventSink } from './wiring';

/** Helpers for database tests. Not exported from the package. */
export const fixedClock = (iso: string): Clock => ({ now: () => new Date(iso) });

let phoneCounter = 1_000_000;

export async function createTestUser(db: Db, role: UserRole = 'buyer'): Promise<Actor> {
  const userId = createId<'User'>() satisfies UserId;
  phoneCounter += 1;
  await db.insert(users).values({
    id: userId,
    name: `Test ${role}`,
    email: `${userId}@example.invalid`,
    phoneNumber: `+234805${phoneCounter}`,
    role,
  });
  return { userId, role };
}

export function testCtx(db: Db, actor: Actor | null, clock: Clock = systemClock): Ctx {
  return { db, clock, actor, publish: createEventSink(db) };
}
