import { CATEGORY_IDS, seedReferenceData } from '@klozbuy/db';
import { createTestDb } from '@klozbuy/db/testing';
import { afterAll, beforeAll, describe, expect, inject, it } from 'vitest';
import { createListing } from './catalog';
import type { Ctx } from './context';
import { startOfferLead } from './leads';
import { createReport } from './moderation';
import {
  closeRequest,
  createRequest,
  getRequest,
  listMyRequests,
  listNearbyRequests,
  requestsForShop,
  sendOffer,
} from './requests';
import { createShop } from './shops';
import { createTestUser, testCtx } from './test-support';

const url = inject('testDatabaseUrl');
const yaba = { lat: 6.5095, lng: 3.3711 };
const phones = () => CATEGORY_IDS['phones-tablets'] ?? '';

function unwrap<T>(result: { ok: true; value: T } | { ok: false; error: { code: string } }): T {
  if (!result.ok) throw new Error(`Expected success, got ${result.error.code}`);
  return result.value;
}

describe.runIf(url)('buyer requests and offers', () => {
  let testDb: ReturnType<typeof createTestDb>;
  let seller: Ctx;
  let buyer: Ctx;
  let stranger: Ctx;
  let shopId: string;
  let listingId: string;
  let requestId: string;
  let offerId: string;

  beforeAll(async () => {
    testDb = createTestDb(url ?? '');
    await seedReferenceData(testDb.db);
    seller = testCtx(testDb.db, await createTestUser(testDb.db, 'seller'));
    buyer = testCtx(testDb.db, await createTestUser(testDb.db, 'buyer'));
    stranger = testCtx(testDb.db, await createTestUser(testDb.db, 'buyer'));
    const shop = unwrap(
      await createShop(seller, {
        name: 'Ade Phones',
        categoryId: phones(),
        whatsappNumber: '+2348039876543',
        location: { lat: 6.5112, lng: 3.3725, landmark: 'Inside Yaba Market, block C' },
      }),
    );
    shopId = shop.id;
    const listing = unwrap(
      await createListing(seller, {
        shopId,
        type: 'product',
        title: 'PS5 Slim, disc edition',
        priceNgn: 580_000,
        negotiable: true,
        categoryId: phones(),
      }),
    );
    listingId = listing.id;
  });
  afterAll(() => testDb.close());

  it('posts a request that nearby buyers and shops can see', async () => {
    const posted = unwrap(
      await createRequest(buyer, { text: 'PS5 slim under ₦600k', budgetNgn: 600_000, ...yaba }),
    );
    requestId = posted.id;
    expect(posted).toMatchObject({ status: 'open', mine: true, offerCount: 0 });
    const nearby = await listNearbyRequests(stranger, { ...yaba, radiusKm: 3 });
    expect(nearby.map((r) => r.id)).toContain(requestId);
    const forShop = unwrap(await requestsForShop(seller, shopId));
    expect(forShop.find((r) => r.id === requestId)).toMatchObject({ offered: false });
    const far = await listNearbyRequests(stranger, { lat: 6.6018, lng: 3.3515, radiusKm: 3 });
    expect(far.map((r) => r.id)).not.toContain(requestId);
  });

  it('takes one offer per shop and shows offers only to the buyer', async () => {
    const offer = unwrap(
      await sendOffer(seller, requestId, { shopId, priceNgn: 575_000, listingId }),
    );
    offerId = offer.id;
    expect(offer.listingSlug).toMatch(/^ps5-slim/);
    const again = await sendOffer(seller, requestId, { shopId, priceNgn: 570_000 });
    expect(again).toMatchObject({ ok: false, error: { code: 'CONFLICT' } });
    expect((await sendOffer(stranger, requestId, { shopId, priceNgn: 1 })).ok).toBe(false);
    const mine = unwrap(await getRequest(buyer, requestId));
    expect(mine.offers.map((o) => o.shop.name)).toEqual(['Ade Phones']);
    const theirs = unwrap(await getRequest(stranger, requestId));
    expect(theirs).toMatchObject({ mine: false, offers: [], offerCount: 1 });
    const forShop = unwrap(await requestsForShop(seller, shopId));
    expect(forShop.find((r) => r.id === requestId)).toMatchObject({ offered: true });
  });

  it('lets only the buyer message the shop behind an offer', async () => {
    const link = unwrap(await startOfferLead(buyer, offerId));
    expect(decodeURIComponent(link)).toContain('PS5 slim under ₦600k');
    expect((await startOfferLead(stranger, offerId)).ok).toBe(false);
  });

  it('closes the request so sellers stop seeing it', async () => {
    expect((await closeRequest(stranger, requestId)).ok).toBe(false);
    expect(unwrap(await closeRequest(buyer, requestId)).status).toBe('closed');
    expect(unwrap(await requestsForShop(seller, shopId)).map((r) => r.id)).not.toContain(requestId);
    expect(unwrap(await listMyRequests(buyer))[0]).toMatchObject({ id: requestId, offerCount: 1 });
  });

  it('accepts reports from signed-out visitors', async () => {
    const anonymous = testCtx(testDb.db, null);
    const report = await createReport(anonymous, {
      targetType: 'listing',
      targetId: listingId,
      reason: 'wrong_price',
    });
    expect(report.ok).toBe(true);
  });
});
