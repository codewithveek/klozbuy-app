import { z } from 'zod';

export const LEAD_CHANNELS = ['whatsapp', 'call', 'directions'] as const;
export const leadChannelSchema = z.enum(LEAD_CHANNELS);
export type LeadChannel = z.infer<typeof leadChannelSchema>;

export const LEAD_OUTCOMES = ['unknown', 'purchased', 'not_purchased', 'no_reply'] as const;
export const leadOutcomeSchema = z.enum(LEAD_OUTCOMES);
export type LeadOutcome = z.infer<typeof leadOutcomeSchema>;

const channelCounts = z.object({
  whatsapp: z.number().int().min(0),
  call: z.number().int().min(0),
  directions: z.number().int().min(0),
});

/** Leads for one shop over recent days, for the seller dashboard. */
export const shopStatsSchema = z.object({
  totals: channelCounts,
  days: z.array(channelCounts.extend({ day: z.string() })),
});
export type ShopStats = z.infer<typeof shopStatsSchema>;
