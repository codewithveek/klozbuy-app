import { ID_PATTERN, MAX_NAIRA } from '@klozbuy/shared';
import { z } from 'zod';

export const idSchema = z.string().regex(ID_PATTERN, 'Invalid ID');

export const nairaSchema = z.number().int().min(0).max(MAX_NAIRA);

export const pointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
export type PointInput = z.infer<typeof pointSchema>;

export const timestampSchema = z.iso.datetime();

export const cursorQuerySchema = z.object({
  cursor: z.string().max(200).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export function pageSchema<T extends z.ZodType>(item: T) {
  return z.object({
    items: z.array(item),
    nextCursor: z.string().nullable(),
  });
}
