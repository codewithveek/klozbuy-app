import type { DbExecutor } from '@klozbuy/db';
import { users } from '@klozbuy/db/schema';
import { and, eq, isNull } from 'drizzle-orm';

const profileColumns = {
  id: users.id,
  name: users.name,
  phoneNumber: users.phoneNumber,
  role: users.role,
  consentedAt: users.consentedAt,
};

export async function findUserProfile(db: DbExecutor, userId: string) {
  const rows = await db.select(profileColumns).from(users).where(eq(users.id, userId)).limit(1);
  return rows[0] ?? null;
}

export type UserProfileRow = NonNullable<Awaited<ReturnType<typeof findUserProfile>>>;

export async function updateUserName(db: DbExecutor, userId: string, name: string): Promise<void> {
  await db.update(users).set({ name }).where(eq(users.id, userId));
}

/** Sets consent once; a repeat keeps the first time. */
export async function setConsentedAt(db: DbExecutor, userId: string, at: Date): Promise<void> {
  await db
    .update(users)
    .set({ consentedAt: at })
    .where(and(eq(users.id, userId), isNull(users.consentedAt)));
}
