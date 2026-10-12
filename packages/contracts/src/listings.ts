import { z } from 'zod';
import { idSchema, nairaSchema, timestampSchema } from './common';
import { shopLocationSchema, shopSummarySchema } from './shops';

export const LISTING_TYPES = ['product', 'service'] as const;
export const CONDITIONS = ['new', 'uk_used', 'used', 'refurbished'] as const;
export const STOCK_STATUSES = ['in_stock', 'low', 'out_of_stock'] as const;
export const LISTING_STATUSES = ['draft', 'active', 'sold', 'hidden', 'removed'] as const;

export const listingTypeSchema = z.enum(LISTING_TYPES);
export const conditionSchema = z.enum(CONDITIONS);
export const stockStatusSchema = z.enum(STOCK_STATUSES);
export const listingStatusSchema = z.enum(LISTING_STATUSES);

export const listingSchema = z.object({
  id: idSchema,
  shopId: idSchema,
  slug: z.string(),
  type: listingTypeSchema,
  title: z.string(),
  description: z.string().nullable(),
  priceNgn: nairaSchema,
  negotiable: z.boolean(),
  condition: conditionSchema.nullable(),
  stockStatus: stockStatusSchema,
  stockConfirmedAt: timestampSchema.nullable(),
  status: listingStatusSchema,
  categoryId: idSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});
export type Listing = z.infer<typeof listingSchema>;

export const createListingInputSchema = z.object({
  shopId: idSchema,
  type: listingTypeSchema,
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(2000).optional(),
  priceNgn: nairaSchema,
  negotiable: z.boolean().default(false),
  condition: conditionSchema.optional(),
  categoryId: idSchema,
});
export type CreateListingInput = z.infer<typeof createListingInputSchema>;

export const updateListingInputSchema = createListingInputSchema
  .omit({ shopId: true, type: true })
  .partial()
  .extend({ stockStatus: stockStatusSchema.optional() });
export type UpdateListingInput = z.infer<typeof updateListingInputSchema>;

/** Status changes a seller can make: mark sold, hide, or put back on sale. */
export const setListingStatusInputSchema = z.object({
  status: z.enum(['active', 'sold', 'hidden']),
});
export type SetListingStatusInput = z.infer<typeof setListingStatusInputSchema>;

/** The public listing page: the listing, its shop and where the shop is. */
export const listingDetailSchema = listingSchema.extend({
  shop: shopSummarySchema.extend({ location: shopLocationSchema.nullable() }),
  category: z.object({ id: idSchema, slug: z.string(), name: z.string() }),
});
export type ListingDetail = z.infer<typeof listingDetailSchema>;

export const listingListSchema = z.array(listingSchema);
