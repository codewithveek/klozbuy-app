import { errorResponseSchema } from '@klozbuy/contracts';
import { describe, expect, it } from 'vitest';
import { createApp } from './app';
import { limiter, testEnv } from './test-env';

const app = createApp();

async function errorOf(response: Response) {
  return errorResponseSchema.parse(await response.json()).error;
}

describe('API worker', () => {
  it('reports health with a request ID', async () => {
    const response = await app.request('/health', {}, testEnv());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok', environment: 'development' });
    expect(response.headers.get('X-Request-Id')).toBeTruthy();
  });

  it('answers unknown routes with the error shape', async () => {
    const response = await app.request('/v1/nothing-here', {}, testEnv());
    expect(response.status).toBe(404);
    expect(await errorOf(response)).toMatchObject({ code: 'NOT_FOUND' });
  });

  it('requires a session for /v1/me', async () => {
    const response = await app.request('/v1/me', {}, testEnv());
    expect(response.status).toBe(401);
    expect(await errorOf(response)).toMatchObject({ code: 'UNAUTHENTICATED' });
  });

  it('rejects invalid input with field details', async () => {
    const response = await app.request(
      '/v1/me',
      { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: '{"name":"A"}' },
      testEnv(),
    );
    expect(response.status).toBe(400);
    const error = await errorOf(response);
    expect(error.code).toBe('VALIDATION_FAILED');
    expect(error.details).toMatchObject({ fieldErrors: { name: expect.any(Array) } });
  });

  it('allows the web app origin with credentials', async () => {
    const response = await app.request(
      '/v1/me',
      {
        method: 'OPTIONS',
        headers: { Origin: 'http://localhost:8081', 'Access-Control-Request-Method': 'PATCH' },
      },
      testEnv(),
    );
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:8081');
    expect(response.headers.get('Access-Control-Allow-Credentials')).toBe('true');
  });

  it('rate-limits sign-in codes before reaching Better Auth', async () => {
    const response = await app.request(
      '/v1/auth/phone-number/send-otp',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: '+2348012345678' }),
      },
      testEnv({ OTP_PHONE_LIMITER: limiter(false) }),
    );
    expect(response.status).toBe(429);
    expect(await errorOf(response)).toMatchObject({ code: 'RATE_LIMITED' });
  });

  it('fails closed with INTERNAL when configuration is invalid', async () => {
    const response = await app.request('/health', {}, testEnv({ BETTER_AUTH_SECRET: 'short' }));
    expect(response.status).toBe(500);
    const error = await errorOf(response);
    expect(error.code).toBe('INTERNAL');
    expect(error.message).not.toContain('short');
  });
});

describe('marketplace routes without a database', () => {
  it('validates feed queries', async () => {
    const response = await app.request('/v1/feed/nearby?lat=6.5&radiusKm=2', {}, testEnv());
    expect(response.status).toBe(400);
    expect(await errorOf(response)).toMatchObject({ code: 'VALIDATION_FAILED' });
  });

  it('rejects unknown lead channels', async () => {
    const response = await app.request('/go/telegram/a1B2c3D4e5F6g7H8', {}, testEnv());
    expect(response.status).toBe(400);
  });

  it('needs a session to create a listing', async () => {
    const body = {
      shopId: 'a1B2c3D4e5F6g7H8',
      type: 'product',
      title: 'Kettle',
      priceNgn: 9000,
      categoryId: 'a1B2c3D4e5F6g7H8',
    };
    const response = await app.request(
      '/v1/listings',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
      testEnv(),
    );
    expect(response.status).toBe(401);
  });
});
