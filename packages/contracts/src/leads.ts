import { z } from 'zod';
import { idSchema, nairaSchema, timestampSchema } from './common';
import {
  conditionSchema,
  listingStatusSchema,
  listingTypeSchema,
  stockStatusSchema,
} from './listings';
import { shopSummarySchema } from './shops';

export const LEAD_CHANNELS = ['whatsapp', 'call', 'directions'] as const;
export const leadChannelSchema = z.enum(LEAD_CHANNELS);
export type LeadChannel = z.infer<typeof leadChannelSchema>;

export const LEAD_OUTCOMES = ['unknown', 'purchased', 'not_purchased', 'no_reply'] as const;
export const leadOutcomeSchema = z.enum(LEAD_OUTCOMES);
export type LeadOutcome = z.infer<typeof leadOutcomeSchema>;

const counts = z.object({
  views: z.number().int().min(0),
  whatsapp: z.number().int().min(0),
  call: z.number().int().min(0),
  directions: z.number().int().min(0),
});

export const INSIGHT_PERIODS = [7, 30] as const;

/** How buyers found a shop over a period, against the period before. */
export const shopInsightsSchema = z.object({
  days: z.union([z.literal(7), z.literal(30)]),
  from: z.string(),
  to: z.string(),
  totals: counts,
  previous: counts,
  whatsappByDay: z.array(z.object({ day: z.string(), count: z.number().int().min(0) })),
  /** Share of leads by the buyer's distance, when known; null without data. */
  distance: z
    .object({ under1: z.number(), from1to2: z.number(), from2to3: z.number(), over3: z.number() })
    .nullable(),
  listings: z.array(
    z.object({
      listingId: idSchema,
      slug: z.string(),
      title: z.string(),
      type: listingTypeSchema,
      condition: conditionSchema.nullable(),
      priceNgn: nairaSchema,
      stockStatus: stockStatusSchema,
      status: listingStatusSchema,
      views: z.number().int().min(0),
      whatsapp: z.number().int().min(0),
      updatedAt: timestampSchema,
    }),
  ),
});
export type ShopInsights = z.infer<typeof shopInsightsSchema>;

/** One tap on WhatsApp, call or directions, for the seller's leads list. */
export const leadSchema = z.object({
  id: idSchema,
  channel: leadChannelSchema,
  listingTitle: z.string().nullable(),
  distanceKm: z.number().nullable(),
  outcome: leadOutcomeSchema,
  createdAt: timestampSchema,
});
export const leadListSchema = z.array(leadSchema);

/** A buyer's own recent contacts with shops ("Chats"). */
export const chatSchema = z.object({
  id: idSchema,
  channel: leadChannelSchema,
  listing: z
    .object({ id: idSchema, slug: z.string(), title: z.string(), priceNgn: nairaSchema })
    .nullable(),
  shop: shopSummarySchema,
  createdAt: timestampSchema,
});
export const chatListSchema = z.array(chatSchema);
