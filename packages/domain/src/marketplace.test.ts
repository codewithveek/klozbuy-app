import type { FeedPage } from '@klozbuy/contracts';
import { CATEGORY_IDS, seedReferenceData } from '@klozbuy/db';
import { createTestDb } from '@klozbuy/db/testing';
import { afterAll, beforeAll, describe, expect, inject, it } from 'vitest';
import {
  confirmStock,
  createListing,
  getListingPage,
  setListingStatus,
  updateListing,
} from './catalog';
import type { Actor, Ctx } from './context';
import { nearbyFeed, searchNearby } from './discovery';
import { recordView, shopInsights, startLead } from './leads';
import { createShop, getShopPage, recordVisit } from './shops';
import { createTestUser, testCtx } from './test-support';

const url = inject('testDatabaseUrl');
const yaba = { lat: 6.5095, lng: 3.3711 };
const phones = () => CATEGORY_IDS['phones-tablets'] ?? '';

function unwrap<T>(result: { ok: true; value: T } | { ok: false; error: { code: string } }): T {
  if (!result.ok) throw new Error(`Expected success, got ${result.error.code}`);
  return result.value;
}

const ids = (page: FeedPage) => page.items.map((item) => item.listingId);
const site = { siteUrl: 'https://klozbuy.com' };
const feedQuery = {
  ...yaba,
  radiusKm: 3,
  verifiedOnly: false,
  openNow: false,
  sort: 'closest' as const,
  limit: 20,
};

describe.runIf(url)('marketplace flow', () => {
  let testDb: ReturnType<typeof createTestDb>;
  let seller: Ctx;
  let buyer: Ctx;
  let agent: Ctx;
  let stranger: Ctx;
  let shopId: string;
  let listingId: string;
  let listingSlug: string;

  beforeAll(async () => {
    testDb = createTestDb(url ?? '');
    await seedReferenceData(testDb.db);
    const make = async (role: Actor['role']) =>
      testCtx(testDb.db, await createTestUser(testDb.db, role));
    [seller, buyer, agent, stranger] = await Promise.all([
      make('seller'),
      make('buyer'),
      make('agent'),
      make('buyer'),
    ]);
  });
  afterAll(() => testDb.close());

  it('opens a shop with its location', async () => {
    const shop = unwrap(
      await createShop(seller, {
        name: 'Tunde Gadgets',
        categoryId: phones(),
        whatsappNumber: '+2348031234567',
        location: { lat: 6.5112, lng: 3.3725, landmark: 'Opposite Yaba bus stop, Tejuosho Market' },
      }),
    );
    shopId = shop.id;
    expect(shop).toMatchObject({ verified: false, verificationStatus: 'unverified' });
    expect(shop.slug).toMatch(/^tunde-gadgets/);
  });

  it('publishes a listing that appears in the near-me feed at once', async () => {
    const listing = unwrap(
      await createListing(seller, {
        shopId,
        type: 'product',
        title: 'iPhone 13, 128 GB, UK used',
        priceNgn: 520_000,
        negotiable: true,
        condition: 'uk_used',
        categoryId: phones(),
      }),
    );
    listingId = listing.id;
    listingSlug = listing.slug;
    const page = unwrap(await nearbyFeed(buyer, feedQuery));
    expect(ids(page)).toContain(listingId);
    const item = page.items.find((i) => i.listingId === listingId);
    expect(item).toMatchObject({ priceNgn: 520_000, landmark: expect.stringContaining('Yaba') });
    expect(item?.distanceKm).toBeLessThan(0.5);
  });

  it('keeps unverified shops out of the verified-only feed until an agent verifies them', async () => {
    const verifiedOnly = { ...feedQuery, verifiedOnly: true };
    expect(ids(unwrap(await nearbyFeed(buyer, verifiedOnly)))).not.toContain(listingId);
    expect((await recordVisit(seller, shopId, { result: 'passed' })).ok).toBe(false);
    unwrap(await recordVisit(agent, shopId, { result: 'passed', notes: 'Shop is where it says' }));
    expect(ids(unwrap(await nearbyFeed(buyer, verifiedOnly)))).toContain(listingId);
  });

  it('leaves out listings beyond the radius', async () => {
    const ikeja = { ...feedQuery, lat: 6.6018, lng: 3.3515 };
    expect(ids(unwrap(await nearbyFeed(buyer, ikeja)))).not.toContain(listingId);
  });

  it('finds the listing by text near the buyer', async () => {
    const page = unwrap(await searchNearby(buyer, { ...feedQuery, q: 'iphone 13' }));
    expect(ids(page)[0]).toBe(listingId);
    expect(ids(unwrap(await searchNearby(buyer, { ...feedQuery, q: 'generator' })))).toEqual([]);
  });

  it('shows the listing page with its shop, and the shop page', async () => {
    const detail = unwrap(await getListingPage(buyer, listingSlug));
    expect(detail.shop).toMatchObject({ name: 'Tunde Gadgets', verified: true });
    expect(detail.category.slug).toBe('phones-tablets');
    expect(JSON.stringify(detail)).not.toContain('+2348031234567');
    const shop = unwrap(await getShopPage(buyer, detail.shop.slug));
    expect(shop.location?.landmark).toContain('Tejuosho');
  });

  it('lets only the owner change a listing', async () => {
    const attempt = await updateListing(stranger, listingId, { priceNgn: 1 });
    expect(attempt).toMatchObject({ ok: false, error: { code: 'NOT_SHOP_OWNER' } });
    const updated = unwrap(await updateListing(seller, listingId, { priceNgn: 499_000 }));
    expect(updated.priceNgn).toBe(499_000);
    const item = unwrap(await nearbyFeed(buyer, feedQuery)).items.find(
      (i) => i.listingId === listingId,
    );
    expect(item?.priceNgn).toBe(499_000);
  });

  it('rejects a category of the wrong type', async () => {
    const result = await createListing(seller, {
      shopId,
      type: 'service',
      title: 'Screen repair',
      priceNgn: 15_000,
      negotiable: false,
      categoryId: phones(),
    });
    expect(result).toMatchObject({ ok: false, error: { code: 'CATEGORY_NOT_FOUND' } });
  });

  it('records views and a WhatsApp lead and counts them for the seller', async () => {
    unwrap(await recordView(buyer, listingId));
    unwrap(await recordView(stranger, listingId));
    const link = unwrap(
      await startLead(buyer, listingId, 'whatsapp', { ...site, distanceKm: 0.4 }),
    );
    expect(link).toMatch(/^https:\/\/wa\.me\/2348031234567\?text=/);
    expect(decodeURIComponent(link)).toContain('iPhone 13, 128 GB, UK used (₦499,000)');
    expect(decodeURIComponent(link)).toContain(`https://klozbuy.com/l/${listingSlug}`);
    const insights = unwrap(await shopInsights(seller, shopId, 7));
    expect(insights.totals).toMatchObject({ views: 2, whatsapp: 1, call: 0 });
    expect(insights.whatsappByDay).toHaveLength(7);
    expect(insights.listings[0]).toMatchObject({ listingId, views: 2, whatsapp: 1 });
    expect((await shopInsights(stranger, shopId, 7)).ok).toBe(false);
  });

  it('confirms stock, then marks the listing sold and drops it from the feed', async () => {
    const confirmed = unwrap(await confirmStock(seller, listingId));
    expect(confirmed.stockConfirmedAt).not.toBeNull();
    unwrap(await setListingStatus(seller, listingId, { status: 'sold' }));
    expect(ids(unwrap(await nearbyFeed(buyer, feedQuery)))).not.toContain(listingId);
    expect(unwrap(await getListingPage(buyer, listingSlug)).status).toBe('sold');
    expect((await startLead(buyer, listingId, 'whatsapp', site)).ok).toBe(false);
  });
});
