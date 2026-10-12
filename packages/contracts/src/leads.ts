import { z } from 'zod';

export const LEAD_CHANNELS = ['whatsapp', 'call', 'directions'] as const;
export const leadChannelSchema = z.enum(LEAD_CHANNELS);
export type LeadChannel = z.infer<typeof leadChannelSchema>;

export const LEAD_OUTCOMES = ['unknown', 'purchased', 'not_purchased', 'no_reply'] as const;
export const leadOutcomeSchema = z.enum(LEAD_OUTCOMES);
export type LeadOutcome = z.infer<typeof leadOutcomeSchema>;
