/**
 * Fills a local database with demo shops and listings around Yaba, through the real
 * domain services (so the feed's read model is built the normal way). Development only.
 *
 *   LOCAL_DATABASE_URL=mysql://root@127.0.0.1:4000/klozbuy_local pnpm --filter @klozbuy/api demo-data
 */
import type { CreateListingInput } from '@klozbuy/contracts';
import { CATEGORY_IDS, seedReferenceData, type Db } from '@klozbuy/db';
import { users } from '@klozbuy/db/schema';
import { createTestDb } from '@klozbuy/db/testing';
import { createEventSink, systemClock, type Actor, type Ctx } from '@klozbuy/domain';
import { createListing } from '@klozbuy/domain/catalog';
import { createShop, recordVisit } from '@klozbuy/domain/shops';
import { createId } from '@klozbuy/shared';

type DemoListing = Omit<CreateListingInput, 'shopId' | 'categoryId'> & { category: string };
interface DemoShop {
  name: string;
  category: string;
  phone: string;
  landmark: string;
  lat: number;
  lng: number;
  verified: boolean;
  listings: DemoListing[];
}

const product = (
  title: string,
  priceNgn: number,
  category: string,
  extra: Partial<DemoListing> = {},
): DemoListing => ({
  type: 'product',
  title,
  priceNgn,
  category,
  negotiable: false,
  condition: 'new',
  ...extra,
});
const service = (title: string, priceNgn: number, category: string): DemoListing => ({
  type: 'service',
  title,
  priceNgn,
  category,
  negotiable: true,
});

const SHOPS: DemoShop[] = [
  {
    name: 'Tunde Gadgets',
    category: 'phones-tablets',
    phone: '+2348031110001',
    landmark: 'Tejuosho Market, Block C, shop 14',
    lat: 6.5112,
    lng: 3.3725,
    verified: true,
    listings: [
      product('iPhone 13, 128 GB, UK used', 520000, 'phones-tablets', {
        negotiable: true,
        condition: 'uk_used',
        description: 'Battery health 89%. Face ID works. Test it in the shop before you pay.',
      }),
      product('Samsung Galaxy A15, 128 GB', 185000, 'phones-tablets'),
      product('Oraimo 20,000 mAh power bank', 18500, 'electronics'),
    ],
  },
  {
    name: 'Ọlá Fabrics and Tailoring',
    category: 'tailoring',
    phone: '+2348031110002',
    landmark: 'Opposite Yaba bus stop, beside the pharmacy',
    lat: 6.5079,
    lng: 3.3789,
    verified: true,
    listings: [
      service('Agbada sewing, your fabric', 25000, 'tailoring'),
      product('Ankara fabric, 6 yards', 12000, 'fashion', { negotiable: true }),
    ],
  },
  {
    name: 'Mama Nkechi Provisions',
    category: 'groceries',
    phone: '+2348031110003',
    landmark: 'Herbert Macaulay Way, near Sabo junction',
    lat: 6.5047,
    lng: 3.3768,
    verified: false,
    listings: [
      product('Mama Gold rice, 50 kg bag', 78000, 'groceries'),
      product('Peak milk powder, 900 g refill', 7400, 'groceries'),
    ],
  },
  {
    name: 'FixIt Phone Clinic',
    category: 'phone-laptop-repair',
    phone: '+2348031110004',
    landmark: 'Computer Village annex, Commercial Avenue',
    lat: 6.5131,
    lng: 3.3689,
    verified: true,
    listings: [
      service('iPhone screen replacement', 45000, 'phone-laptop-repair'),
      service('Laptop keyboard repair', 20000, 'phone-laptop-repair'),
    ],
  },
  {
    name: 'Sabo Home Store',
    category: 'home-furniture',
    phone: '+2348031110005',
    landmark: 'Sabo market, by the footbridge',
    lat: 6.5026,
    lng: 3.3801,
    verified: true,
    listings: [
      product('Binatone standing fan, 18 inch', 42000, 'electronics'),
      product('Plastic chairs, set of 4', 26000, 'home-furniture', { negotiable: true }),
    ],
  },
];

async function makeSeller(db: Db, shop: DemoShop): Promise<Actor> {
  const userId = createId<'User'>();
  await db.insert(users).values({
    id: userId,
    name: shop.name,
    email: `${userId}@demo.klozbuy.invalid`,
    phoneNumber: shop.phone,
    phoneNumberVerified: true,
    role: 'seller',
  });
  return { userId, role: 'seller' };
}

const ctxFor = (db: Db, actor: Actor): Ctx => ({
  db,
  clock: systemClock,
  actor,
  publish: createEventSink(db),
});

async function main() {
  const url = process.env.LOCAL_DATABASE_URL ?? 'mysql://root@127.0.0.1:4000/klozbuy_local';
  const { db, close } = createTestDb(url);
  await seedReferenceData(db);
  const agent = ctxFor(db, { userId: createId<'User'>(), role: 'agent' });
  for (const demo of SHOPS) {
    const seller = ctxFor(db, await makeSeller(db, demo));
    const shop = await createShop(seller, {
      name: demo.name,
      categoryId: CATEGORY_IDS[demo.category] ?? '',
      whatsappNumber: demo.phone,
      location: { lat: demo.lat, lng: demo.lng, landmark: demo.landmark },
    });
    if (!shop.ok) throw new Error(`${demo.name}: ${shop.error.message}`);
    for (const { category, ...listing } of demo.listings) {
      const created = await createListing(seller, {
        ...listing,
        shopId: shop.value.id,
        categoryId: CATEGORY_IDS[category] ?? '',
      });
      if (!created.ok) throw new Error(`${listing.title}: ${created.error.message}`);
    }
    if (demo.verified) await recordVisit(agent, shop.value.id, { result: 'passed' });
    console.info(`Added ${demo.name} with ${demo.listings.length} listings`);
  }
  await close();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
