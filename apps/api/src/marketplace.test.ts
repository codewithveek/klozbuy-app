import { CATEGORY_IDS, seedReferenceData } from '@klozbuy/db';
import { createTestDb } from '@klozbuy/db/testing';
import { afterAll, beforeAll, describe, expect, inject, it, vi } from 'vitest';
import { createApp } from './app';
import { testEnv } from './test-env';

const url = inject('apiTestDatabaseUrl');
const phone = '+2348039876543';

describe.runIf(url)('marketplace over HTTP', () => {
  let testDb: ReturnType<typeof createTestDb>;
  let app: ReturnType<typeof createApp>;
  let cookie = '';
  const env = testEnv();

  const call = (path: string, init: RequestInit = {}) =>
    app.request(
      path,
      { ...init, headers: { 'Content-Type': 'application/json', Cookie: cookie, ...init.headers } },
      env,
    );
  const post = (path: string, body: unknown) =>
    call(path, { method: 'POST', body: JSON.stringify(body) });

  beforeAll(async () => {
    testDb = createTestDb(url ?? '');
    await seedReferenceData(testDb.db);
    app = createApp({ createDb: () => testDb.db });
  });
  afterAll(() => testDb.close());

  it('signs in with a code sent to the phone', async () => {
    const logged = vi.spyOn(console, 'info');
    expect((await post('/v1/auth/phone-number/send-otp', { phoneNumber: phone })).status).toBe(200);
    const line = logged.mock.calls.map((args) => String(args[0])).find((l) => l.includes(phone));
    logged.mockRestore();
    const code = line?.match(/: (\d{6})/)?.[1];
    const verified = await post('/v1/auth/phone-number/verify', { phoneNumber: phone, code });
    expect(verified.status).toBe(200);
    cookie = (verified.headers.getSetCookie?.() ?? []).map((c) => c.split(';')[0]).join('; ');
    expect((await call('/v1/me')).status).toBe(200);
  });

  it('opens a shop, lists an item and finds it near Yaba', async () => {
    const shop = await post('/v1/shops', {
      name: 'Ada Phones',
      categoryId: CATEGORY_IDS['phones-tablets'],
      whatsappNumber: '+2348031112222',
      location: { lat: 6.5101, lng: 3.3702, landmark: 'Beside Yaba College of Technology gate' },
    });
    expect(shop.status).toBe(200);
    const { id: shopId } = (await shop.json()) as { id: string };
    const listing = await post('/v1/listings', {
      shopId,
      type: 'product',
      title: 'Samsung Galaxy A15, new',
      priceNgn: 185_000,
      categoryId: CATEGORY_IDS['phones-tablets'],
    });
    expect(listing.status).toBe(200);
    const feed = await call('/v1/feed/nearby?lat=6.5095&lng=3.3711&verifiedOnly=false');
    expect(feed.headers.get('Cache-Control')).toContain('max-age=30');
    const { items } = (await feed.json()) as { items: { title: string; listingId: string }[] };
    expect(items.map((i) => i.title)).toContain('Samsung Galaxy A15, new');

    const go = await call(`/go/whatsapp/${items[0]?.listingId}`, { redirect: 'manual' });
    expect(go.status).toBe(302);
    expect(go.headers.get('Location')).toMatch(/^https:\/\/wa\.me\/2348031112222/);
  });

  it('keeps seller-only data private and uncached', async () => {
    const mine = await call('/v1/me/shops');
    expect(mine.headers.get('Cache-Control')).toBeNull();
    const [shop] = (await mine.json()) as { id: string; whatsappNumber: string }[];
    expect(shop?.whatsappNumber).toBe('+2348031112222');
    const stats = (await (await call(`/v1/me/shops/${shop?.id}/stats`)).json()) as {
      totals: { whatsapp: number };
    };
    expect(stats.totals.whatsapp).toBe(1);
    const anonymous = await app.request(`/v1/me/shops/${shop?.id}/stats`, {}, env);
    expect(anonymous.status).toBe(401);
  });
});
