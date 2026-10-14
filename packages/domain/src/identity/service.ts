import type { Me, UpdateProfileInput } from '@klozbuy/contracts';
import { err, ok } from '@klozbuy/shared';
import type { Ctx } from '../context';
import { domainError, requireActor, type DomainResult } from '../errors';
import { findUserProfile, setConsentedAt, updateUserName, type UserProfileRow } from './repository';

function toMe(row: UserProfileRow): Me {
  return {
    id: row.id,
    name: row.name,
    phoneNumber: row.phoneNumber,
    role: row.role,
    consentedAt: row.consentedAt?.toISOString() ?? null,
  };
}

/** The signed-in user's profile. */
export async function getMe(ctx: Ctx): Promise<DomainResult<Me>> {
  const actor = requireActor(ctx);
  if (!actor.ok) return actor;
  const row = await findUserProfile(ctx.db, actor.value.userId);
  // A session for a deleted user is treated as signed out.
  return row ? ok(toMe(row)) : err(domainError('UNAUTHENTICATED', 'Sign in to continue'));
}

export async function updateProfile(
  ctx: Ctx,
  input: UpdateProfileInput,
): Promise<DomainResult<Me>> {
  const actor = requireActor(ctx);
  if (!actor.ok) return actor;
  await updateUserName(ctx.db, actor.value.userId, input.name);
  return getMe(ctx);
}

/** Records agreement to the privacy notice, as Nigeria's Data Protection Act requires. */
export async function recordConsent(ctx: Ctx): Promise<DomainResult<Me>> {
  const actor = requireActor(ctx);
  if (!actor.ok) return actor;
  await setConsentedAt(ctx.db, actor.value.userId, ctx.clock.now());
  return getMe(ctx);
}
