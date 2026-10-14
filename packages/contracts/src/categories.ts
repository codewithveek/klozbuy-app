import { z } from 'zod';
import { idSchema } from './common';
import { listingTypeSchema } from './listings';

export const categorySchema = z.object({
  id: idSchema,
  parentId: idSchema.nullable(),
  slug: z.string(),
  name: z.string(),
  type: listingTypeSchema,
});
export type Category = z.infer<typeof categorySchema>;

export const categoryListSchema = z.array(categorySchema);
