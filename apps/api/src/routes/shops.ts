import {
  createShopWithLocationInputSchema,
  recordVisitInputSchema,
  shopLocationInputSchema,
} from '@klozbuy/contracts';
import { listMyListings, listShopListings } from '@klozbuy/domain/catalog';
import { shopStats } from '@klozbuy/domain/leads';
import {
  createShop,
  getMyShop,
  getShopPage,
  listMyShops,
  recordVisit,
  updateShopLocation,
} from '@klozbuy/domain/shops';
import { Hono } from 'hono';
import type { AppEnv } from '../app-env';
import { CACHE, cacheFor } from '../cache';
import { sendResult } from '../errors';
import { withActor } from '../middleware/actor';
import { idParam, slugParam } from '../params';
import { validate } from '../validation';

/** Public shop pages and changes to a shop. */
export const shopRoutes = new Hono<AppEnv>()
  .use(withActor)
  .get('/:slug', cacheFor(CACHE.page), validate('param', slugParam), async (c) =>
    sendResult(c, await getShopPage(c.var.ctx, c.req.valid('param').slug)),
  )
  .get('/:slug/listings', cacheFor(CACHE.page), validate('param', slugParam), async (c) => {
    const shop = await getShopPage(c.var.ctx, c.req.valid('param').slug);
    return sendResult(c, shop.ok ? await listShopListings(c.var.ctx, shop.value.id) : shop);
  })
  .post('/', validate('json', createShopWithLocationInputSchema), async (c) =>
    sendResult(c, await createShop(c.var.ctx, c.req.valid('json'))),
  )
  .put(
    '/:id/location',
    validate('param', idParam),
    validate('json', shopLocationInputSchema),
    async (c) =>
      sendResult(
        c,
        await updateShopLocation(c.var.ctx, c.req.valid('param').id, c.req.valid('json')),
      ),
  )
  .post(
    '/:id/visits',
    validate('param', idParam),
    validate('json', recordVisitInputSchema),
    async (c) =>
      sendResult(c, await recordVisit(c.var.ctx, c.req.valid('param').id, c.req.valid('json'))),
  );

/** The signed-in seller's own shops: never cached, they include private fields. */
export const myShopRoutes = new Hono<AppEnv>()
  .use(withActor)
  .get('/', async (c) => sendResult(c, await listMyShops(c.var.ctx)))
  .get('/:id', validate('param', idParam), async (c) =>
    sendResult(c, await getMyShop(c.var.ctx, c.req.valid('param').id)),
  )
  .get('/:id/listings', validate('param', idParam), async (c) =>
    sendResult(c, await listMyListings(c.var.ctx, c.req.valid('param').id)),
  )
  .get('/:id/stats', validate('param', idParam), async (c) =>
    sendResult(c, await shopStats(c.var.ctx, c.req.valid('param').id)),
  );
