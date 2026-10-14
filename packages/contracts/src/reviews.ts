import { z } from 'zod';

export const REVIEW_STATUSES = ['published', 'hidden', 'removed'] as const;
export const reviewStatusSchema = z.enum(REVIEW_STATUSES);
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;

export const ratingSchema = z.number().int().min(1).max(5);
