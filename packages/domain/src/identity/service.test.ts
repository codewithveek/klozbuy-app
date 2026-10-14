import type { Db } from '@klozbuy/db';
import { users } from '@klozbuy/db/schema';
import { createTestDb } from '@klozbuy/db/testing';
import { createId } from '@klozbuy/shared';
import { afterAll, beforeAll, describe, expect, inject, it } from 'vitest';
import type { Ctx, UserId } from '../context';
import { ignoreEvents } from '../events';
import { getMe, recordConsent, updateProfile } from './service';

const fixedClock = (iso: string) => ({ now: () => new Date(iso) });

/** A database that fails the test if a service touches it. */
const untouchedDb = new Proxy({} as Db, {
  get() {
    throw new Error('The database should not be used');
  },
});

describe('identity services without a session', () => {
  const ctx: Ctx = {
    db: untouchedDb,
    clock: fixedClock('2026-01-01T00:00:00Z'),
    actor: null,
    publish: ignoreEvents,
  };

  it('report UNAUTHENTICATED before touching the database', async () => {
    for (const result of [
      await getMe(ctx),
      await updateProfile(ctx, { name: 'Ada' }),
      await recordConsent(ctx),
    ]) {
      expect(result).toEqual({
        ok: false,
        error: expect.objectContaining({ code: 'UNAUTHENTICATED' }),
      });
    }
  });
});

const url = inject('testDatabaseUrl');

describe.runIf(url)('identity services', () => {
  let testDb: ReturnType<typeof createTestDb>;
  let ctx: Ctx;

  beforeAll(async () => {
    testDb = createTestDb(url ?? '');
    const userId = createId<'User'>() satisfies UserId;
    await testDb.db.insert(users).values({
      id: userId,
      name: '',
      email: `${userId}@example.invalid`,
      phoneNumber: `+234803${Math.floor(1_000_000 + Math.random() * 8_999_999)}`,
    });
    ctx = {
      db: testDb.db,
      clock: fixedClock('2026-03-01T09:30:00.000Z'),
      actor: { userId, role: 'buyer' },
      publish: ignoreEvents,
    };
  });
  afterAll(() => testDb.close());

  it('returns the signed-in profile', async () => {
    const result = await getMe(ctx);
    expect(result).toMatchObject({
      ok: true,
      value: { name: '', role: 'buyer', consentedAt: null },
    });
  });

  it('updates the name', async () => {
    const result = await updateProfile(ctx, { name: 'Tunde Bakare' });
    expect(result).toMatchObject({ ok: true, value: { name: 'Tunde Bakare' } });
  });

  it('records consent once and keeps the first time', async () => {
    await recordConsent(ctx);
    const later = { ...ctx, clock: fixedClock('2026-04-01T00:00:00.000Z') };
    const result = await recordConsent(later);
    expect(result).toMatchObject({ ok: true, value: { consentedAt: '2026-03-01T09:30:00.000Z' } });
  });

  it('treats a session for a missing user as signed out', async () => {
    const ghost: Ctx = { ...ctx, actor: { userId: createId<'User'>(), role: 'buyer' } };
    const result = await getMe(ghost);
    expect(result).toMatchObject({ ok: false, error: { code: 'UNAUTHENTICATED' } });
  });
});
