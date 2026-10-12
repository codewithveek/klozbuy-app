import { idSchema } from '@klozbuy/contracts';
import { z } from 'zod';

/** Path parameters, validated like any other input. */
export const idParam = z.object({ id: idSchema });
/** Which period the seller's figures cover. */
export const insightsQuery = z.object({
  days: z
    .enum(['7', '30'])
    .default('7')
    .transform((days) => (days === '30' ? 30 : 7)),
});

export const slugParam = z.object({ slug: z.string().min(1).max(120) });
