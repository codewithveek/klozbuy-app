import {
  errorResponseSchema,
  meSchema,
  type Me,
  type UpdateProfileInput,
} from '@klozbuy/contracts';
import type { z } from 'zod';
import { ApiError } from './errors';

export interface ApiClientOptions {
  /** e.g. https://api.klozbuy.com */
  baseUrl: string;
  /** Extra headers per request; native apps send the session cookie this way. */
  headers?: () => Record<string, string> | Promise<Record<string, string>>;
  fetch?: typeof fetch;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
}

async function toApiError(response: Response): Promise<ApiError> {
  const parsed = errorResponseSchema.safeParse(await response.json().catch(() => null));
  if (parsed.success) {
    const { code, message, details } = parsed.data.error;
    return new ApiError(code, message, response.status, details);
  }
  return new ApiError('INTERNAL', `Unexpected response (${response.status})`, response.status);
}

/**
 * A typed client for the API. Every response is checked against the shared contracts,
 * so a changed field fails loudly here instead of deep inside a screen.
 */
export function createApiClient({ baseUrl, headers, fetch: fetchImpl = fetch }: ApiClientOptions) {
  async function request<S extends z.ZodType>(
    schema: S,
    path: string,
    options: RequestOptions = {},
  ): Promise<z.output<S>> {
    const response = await fetchImpl(new URL(path, baseUrl), {
      method: options.method ?? 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(options.body === undefined ? null : { 'Content-Type': 'application/json' }),
        ...(await headers?.()),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
    if (!response.ok) throw await toApiError(response);
    const parsed = schema.safeParse(await response.json());
    if (!parsed.success)
      throw new ApiError(
        'INTERNAL',
        `Unexpected response from ${path}`,
        response.status,
        parsed.error.issues,
      );
    return parsed.data;
  }

  return {
    me: {
      get: (): Promise<Me> => request(meSchema, '/v1/me'),
      update: (input: UpdateProfileInput): Promise<Me> =>
        request(meSchema, '/v1/me', { method: 'PATCH', body: input }),
      recordConsent: (): Promise<Me> => request(meSchema, '/v1/me/consent', { method: 'POST' }),
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
