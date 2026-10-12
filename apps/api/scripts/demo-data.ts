/**
 * Fills a local database with demo shops and listings around Yaba, through the real
 * domain services (so the feed's read model is built the normal way). Development only.
 *
 *   LOCAL_DATABASE_URL=mysql://root@127.0.0.1:4000/klozbuy_local pnpm --filter @klozbuy/api demo-data
 */
import { CATEGORY_IDS, seedReferenceData, type Db } from '@klozbuy/db';
import { users } from '@klozbuy/db/schema';
import { createTestDb } from '@klozbuy/db/testing';
import { createEventSink, systemClock, type Actor, type Ctx } from '@klozbuy/domain';
import { createListing } from '@klozbuy/domain/catalog';
import { createShop, recordVisit } from '@klozbuy/domain/shops';
import { createRequest } from '@klozbuy/domain/requests';
import { recordView, startLead } from '@klozbuy/domain/leads';
import { createId } from '@klozbuy/shared';
import { REQUESTS, SHOPS, type DemoShop } from './demo-shops';

async function makeUser(db: Db, name: string, phone: string, role: Actor['role']): Promise<Actor> {
  const userId = createId<'User'>();
  await db.insert(users).values({
    id: userId,
    name,
    email: `${userId}@demo.klozbuy.invalid`,
    phoneNumber: phone,
    phoneNumberVerified: true,
    role,
  });
  return { userId, role };
}

const ctxFor = (db: Db, actor: Actor): Ctx => ({
  db,
  clock: systemClock,
  actor,
  publish: createEventSink(db),
});

/** Opens the shop and lists its items; returns the new listing IDs. */
async function addShop(db: Db, agent: Ctx, demo: DemoShop): Promise<string[]> {
  const seller = ctxFor(db, await makeUser(db, demo.name, demo.phone, 'seller'));
  const shop = await createShop(seller, {
    name: demo.name,
    categoryId: CATEGORY_IDS[demo.category] ?? '',
    description: demo.description,
    whatsappNumber: demo.phone,
    hours: demo.hours,
    location: { lat: demo.lat, lng: demo.lng, landmark: demo.landmark },
  });
  if (!shop.ok) throw new Error(`${demo.name}: ${shop.error.message}`);
  const ids: string[] = [];
  for (const { category, ...listing } of demo.listings) {
    const created = await createListing(seller, {
      ...listing,
      shopId: shop.value.id,
      categoryId: CATEGORY_IDS[category] ?? '',
    });
    if (!created.ok) throw new Error(`${listing.title}: ${created.error.message}`);
    ids.push(created.value.id);
  }
  if (demo.verified) await recordVisit(agent, shop.value.id, { result: 'passed' });
  return ids;
}

/** A buyer who browsed, so seller dashboards have real figures to show. */
async function addBuyerActivity(buyer: Ctx, listingIds: string[]) {
  for (const [index, listingId] of listingIds.entries()) {
    for (let view = 0; view < 3 + (index % 4) * 2; view += 1) await recordView(buyer, listingId);
    const options = { siteUrl: 'http://localhost:8081', distanceKm: 0.4 + (index % 5) * 0.6 };
    if (index % 2 === 0) await startLead(buyer, listingId, 'whatsapp', options);
    if (index % 3 === 0) await startLead(buyer, listingId, 'directions', options);
  }
  for (const request of REQUESTS) await createRequest(buyer, request);
}

async function main() {
  const url = process.env.LOCAL_DATABASE_URL ?? 'mysql://root@127.0.0.1:4000/klozbuy_local';
  const { db, close } = createTestDb(url);
  await seedReferenceData(db);
  const agent = ctxFor(db, { userId: createId<'User'>(), role: 'agent' });
  const listingIds: string[] = [];
  for (const demo of SHOPS) {
    listingIds.push(...(await addShop(db, agent, demo)));
    console.info(`Added ${demo.name} with ${demo.listings.length} listings`);
  }
  const buyer = ctxFor(db, await makeUser(db, 'Demo buyer', '+2348039990001', 'buyer'));
  await addBuyerActivity(buyer, listingIds);
  console.info('Added buyer views, chats and requests');
  await close();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
