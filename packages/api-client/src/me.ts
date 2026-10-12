import type { Me, UpdateProfileInput } from '@klozbuy/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from './errors';
import { useApiClient } from './provider';

export const meQueryKey = ['me'] as const;

/** The signed-in user, or null when signed out. */
export function useMe(options: { enabled?: boolean } = {}) {
  const client = useApiClient();
  return useQuery({
    queryKey: meQueryKey,
    enabled: options.enabled,
    queryFn: async (): Promise<Me | null> => {
      try {
        return await client.me.get();
      } catch (error) {
        if (error instanceof ApiError && error.code === 'UNAUTHENTICATED') return null;
        throw error;
      }
    },
  });
}

function useMeMutation<Input>(mutate: (input: Input) => Promise<Me>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutate,
    onSuccess: (me) => queryClient.setQueryData(meQueryKey, me),
  });
}

export function useUpdateProfile() {
  const client = useApiClient();
  return useMeMutation((input: UpdateProfileInput) => client.me.update(input));
}

export function useRecordConsent() {
  const client = useApiClient();
  return useMeMutation(() => client.me.recordConsent());
}
