import { idSchema, leadChannelSchema } from '@klozbuy/contracts';
import { startLead } from '@klozbuy/domain/leads';
import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../app-env';
import { CACHE } from '../cache';
import { sendError } from '../errors';
import { withActor } from '../middleware/actor';
import { validate } from '../validation';

const goParams = z.object({ channel: leadChannelSchema, listingId: idSchema });

/**
 * /go/whatsapp/:listingId (and /call, /directions): records the lead, then redirects.
 * The seller's number only ever appears in this redirect, never in a page or API body.
 */
export const goRoutes = new Hono<AppEnv>()
  .use(withActor)
  .get('/:channel/:listingId', validate('param', goParams), async (c) => {
    const { channel, listingId } = c.req.valid('param');
    const result = await startLead(c.var.ctx, listingId, channel);
    if (!result.ok) return sendError(c, result.error);
    c.header('Cache-Control', CACHE.never);
    return c.redirect(result.value, 302);
  });
