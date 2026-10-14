import { idSchema, leadChannelSchema } from '@klozbuy/contracts';
import { startLead, startOfferLead } from '@klozbuy/domain/leads';
import { Hono, type Context } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../app-env';
import { CACHE } from '../cache';
import { sendError } from '../errors';
import { withActor } from '../middleware/actor';
import { validate } from '../validation';
import type { DomainResult } from '@klozbuy/domain';

const goParams = z.object({ channel: leadChannelSchema, listingId: idSchema });
/** How far the buyer was, in km, when the app knew. */
const goQuery = z.object({ d: z.coerce.number().min(0).max(100).optional() });

function redirectTo(c: Context, result: DomainResult<string>) {
  if (!result.ok) return sendError(c, result.error);
  c.header('Cache-Control', CACHE.never);
  return c.redirect(result.value, 302);
}

/**
 * /go/whatsapp/:listingId (and /call, /directions): records the lead, then redirects.
 * The seller's number only ever appears in this redirect, never in a page or API body.
 */
export const goRoutes = new Hono<AppEnv>()
  .use(withActor)
  .get('/offer/:id', validate('param', z.object({ id: idSchema })), async (c) =>
    redirectTo(c, await startOfferLead(c.var.ctx, c.req.valid('param').id)),
  )
  .get(
    '/:channel/:listingId',
    validate('param', goParams),
    validate('query', goQuery),
    async (c) => {
      const { channel, listingId } = c.req.valid('param');
      const options = { siteUrl: c.var.config.siteUrl, distanceKm: c.req.valid('query').d };
      return redirectTo(c, await startLead(c.var.ctx, listingId, channel, options));
    },
  );
