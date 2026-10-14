import type {
  CreateReportInput,
  CreateRequestInput,
  NearbyRequestsQuery,
} from '@klozbuy/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { keys } from './hooks';
import { useApiClient } from './provider';

/** "Asked near you". */
export function useNearbyRequests(input: NearbyRequestsQuery, enabled = true) {
  const api = useApiClient();
  return useQuery({
    queryKey: keys.nearbyRequests(input),
    queryFn: () => api.requests.nearby(input),
    enabled,
  });
}

export function useRequest(id: string) {
  const api = useApiClient();
  return useQuery({ queryKey: keys.request(id), queryFn: () => api.requests.get(id) });
}

export function useMyRequests(enabled = true) {
  const api = useApiClient();
  return useQuery({ queryKey: keys.myRequests, queryFn: api.me.requests, enabled });
}

export function useCreateRequest() {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRequestInput) => api.requests.create(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: keys.myRequests });
      await queryClient.invalidateQueries({ queryKey: ['nearby-requests'] });
    },
  });
}

export function useCloseRequest() {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.requests.close(id),
    onSuccess: async (request) => {
      queryClient.setQueryData(keys.request(request.id), request);
      await queryClient.invalidateQueries({ queryKey: keys.myRequests });
    },
  });
}

/** The signed-in buyer's recent WhatsApp, call and directions taps. */
export function useChats(enabled = true) {
  const api = useApiClient();
  return useQuery({ queryKey: keys.chats, queryFn: api.me.chats, enabled });
}

export function useReport() {
  const api = useApiClient();
  return useMutation({ mutationFn: (input: CreateReportInput) => api.requests.report(input) });
}

/** Counts a listing view once per page open; failures don't matter to the buyer. */
export function useRecordView() {
  const api = useApiClient();
  return useMutation({ mutationFn: (listingId: string) => api.catalog.recordView(listingId) });
}
