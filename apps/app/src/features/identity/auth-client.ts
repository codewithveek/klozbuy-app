import { phoneNumberClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { API_URL } from '../../lib/config';

/** Web: the session lives in an HTTP-only cookie the browser sends with each request. */
export const authClient = createAuthClient({
  baseURL: API_URL,
  basePath: '/v1/auth',
  plugins: [phoneNumberClient()],
  fetchOptions: { credentials: 'include' },
});

/** Extra headers for API calls. The browser already sends the cookie. */
export async function authHeaders(): Promise<Record<string, string>> {
  return {};
}
