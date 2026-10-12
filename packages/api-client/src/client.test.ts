import { describe, expect, it, vi } from 'vitest';
import { createApiClient } from './client';
import { ApiError } from './errors';

const me = {
  id: 'a1B2c3D4e5F6g7H8',
  name: 'Ada',
  phoneNumber: '+2348031234567',
  role: 'buyer',
  consentedAt: null,
};

function clientReturning(response: Response) {
  const fetchMock = vi.fn(async (_url: URL, _init?: RequestInit) => response);
  const client = createApiClient({
    baseUrl: 'https://api.example.test',
    headers: () => ({ Cookie: 'session=abc' }),
    fetch: fetchMock as unknown as typeof fetch,
  });
  return { client, fetchMock };
}

describe('createApiClient', () => {
  it('sends credentials and extra headers, and returns the parsed body', async () => {
    const { client, fetchMock } = clientReturning(Response.json(me));
    await expect(client.me.update({ name: 'Ada' })).resolves.toEqual(me);
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url?.toString()).toBe('https://api.example.test/v1/me');
    expect(init).toMatchObject({ method: 'PATCH', credentials: 'include', body: '{"name":"Ada"}' });
    expect(init?.headers).toMatchObject({
      Cookie: 'session=abc',
      'Content-Type': 'application/json',
    });
  });

  it('turns the error shape into an ApiError with its code', async () => {
    const body = { error: { code: 'UNAUTHENTICATED', message: 'Sign in to continue' } };
    const { client } = clientReturning(Response.json(body, { status: 401 }));
    await expect(client.me.get()).rejects.toMatchObject({ code: 'UNAUTHENTICATED', status: 401 });
  });

  it('rejects responses that do not match the contract', async () => {
    const { client } = clientReturning(Response.json({ ...me, role: 'superuser' }));
    const error = await client.me.get().catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ code: 'INTERNAL' });
  });
});
