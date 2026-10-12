import type { CreateListingInput, ShopHours } from '@klozbuy/contracts';

/** Demo shops and listings around Yaba, for local development and screenshots. */
export type DemoListing = Omit<CreateListingInput, 'shopId' | 'categoryId'> & { category: string };
export interface DemoShop {
  name: string;
  category: string;
  phone: string;
  landmark: string;
  description?: string;
  lat: number;
  lng: number;
  verified: boolean;
  hours: ShopHours;
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

const weekdays = (opensAt: string, closesAt: string): ShopHours => ({
  opensAt,
  closesAt,
  openDays: [1, 2, 3, 4, 5, 6],
});
const everyDay = (opensAt: string, closesAt: string): ShopHours => ({
  opensAt,
  closesAt,
  openDays: [1, 2, 3, 4, 5, 6, 7],
});

export const SHOPS: DemoShop[] = [
  {
    name: 'Tunde Gadgets',
    category: 'phones-tablets',
    phone: '+2348031110001',
    landmark: 'Tejuosho Market, Block C, shop 14',
    description: 'Phones, consoles and accessories. Every phone is tested in front of you.',
    lat: 6.5112,
    lng: 3.3725,
    verified: true,
    hours: weekdays('08:00', '19:00'),
    listings: [
      product('iPhone 13, 128 GB, UK used', 520000, 'phones-tablets', {
        negotiable: true,
        condition: 'uk_used',
        description: 'Battery health 89%. Face ID works. Test it in the shop before you pay.',
      }),
      product('PS5 Slim, disc edition', 585000, 'electronics', {
        negotiable: true,
        description: 'Sealed, with one controller. Receipt and 6-month shop warranty.',
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
    hours: weekdays('09:00', '18:00'),
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
    hours: everyDay('07:00', '21:00'),
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
    hours: weekdays('09:00', '19:00'),
    listings: [
      service('iPhone screen replacement', 45000, 'phone-laptop-repair'),
      service('Laptop keyboard repair', 20000, 'phone-laptop-repair'),
      product('HP EliteBook 840 G5, Core i5, 16 GB', 315000, 'computers', {
        negotiable: true,
        condition: 'uk_used',
      }),
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
    hours: weekdays('08:30', '18:30'),
    listings: [
      product('Binatone standing fan, 18 inch', 42000, 'electronics'),
      product('Plastic chairs, set of 4', 26000, 'home-furniture', { negotiable: true }),
      product('Sumec Firman 3.5 kVA generator', 395000, 'electronics', { negotiable: true }),
    ],
  },
  {
    name: 'Emeka Plumbing Works',
    category: 'plumbing',
    phone: '+2348031110006',
    landmark: 'Off Commercial Avenue, by the mosque',
    lat: 6.5151,
    lng: 3.3761,
    verified: true,
    hours: everyDay('07:00', '20:00'),
    listings: [service('Leaking pipe and tap repair', 8000, 'plumbing')],
  },
  {
    name: 'Bright Spark Electricals',
    category: 'electricians',
    phone: '+2348031110007',
    landmark: 'Ojuelegba Road, beside First Bank',
    lat: 6.5021,
    lng: 3.3702,
    verified: true,
    hours: weekdays('08:00', '18:00'),
    listings: [service('House wiring and fault finding', 10000, 'electricians')],
  },
];

/** What buyers nearby asked for, so sellers and the feed have requests to show. */
export const REQUESTS = [
  { text: 'PS5 slim under ₦600k', budgetNgn: 600000, lat: 6.5099, lng: 3.3718 },
  { text: 'Tecno Camon 30 charger, original', budgetNgn: 8000, lat: 6.5088, lng: 3.3742 },
  { text: 'Someone to fix my AC today', lat: 6.5064, lng: 3.3733 },
];
