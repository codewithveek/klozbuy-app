import { zValidator } from '@hono/zod-validator';
import type { ValidationTargets } from 'hono';
import { z } from 'zod';
import { errorBody } from './errors';

/** Validates one part of the request against a contracts schema, with the API's error shape. */
export function validate<Target extends keyof ValidationTargets, Schema extends z.ZodType>(
  target: Target,
  schema: Schema,
) {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      const details = z.flattenError(result.error);
      return c.json(
        errorBody('VALIDATION_FAILED', 'Some fields are missing or invalid', details),
        400,
      );
    }
  });
}
