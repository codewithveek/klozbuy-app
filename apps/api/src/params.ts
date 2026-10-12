import { idSchema } from '@klozbuy/contracts';
import { z } from 'zod';

/** Path parameters, validated like any other input. */
export const idParam = z.object({ id: idSchema });
export const slugParam = z.object({ slug: z.string().min(1).max(120) });
