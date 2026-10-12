import {
  createReportInputSchema,
  createRequestInputSchema,
  nearbyRequestsQuerySchema,
  sendOfferInputSchema,
} from '@klozbuy/contracts';
import { createReport } from '@klozbuy/domain/moderation';
import {
  closeRequest,
  createRequest,
  getRequest,
  listNearbyRequests,
  sendOffer,
} from '@klozbuy/domain/requests';
import { ok } from '@klozbuy/shared';
import { Hono } from 'hono';
import type { AppEnv } from '../app-env';
import { CACHE, cacheFor } from '../cache';
import { sendResult } from '../errors';
import { withActor } from '../middleware/actor';
import { idParam } from '../params';
import { validate } from '../validation';

/** "Post a request": buyers say what they need, nearby shops answer with offers. */
export const requestRoutes = new Hono<AppEnv>()
  .use(withActor)
  .post('/', validate('json', createRequestInputSchema), async (c) =>
    sendResult(c, await createRequest(c.var.ctx, c.req.valid('json'))),
  )
  .get('/nearby', cacheFor(CACHE.feed), validate('query', nearbyRequestsQuerySchema), async (c) =>
    sendResult(c, ok(await listNearbyRequests(c.var.ctx, c.req.valid('query')))),
  )
  // Not cached: the buyer who posted it sees the offers.
  .get('/:id', validate('param', idParam), async (c) =>
    sendResult(c, await getRequest(c.var.ctx, c.req.valid('param').id)),
  )
  .post('/:id/close', validate('param', idParam), async (c) =>
    sendResult(c, await closeRequest(c.var.ctx, c.req.valid('param').id)),
  )
  .post(
    '/:id/offers',
    validate('param', idParam),
    validate('json', sendOfferInputSchema),
    async (c) =>
      sendResult(c, await sendOffer(c.var.ctx, c.req.valid('param').id, c.req.valid('json'))),
  );

/** "Report this listing", and the same for shops and requests. */
export const reportRoutes = new Hono<AppEnv>()
  .use(withActor)
  .post('/', validate('json', createReportInputSchema), async (c) =>
    sendResult(c, await createReport(c.var.ctx, c.req.valid('json'))),
  );
