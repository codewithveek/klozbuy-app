import { expoClient } from '@better-auth/expo/client';
import { phoneNumberClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../lib/config';

/** Native: the session cookie is kept in the device's secure storage. */
export const authClient = createAuthClient({
  baseURL: API_URL,
  basePath: '/v1/auth',
  plugins: [
    phoneNumberClient(),
    expoClient({ scheme: 'klozbuy', storagePrefix: 'klozbuy', storage: SecureStore }),
  ],
});

/** Native apps have no cookie jar, so API calls carry the session cookie as a header. */
export async function authHeaders(): Promise<Record<string, string>> {
  const cookie = await authClient.getCookie();
  return cookie ? { Cookie: cookie } : {};
}
