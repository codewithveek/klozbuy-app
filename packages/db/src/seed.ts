import { sql } from 'drizzle-orm';
import type { DbExecutor } from './client';
import { areas, categories } from './schema';

/** Reference data IDs never change, so links and tests can rely on them. */
const fixedId = (prefix: string) => prefix.padEnd(16, '0');

type CategorySeed = { slug: string; name: string; type: 'product' | 'service'; key: string };

const CATEGORY_SEEDS: CategorySeed[] = [
  { key: 'cphones', slug: 'phones-tablets', name: 'Phones and tablets', type: 'product' },
  { key: 'ccomputers', slug: 'computers', name: 'Laptops and computers', type: 'product' },
  { key: 'celectronics', slug: 'electronics', name: 'Electronics', type: 'product' },
  { key: 'cfashion', slug: 'fashion', name: 'Fashion', type: 'product' },
  { key: 'cgroceries', slug: 'groceries', name: 'Food and groceries', type: 'product' },
  { key: 'cbeauty', slug: 'beauty', name: 'Beauty and personal care', type: 'product' },
  { key: 'chome', slug: 'home-furniture', name: 'Home and furniture', type: 'product' },
  { key: 'cbaby', slug: 'babies-kids', name: 'Babies and kids', type: 'product' },
  { key: 'cautoparts', slug: 'auto-parts', name: 'Auto parts', type: 'product' },
  { key: 'cbuilding', slug: 'building-materials', name: 'Building materials', type: 'product' },
  { key: 'srepair', slug: 'phone-laptop-repair', name: 'Phone and laptop repair', type: 'service' },
  { key: 'stailoring', slug: 'tailoring', name: 'Tailoring', type: 'service' },
  { key: 'shair', slug: 'hair-beauty', name: 'Hair and beauty', type: 'service' },
  { key: 'smechanics', slug: 'mechanics', name: 'Mechanics', type: 'service' },
  { key: 'selectric', slug: 'electricians', name: 'Electricians', type: 'service' },
  { key: 'slaundry', slug: 'laundry', name: 'Laundry', type: 'service' },
  { key: 'splumbing', slug: 'plumbing', name: 'Plumbing', type: 'service' },
  { key: 'sprinting', slug: 'printing', name: 'Printing', type: 'service' },
];

export const CATEGORIES = CATEGORY_SEEDS.map(({ key, ...category }, position) => ({
  id: fixedId(key),
  parentId: null,
  position,
  ...category,
}));

/** Category IDs by slug, for seed scripts and tests. */
export const CATEGORY_IDS = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.id])) as Record<
  string,
  string
>;

const AREA_SEEDS: [key: string, slug: string, name: string, lat: number, lng: number][] = [
  ['ayaba', 'yaba', 'Yaba', 6.5095, 3.3711],
  ['asurulere', 'surulere', 'Surulere', 6.5005, 3.354],
  ['aikeja', 'ikeja', 'Ikeja', 6.6018, 3.3515],
  ['amaryland', 'maryland', 'Maryland', 6.5711, 3.3676],
  ['agbagada', 'gbagada', 'Gbagada', 6.5536, 3.3891],
  ['aoshodi', 'oshodi', 'Oshodi', 6.555, 3.343],
  ['alekki', 'lekki', 'Lekki', 6.4698, 3.5852],
  ['aajah', 'ajah', 'Ajah', 6.4667, 3.5833],
  ['aikoyi', 'ikoyi', 'Ikoyi', 6.4549, 3.4246],
  ['avi', 'victoria-island', 'Victoria Island', 6.4281, 3.4219],
  ['afestac', 'festac', 'Festac', 6.465, 3.2833],
  ['aogba', 'ogba', 'Ogba', 6.629, 3.341],
];

/** Markets people already navigate by. Centre points are approximate; check before launch. */
const MARKET_SEEDS: [
  key: string,
  slug: string,
  name: string,
  description: string,
  lat: number,
  lng: number,
][] = [
  ['myaba', 'yaba-market', 'Yaba Market', 'Food and household goods', 6.5154, 3.377],
  ['mtejuosho', 'tejuosho-market', 'Tejuosho Market', 'Clothes, phones and food', 6.5085, 3.3683],
  ['mcomputer', 'computer-village', 'Computer Village', 'Phones and laptops', 6.5965, 3.342],
  ['mbalogun', 'balogun-market', 'Balogun Market', 'Fabrics and fashion', 6.4548, 3.3895],
  ['malaba', 'alaba-market', 'Alaba International Market', 'Electronics', 6.4593, 3.1877],
  ['mmile12', 'mile-12-market', 'Mile 12 Market', 'Food, wholesale', 6.605, 3.401],
];

const place = { city: 'Lagos', state: 'Lagos' };

export const AREAS = [
  ...AREA_SEEDS.map(([key, slug, name, lat, lng]) => ({
    id: fixedId(key),
    slug,
    kind: 'area' as const,
    name,
    description: null,
    ...place,
    lat,
    lng,
  })),
  ...MARKET_SEEDS.map(([key, slug, name, description, lat, lng]) => ({
    id: fixedId(key),
    slug,
    kind: 'market' as const,
    name,
    description,
    ...place,
    lat,
    lng,
  })),
];

/** Inserts or refreshes categories and areas. Safe to run on every deploy. */
export async function seedReferenceData(db: DbExecutor): Promise<void> {
  await db
    .insert(categories)
    .values(CATEGORIES)
    .onDuplicateKeyUpdate({
      set: { name: sql.raw('values(`name`)'), position: sql.raw('values(`position`)') },
    });
  await db
    .insert(areas)
    .values(AREAS)
    .onDuplicateKeyUpdate({
      set: { name: sql.raw('values(`name`)'), description: sql.raw('values(`description`)') },
    });
}
