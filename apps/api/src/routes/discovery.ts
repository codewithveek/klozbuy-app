import { nearbyFeedQuerySchema, searchQuerySchema } from '@klozbuy/contracts';
import { listAreas, nearbyFeed, searchNearby } from '@klozbuy/domain/discovery';
import { Hono } from 'hono';
import type { AppEnv } from '../app-env';
import { CACHE, cacheFor } from '../cache';
import { sendResult } from '../errors';
import { withActor } from '../middleware/actor';
import { validate } from '../validation';

export const discoveryRoutes = new Hono<AppEnv>()
  .use(withActor)
  .get('/feed/nearby', cacheFor(CACHE.feed), validate('query', nearbyFeedQuerySchema), async (c) =>
    sendResult(c, await nearbyFeed(c.var.ctx, c.req.valid('query'))),
  )
  .get('/search', cacheFor(CACHE.feed), validate('query', searchQuerySchema), async (c) =>
    sendResult(c, await searchNearby(c.var.ctx, c.req.valid('query'))),
  )
  .get('/areas', cacheFor(CACHE.reference), async (c) => sendResult(c, await listAreas(c.var.ctx)));
