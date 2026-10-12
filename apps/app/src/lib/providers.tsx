import { ApiClientProvider, createApiClient } from '@klozbuy/api-client';
import { ThemeProvider } from '@klozbuy/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { authHeaders } from '../features/identity/auth-client';
import { LocationProvider } from '../features/location/LocationProvider';
import { SavedProvider } from '../features/saved/SavedProvider';
import { API_URL } from './config';

/**
 * App-wide providers. The query client is created per mount, so server renders never share
 * cached data between visitors. Web stays light until dark mode can be chosen before
 * hydration (the server cannot see the visitor's colour scheme).
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } }),
  );
  const [apiClient] = useState(() => createApiClient({ baseUrl: API_URL, headers: authHeaders }));
  return (
    <ThemeProvider scheme={Platform.OS === 'web' ? 'light' : 'system'}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ApiClientProvider client={apiClient}>
            <LocationProvider>
              <SavedProvider>{children}</SavedProvider>
            </LocationProvider>
          </ApiClientProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
