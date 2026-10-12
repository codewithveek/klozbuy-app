import { z } from 'zod';
import { idSchema } from './common';

/** A neighbourhood buyers know by name, used to label locations and for area pages. */
export const areaSchema = z.object({
  id: idSchema,
  slug: z.string(),
  name: z.string(),
  city: z.string(),
  lat: z.number(),
  lng: z.number(),
});
export type Area = z.infer<typeof areaSchema>;

export const areaListSchema = z.array(areaSchema);
