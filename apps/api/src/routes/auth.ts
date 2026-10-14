import { Hono } from 'hono';
import type { AppEnv } from '../app-env';
import { limitPhoneSignIn } from '../middleware/rate-limit';

/** Better Auth serves everything under /v1/auth, including the phone code routes. */
export const authRoutes = new Hono<AppEnv>()
  .use(limitPhoneSignIn)
  .on(['GET', 'POST'], '/*', (c) => c.var.auth().handler(c.req.raw));
