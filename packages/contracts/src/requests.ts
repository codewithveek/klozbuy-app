import { z } from 'zod';
import { idSchema, nairaSchema, timestampSchema } from './common';
import { shopSummarySchema } from './shops';

export const REQUEST_STATUSES = ['open', 'closed', 'expired', 'removed'] as const;
export const requestStatusSchema = z.enum(REQUEST_STATUSES);
export type RequestStatus = z.infer<typeof requestStatusSchema>;

/** "Can't find it? Post a request": sellers nearby reply with offers. */
export const createRequestInputSchema = z.object({
  text: z.string().trim().min(5, 'Say what you need, like "PS5 slim under ₦600k"').max(300),
  categoryId: idSchema.optional(),
  budgetNgn: nairaSchema.optional(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
export type CreateRequestInput = z.infer<typeof createRequestInputSchema>;

export const nearbyRequestsQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().min(1).max(10).default(3),
});
export type NearbyRequestsQuery = z.infer<typeof nearbyRequestsQuerySchema>;

export const requestSummarySchema = z.object({
  id: idSchema,
  text: z.string(),
  categoryId: idSchema.nullable(),
  budgetNgn: nairaSchema.nullable(),
  status: requestStatusSchema,
  offerCount: z.number().int().min(0),
  /** From the reader's point, when one was given. */
  distanceKm: z.number().nullable(),
  /** For sellers: whether their shop already sent an offer. */
  offered: z.boolean(),
  createdAt: timestampSchema,
  expiresAt: timestampSchema,
});
export type RequestSummary = z.infer<typeof requestSummarySchema>;
export const requestListSchema = z.array(requestSummarySchema);

export const offerSchema = z.object({
  id: idSchema,
  priceNgn: nairaSchema,
  message: z.string().nullable(),
  listingSlug: z.string().nullable(),
  shop: shopSummarySchema,
  createdAt: timestampSchema,
});
export type Offer = z.infer<typeof offerSchema>;

/** A request with its offers. Only the buyer who posted it sees the offers. */
export const requestDetailSchema = requestSummarySchema.extend({
  mine: z.boolean(),
  offers: z.array(offerSchema),
});
export type RequestDetail = z.infer<typeof requestDetailSchema>;

export const sendOfferInputSchema = z.object({
  shopId: idSchema,
  priceNgn: nairaSchema,
  message: z.string().trim().max(500).optional(),
  listingId: idSchema.optional(),
});
export type SendOfferInput = z.infer<typeof sendOfferInputSchema>;
