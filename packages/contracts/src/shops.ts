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

/** Where a shop is. Public: buyers walk there. */
export const shopLocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  landmark: z.string(),
  address: z.string().nullable(),
  areaId: idSchema.nullable(),
});
export type ShopLocation = z.infer<typeof shopLocationSchema>;

/** A shop's public page. The WhatsApp number is never included; buyers reach it through /go links. */
export const shopPublicSchema = shopSummarySchema.extend({
  categoryId: idSchema,
  description: z.string().nullable(),
  verifiedAt: timestampSchema.nullable(),
  location: shopLocationSchema.nullable(),
  createdAt: timestampSchema,
});
export type ShopPublic = z.infer<typeof shopPublicSchema>;

/** A shop as its owner sees it. */
export const myShopSchema = shopPublicSchema.extend({
  whatsappNumber: z.string(),
  verificationStatus: verificationStatusSchema,
});
export type MyShop = z.infer<typeof myShopSchema>;

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

/** A new shop comes with its location, so it can appear in the near-me feed at once. */
export const createShopWithLocationInputSchema = createShopInputSchema.extend({
  location: shopLocationInputSchema,
});
export type CreateShopWithLocationInput = z.infer<typeof createShopWithLocationInputSchema>;

/** A field agent's verification visit. */
export const recordVisitInputSchema = z.object({
  result: verificationVisitResultSchema,
  notes: z.string().trim().max(1000).optional(),
});
export type RecordVisitInput = z.infer<typeof recordVisitInputSchema>;
