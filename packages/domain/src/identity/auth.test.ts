import { createTestDb } from '@klozbuy/db/testing';
import { ID_PATTERN } from '@klozbuy/shared';
import { afterAll, beforeAll, describe, expect, inject, it } from 'vitest';
import { createAuth, placeholderEmail } from './auth';

const url = inject('testDatabaseUrl');

describe.runIf(url)('phone sign-in', () => {
  const sent: { phoneNumber: string; code: string }[] = [];
  let testDb: ReturnType<typeof createTestDb>;
  let auth: ReturnType<typeof createAuth>;

  beforeAll(() => {
    testDb = createTestDb(url ?? '');
    auth = createAuth({
      db: testDb.db,
      secret: 'test-secret-that-is-at-least-32-characters',
      baseUrl: 'http://localhost:8787',
      trustedOrigins: ['http://localhost:8081'],
      sendOtp: async (message) => {
        sent.push(message);
      },
    });
  });
  afterAll(() => testDb.close());

  async function requestCode(phoneNumber: string) {
    await auth.api.sendPhoneNumberOTP({ body: { phoneNumber } });
    const message = sent.at(-1);
    expect(message?.phoneNumber).toBe(phoneNumber);
    return message?.code ?? '';
  }

  it('creates an account on first verification and signs the user in', async () => {
    const phoneNumber = '+2348031234567';
    const code = await requestCode(phoneNumber);

    const result = await auth.api.verifyPhoneNumber({ body: { phoneNumber, code } });

    expect(result.status).toBe(true);
    expect(result.token).toBeTruthy();
    expect(result.user.id).toMatch(ID_PATTERN);
    expect(result.user).toMatchObject({
      phoneNumber,
      phoneNumberVerified: true,
      email: placeholderEmail(phoneNumber),
      role: 'buyer',
    });
  });

  it('signs an existing number into the same account', async () => {
    const phoneNumber = '+2349051234567';
    const first = await auth.api.verifyPhoneNumber({
      body: { phoneNumber, code: await requestCode(phoneNumber) },
    });
    const second = await auth.api.verifyPhoneNumber({
      body: { phoneNumber, code: await requestCode(phoneNumber) },
    });
    expect(second.user.id).toBe(first.user.id);
  });

  it('rejects a wrong code', async () => {
    const phoneNumber = '+2347061234567';
    const code = await requestCode(phoneNumber);
    const wrong = code === '000000' ? '111111' : '000000';
    await expect(
      auth.api.verifyPhoneNumber({ body: { phoneNumber, code: wrong } }),
    ).rejects.toThrow();
  });

  it('refuses to send codes to numbers that are not Nigerian mobiles', async () => {
    await expect(
      auth.api.sendPhoneNumberOTP({ body: { phoneNumber: '08012345678' } }),
    ).rejects.toThrow();
  });
});
