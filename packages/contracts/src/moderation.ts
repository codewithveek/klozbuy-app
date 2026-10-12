import { z } from 'zod';

export const REPORT_TARGETS = ['listing', 'shop', 'review', 'request'] as const;
export const reportTargetSchema = z.enum(REPORT_TARGETS);
export type ReportTarget = z.infer<typeof reportTargetSchema>;

export const REPORT_REASONS = [
  'scam',
  'prohibited_item',
  'wrong_price',
  'offensive',
  'other',
] as const;
export const reportReasonSchema = z.enum(REPORT_REASONS);
export type ReportReason = z.infer<typeof reportReasonSchema>;

export const REPORT_STATUSES = ['open', 'actioned', 'dismissed'] as const;
export const reportStatusSchema = z.enum(REPORT_STATUSES);
export type ReportStatus = z.infer<typeof reportStatusSchema>;
