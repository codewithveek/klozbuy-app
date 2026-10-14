import { AUTH_BASE_PATH } from '@klozbuy/domain/identity';
import { createMiddleware } from 'hono/factory';
import type { AppEnv } from '../app-env';
import { errorBody } from '../errors';

async function readPhoneNumber(request: Request): Promise<string | null> {
  const body: unknown = await request.json().catch(() => null);
  if (typeof body !== 'object' || body === null || !('phoneNumber' in body)) return null;
  return typeof body.phoneNumber === 'string' ? body.phoneNumber : null;
}

/**
 * Limits phone sign-in per IP, and code sends per phone number, so nobody can flood a
 * number with SMS or guess codes. Limits are set on the bindings in wrangler.jsonc.
 */
export const limitPhoneSignIn = createMiddleware<AppEnv>(async (c, next) => {
  if (c.req.method !== 'POST' || !c.req.path.startsWith(`${AUTH_BASE_PATH}/phone-number/`)) {
    return next();
  }
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown';
  const checks = [c.env.AUTH_IP_LIMITER.limit({ key: `ip:${ip}` })];
  if (c.req.path.endsWith('/send-otp')) {
    const phone = await readPhoneNumber(c.req.raw.clone());
    if (phone) checks.push(c.env.OTP_PHONE_LIMITER.limit({ key: `phone:${phone}` }));
  }
  const outcomes = await Promise.all(checks);
  if (outcomes.some((outcome) => !outcome.success)) {
    return c.json(errorBody('RATE_LIMITED', 'Too many attempts. Try again in a minute.'), 429);
  }
  return next();
});
