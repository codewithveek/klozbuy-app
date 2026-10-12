import { z } from 'zod';
import { idSchema, nairaSchema } from './common';
import { conditionSchema, listingTypeSchema, stockStatusSchema } from './listings';
import { shopHoursSchema, shopSummarySchema } from './shops';

export const FEED_RADII_KM = [1, 3, 5, 10] as const;
export const FEED_SORTS = ['closest', 'price_asc', 'price_desc', 'newest'] as const;
export type FeedSort = (typeof FEED_SORTS)[number];

/** Query string of GET /v1/feed/nearby. Values arrive as strings, so numbers are coerced. */
export const nearbyFeedQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce
    .number()
    .refine((value) => (FEED_RADII_KM as readonly number[]).includes(value), 'Use 1, 3, 5 or 10')
    .default(3),
  categoryId: idSchema.optional(),
  verifiedOnly: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .default(true),
  type: listingTypeSchema.optional(),
  condition: conditionSchema.optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  openNow: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .default(false),
  sort: z.enum(FEED_SORTS).default('closest'),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().max(200).optional(),
});
export type NearbyFeedQuery = z.infer<typeof nearbyFeedQuerySchema>;

/** Text search near a point: the feed query plus the words typed. */
export const searchQuerySchema = nearbyFeedQuerySchema.extend({
  q: z.string().trim().min(2).max(80),
});
export type SearchQuery = z.infer<typeof searchQuerySchema>;

export const feedItemSchema = z.object({
  listingId: idSchema,
  slug: z.string(),
  type: listingTypeSchema,
  title: z.string(),
  summary: z.string().nullable(),
  priceNgn: nairaSchema,
  negotiable: z.boolean(),
  condition: conditionSchema.nullable(),
  categoryId: idSchema,
  stockStatus: stockStatusSchema,
  landmark: z.string(),
  /** Rounded to about 100 m: enough for a map pin. */
  lat: z.number(),
  lng: z.number(),
  distanceKm: z.number().min(0),
  boosted: z.boolean(),
  hours: shopHoursSchema,
  shop: shopSummarySchema,
});
export type FeedItem = z.infer<typeof feedItemSchema>;

export const feedPageSchema = z.object({
  items: z.array(feedItemSchema),
  nextCursor: z.string().nullable(),
  /** Matching listings within the radius, across all pages. */
  total: z.number().int().min(0),
});
export type FeedPage = z.infer<typeof feedPageSchema>;
