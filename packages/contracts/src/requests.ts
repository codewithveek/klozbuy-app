import { z } from 'zod';

export const REQUEST_STATUSES = ['open', 'closed', 'expired', 'removed'] as const;
export const requestStatusSchema = z.enum(REQUEST_STATUSES);
export type RequestStatus = z.infer<typeof requestStatusSchema>;
