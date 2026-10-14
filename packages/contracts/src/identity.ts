import { z } from 'zod';
import { idSchema, timestampSchema } from './common';

export const USER_ROLES = ['buyer', 'seller', 'agent', 'admin'] as const;
export const userRoleSchema = z.enum(USER_ROLES);
export type UserRole = z.infer<typeof userRoleSchema>;

/** The signed-in user, as returned by GET /v1/me. */
export const meSchema = z.object({
  id: idSchema,
  name: z.string(),
  phoneNumber: z.string().nullable(),
  role: userRoleSchema,
  consentedAt: timestampSchema.nullable(),
});
export type Me = z.infer<typeof meSchema>;

export const updateProfileInputSchema = z.object({
  name: z.string().trim().min(2).max(60),
});
export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;
