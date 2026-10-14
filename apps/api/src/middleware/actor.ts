import { userRoleSchema } from '@klozbuy/contracts';
import { createEventSink, systemClock, type Actor, type Ctx } from '@klozbuy/domain';
import { isId } from '@klozbuy/shared';
import { createMiddleware } from 'hono/factory';
import type { AppEnv } from '../app-env';

function toActor(user: { id: string; role?: unknown }): Actor | null {
  if (!isId<'User'>(user.id)) return null;
  const role = userRoleSchema.safeParse(user.role);
  return { userId: user.id, role: role.success ? role.data : 'buyer' };
}

/**
 * Loads the session (from the signed cookie cache, or the database every few minutes) and
 * builds the service ctx. Services decide what a signed-out actor may do.
 */
export const withActor = createMiddleware<AppEnv & { Variables: { ctx: Ctx } }>(async (c, next) => {
  const session = await c.var.auth().api.getSession({ headers: c.req.raw.headers });
  c.set('ctx', {
    db: c.var.db,
    clock: systemClock,
    actor: session ? toActor(session.user) : null,
    publish: createEventSink(c.var.db),
  });
  await next();
});
