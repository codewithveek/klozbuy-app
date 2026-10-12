import { meQueryKey, useApiClient } from '@klozbuy/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { authClient } from './auth-client';

type AuthError = { status?: number; message?: string } | null | undefined;

/** Plain-English messages for what can go wrong while signing in. */
function messageFor(error: AuthError, fallback: string): string {
  if (error?.status === 429) return 'Too many attempts. Wait a minute and try again.';
  return fallback;
}

/** Runs one async step and tracks its pending state and error message. */
function useStep<Args extends unknown[]>(run: (...args: Args) => Promise<string | null>) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | undefined>();
  async function start(...args: Args): Promise<boolean> {
    setPending(true);
    setError(undefined);
    const failure = await run(...args).catch(
      () => 'Something went wrong. Check your connection and try again.',
    );
    setPending(false);
    if (failure) setError(failure);
    return failure === null;
  }
  return { start, pending, error, setError };
}

export function useSendCode() {
  return useStep(async (phoneNumber: string) => {
    const result = await authClient.phoneNumber.sendOtp({ phoneNumber });
    return result.error
      ? messageFor(result.error, "We couldn't send the code. Check the number and try again.")
      : null;
  });
}

/** Verifies the code, records consent (given by continuing) and loads the profile. */
export function useVerifyCode() {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useStep(async (phoneNumber: string, code: string) => {
    const result = await authClient.phoneNumber.verify({ phoneNumber, code });
    if (result.error)
      return messageFor(result.error, 'That code is wrong or has expired. Check it and try again.');
    queryClient.setQueryData(meQueryKey, await api.me.recordConsent());
    return null;
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return async () => {
    await authClient.signOut();
    queryClient.setQueryData(meQueryKey, null);
  };
}
