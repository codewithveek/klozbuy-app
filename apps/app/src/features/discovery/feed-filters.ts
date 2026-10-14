import type { FeedSort, Listing } from '@klozbuy/contracts';
import { CONDITION_LABELS } from '../../lib/format';

type Condition = NonNullable<Listing['condition']>;

/** Price bands buyers think in; "any" sends no price filter. */
export const PRICE_BANDS = [
  { value: 'any', label: 'Any price', min: undefined, max: undefined },
  { value: 'u20', label: 'Under ₦20,000', min: undefined, max: 20_000 },
  { value: '20-100', label: '₦20,000 to ₦100,000', min: 20_000, max: 100_000 },
  { value: '100-500', label: '₦100,000 to ₦500,000', min: 100_000, max: 500_000 },
  { value: 'o500', label: 'Over ₦500,000', min: 500_000, max: undefined },
] as const;
export type PriceBand = (typeof PRICE_BANDS)[number]['value'];

export const CONDITION_OPTIONS: { value: Condition | 'any'; label: string }[] = [
  { value: 'any', label: 'Any condition' },
  ...(Object.entries(CONDITION_LABELS) as [Condition, string][]).map(([value, label]) => ({
    value,
    label,
  })),
];

export const SORT_OPTIONS: { value: FeedSort; label: string }[] = [
  { value: 'closest', label: 'Closest' },
  { value: 'price_asc', label: 'Lowest price' },
  { value: 'price_desc', label: 'Highest price' },
  { value: 'newest', label: 'Newest' },
];

export interface FeedFilters {
  categoryId?: string;
  price: PriceBand;
  condition: Condition | 'any';
  verifiedOnly: boolean;
  openNow: boolean;
  sort: FeedSort;
}

export const DEFAULT_FILTERS: FeedFilters = {
  price: 'any',
  condition: 'any',
  verifiedOnly: true,
  openNow: false,
  sort: 'closest',
};

/** The filters as API query fields. */
export function filterQuery(filters: FeedFilters) {
  const band = PRICE_BANDS.find((b) => b.value === filters.price) ?? PRICE_BANDS[0];
  return {
    categoryId: filters.categoryId,
    minPrice: band.min,
    maxPrice: band.max,
    condition: filters.condition === 'any' ? undefined : filters.condition,
    verifiedOnly: filters.verifiedOnly,
    openNow: filters.openNow,
    sort: filters.sort,
  };
}

export const labelOf = <V>(options: readonly { value: V; label: string }[], value: V) =>
  options.find((option) => option.value === value)?.label ?? '';
