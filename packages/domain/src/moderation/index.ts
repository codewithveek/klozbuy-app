import type { CreateReportInput } from '@klozbuy/contracts';
import { reports } from '@klozbuy/db/schema';
import { createId, ok } from '@klozbuy/shared';
import type { Ctx } from '../context';
import type { DomainResult } from '../errors';

/** Anyone can report a listing, shop or request; signed-in reporters are recorded. */
export async function createReport(
  ctx: Ctx,
  input: CreateReportInput,
): Promise<DomainResult<{ id: string }>> {
  const id = createId();
  await ctx.db.insert(reports).values({
    id,
    reporterId: ctx.actor?.userId ?? null,
    targetType: input.targetType,
    targetId: input.targetId,
    reason: input.reason,
    details: input.details ?? null,
  });
  return ok({ id });
}
