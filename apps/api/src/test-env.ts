import type { Env } from './env';

/** A rate limiter binding that allows or refuses every call. */
export const limiter = (success: boolean): RateLimit => ({ limit: async () => ({ success }) });

/** Valid development bindings; tests override what they need. */
export function testEnv(overrides: Partial<Env> = {}): Env {
  return {
    ENVIRONMENT: 'development',
    API_URL: 'http://localhost:8787',
    SITE_URL: 'http://localhost:8081',
    TRUSTED_ORIGINS: 'http://localhost:8081, klozbuy://',
    OTP_SENDER: 'console',
    DATABASE_URL: 'mysql://user:password@127.0.0.1:4000/klozbuy_test',
    BETTER_AUTH_SECRET: 'test-secret-that-is-at-least-32-characters',
    AUTH_IP_LIMITER: limiter(true),
    OTP_PHONE_LIMITER: limiter(true),
    ...overrides,
  };
}
