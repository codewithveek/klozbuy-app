import { z } from 'zod';
import { idSchema, nairaSchema, pageSchema } from './common';
import { conditionSchema, listingTypeSchema } from './listings';
import { shopSummarySchema } from './shops';

export const FEED_RADII_KM = [1, 3, 5, 10] as const;

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
  cursor: z.string().max(200).optional(),
});
export type NearbyFeedQuery = z.infer<typeof nearbyFeedQuerySchema>;

export const feedItemSchema = z.object({
  listingId: idSchema,
  slug: z.string(),
  type: listingTypeSchema,
  title: z.string(),
  priceNgn: nairaSchema,
  negotiable: z.boolean(),
  condition: conditionSchema.nullable(),
  landmark: z.string(),
  distanceKm: z.number().min(0),
  boosted: z.boolean(),
  shop: shopSummarySchema,
});
export type FeedItem = z.infer<typeof feedItemSchema>;

export const feedPageSchema = pageSchema(feedItemSchema);
export type FeedPage = z.infer<typeof feedPageSchema>;
