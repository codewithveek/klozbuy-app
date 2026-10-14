import type { SendOfferInput, UpdateShopInput } from '@klozbuy/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { keys } from './hooks';
import { useApiClient } from './provider';

/** The seller dashboard's figures for the last 7 or 30 days. */
export function useShopInsights(shopId: string, days: 7 | 30) {
  const api = useApiClient();
  return useQuery({
    queryKey: keys.insights(shopId, days),
    queryFn: () => api.shops.insights(shopId, days),
  });
}

export function useShopLeads(shopId: string) {
  const api = useApiClient();
  return useQuery({ queryKey: keys.shopLeads(shopId), queryFn: () => api.shops.leads(shopId) });
}

/** Buyer requests near the shop. */
export function useShopRequests(shopId: string) {
  const api = useApiClient();
  return useQuery({
    queryKey: keys.shopRequests(shopId),
    queryFn: () => api.shops.requests(shopId),
  });
}

export function useUpdateShop(shopId: string) {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateShopInput) => api.shops.update(shopId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: keys.myShop(shopId) });
      await queryClient.invalidateQueries({ queryKey: keys.myShops });
    },
  });
}

export function useSendOffer(shopId: string) {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, ...input }: { requestId: string } & Omit<SendOfferInput, 'shopId'>) =>
      api.requests.sendOffer(requestId, { ...input, shopId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.shopRequests(shopId) }),
  });
}
