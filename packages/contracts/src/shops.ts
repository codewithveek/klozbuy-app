import { z } from 'zod';
import { idSchema, pointSchema, timestampSchema } from './common';

export const VERIFICATION_STATUSES = [
  'unverified',
  'visit_booked',
  'verified',
  'rejected',
  'suspended',
] as const;
export const verificationStatusSchema = z.enum(VERIFICATION_STATUSES);
export type VerificationStatus = z.infer<typeof verificationStatusSchema>;

export const VERIFICATION_VISIT_RESULTS = ['passed', 'failed', 'no_show'] as const;
export const verificationVisitResultSchema = z.enum(VERIFICATION_VISIT_RESULTS);

export const shopSummarySchema = z.object({
  id: idSchema,
  slug: z.string(),
  name: z.string(),
  verified: z.boolean(),
  ratingAvg: z.number().min(0).max(5).nullable(),
  ratingCount: z.number().int().min(0),
});
export type ShopSummary = z.infer<typeof shopSummarySchema>;

export const shopSchema = shopSummarySchema.extend({
  categoryId: idSchema,
  description: z.string().nullable(),
  whatsappNumber: z.string(),
  verificationStatus: verificationStatusSchema,
  verifiedAt: timestampSchema.nullable(),
  createdAt: timestampSchema,
});
export type Shop = z.infer<typeof shopSchema>;

/** Nigerian mobile numbers in international form, e.g. +2348012345678. */
export const nigerianPhoneSchema = z.string().regex(/^\+234[789][01]\d{8}$/, 'Use the +234 format');

export const createShopInputSchema = z.object({
  name: z.string().trim().min(2).max(100),
  categoryId: idSchema,
  description: z.string().trim().max(500).optional(),
  whatsappNumber: nigerianPhoneSchema,
});
export type CreateShopInput = z.infer<typeof createShopInputSchema>;

export const shopLocationInputSchema = pointSchema.extend({
  landmark: z.string().trim().min(3).max(150),
  address: z.string().trim().max(255).optional(),
  areaId: idSchema.optional(),
});
export type ShopLocationInput = z.infer<typeof shopLocationInputSchema>;
