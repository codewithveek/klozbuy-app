import { updateProfileInputSchema } from '@klozbuy/contracts';
import { getMe, recordConsent, updateProfile } from '@klozbuy/domain/identity';
import { listMyChats } from '@klozbuy/domain/leads';
import { listMyRequests } from '@klozbuy/domain/requests';
import { Hono } from 'hono';
import type { AppEnv } from '../app-env';
import { sendResult } from '../errors';
import { withActor } from '../middleware/actor';
import { validate } from '../validation';

/** The signed-in user's own profile. */
export const meRoutes = new Hono<AppEnv>()
  .use(withActor)
  .get('/', async (c) => sendResult(c, await getMe(c.var.ctx)))
  .patch('/', validate('json', updateProfileInputSchema), async (c) =>
    sendResult(c, await updateProfile(c.var.ctx, c.req.valid('json'))),
  )
  .post('/consent', async (c) => sendResult(c, await recordConsent(c.var.ctx)))
  .get('/chats', async (c) => sendResult(c, await listMyChats(c.var.ctx)))
  .get('/requests', async (c) => sendResult(c, await listMyRequests(c.var.ctx)));
