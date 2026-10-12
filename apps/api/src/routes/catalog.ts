import {
  createListingInputSchema,
  setListingStatusInputSchema,
  updateListingInputSchema,
} from '@klozbuy/contracts';
import {
  confirmStock,
  createListing,
  getListingPage,
  listCategories,
  setListingStatus,
  updateListing,
} from '@klozbuy/domain/catalog';
import { Hono } from 'hono';
import type { AppEnv } from '../app-env';
import { CACHE, cacheFor } from '../cache';
import { sendResult } from '../errors';
import { withActor } from '../middleware/actor';
import { idParam, slugParam } from '../params';
import { validate } from '../validation';

export const categoryRoutes = new Hono<AppEnv>()
  .use(withActor)
  .get('/', cacheFor(CACHE.reference), async (c) => sendResult(c, await listCategories(c.var.ctx)));

export const listingRoutes = new Hono<AppEnv>()
  .use(withActor)
  .get('/:slug', cacheFor(CACHE.page), validate('param', slugParam), async (c) =>
    sendResult(c, await getListingPage(c.var.ctx, c.req.valid('param').slug)),
  )
  .post('/', validate('json', createListingInputSchema), async (c) =>
    sendResult(c, await createListing(c.var.ctx, c.req.valid('json'))),
  )
  .patch(
    '/:id',
    validate('param', idParam),
    validate('json', updateListingInputSchema),
    async (c) =>
      sendResult(c, await updateListing(c.var.ctx, c.req.valid('param').id, c.req.valid('json'))),
  )
  .post(
    '/:id/status',
    validate('param', idParam),
    validate('json', setListingStatusInputSchema),
    async (c) =>
      sendResult(
        c,
        await setListingStatus(c.var.ctx, c.req.valid('param').id, c.req.valid('json')),
      ),
  )
  .post('/:id/confirm-stock', validate('param', idParam), async (c) =>
    sendResult(c, await confirmStock(c.var.ctx, c.req.valid('param').id)),
  );
