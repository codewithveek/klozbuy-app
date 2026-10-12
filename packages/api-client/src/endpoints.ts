import {
  areaListSchema,
  categoryListSchema,
  chatListSchema,
  leadListSchema,
  offerSchema,
  requestDetailSchema,
  requestListSchema,
  shopInsightsSchema,
  feedPageSchema,
  listingDetailSchema,
  listingListSchema,
  listingSchema,
  meSchema,
  myShopSchema,
  shopPublicSchema,
  type CreateListingInput,
  type CreateReportInput,
  type CreateRequestInput,
  type CreateShopWithLocationInput,
  type NearbyFeedQuery,
  type NearbyRequestsQuery,
  type SearchQuery,
  type SendOfferInput,
  type SetListingStatusInput,
  type ShopLocationInput,
  type UpdateListingInput,
  type UpdateShopInput,
  type UpdateProfileInput,
} from '@klozbuy/contracts';
import { z } from 'zod';
import type { Request } from './request';

/** Query string from defined values only. */
function query(values: Record<string, string | number | boolean | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) params.set(key, String(value));
  }
  return params.toString();
}

const slug = (value: string) => encodeURIComponent(value);

export const meEndpoints = (request: Request) => ({
  get: () => request(meSchema, '/v1/me'),
  update: (input: UpdateProfileInput) =>
    request(meSchema, '/v1/me', { method: 'PATCH', body: input }),
  recordConsent: () => request(meSchema, '/v1/me/consent', { method: 'POST' }),
  chats: () => request(chatListSchema, '/v1/me/chats'),
  requests: () => request(requestListSchema, '/v1/me/requests'),
});

export const catalogEndpoints = (request: Request) => ({
  categories: () => request(categoryListSchema, '/v1/categories'),
  listing: (listingSlug: string) =>
    request(listingDetailSchema, `/v1/listings/${slug(listingSlug)}`),
  create: (input: CreateListingInput) =>
    request(listingSchema, '/v1/listings', { method: 'POST', body: input }),
  update: (id: string, input: UpdateListingInput) =>
    request(listingSchema, `/v1/listings/${id}`, { method: 'PATCH', body: input }),
  setStatus: (id: string, input: SetListingStatusInput) =>
    request(listingSchema, `/v1/listings/${id}/status`, { method: 'POST', body: input }),
  confirmStock: (id: string) =>
    request(listingSchema, `/v1/listings/${id}/confirm-stock`, { method: 'POST' }),
  recordView: (id: string) => request(z.null(), `/v1/listings/${id}/views`, { method: 'POST' }),
});

export const shopEndpoints = (request: Request) => ({
  shop: (shopSlug: string) => request(shopPublicSchema, `/v1/shops/${slug(shopSlug)}`),
  listings: (shopSlug: string) =>
    request(listingListSchema, `/v1/shops/${slug(shopSlug)}/listings`),
  create: (input: CreateShopWithLocationInput) =>
    request(myShopSchema, '/v1/shops', { method: 'POST', body: input }),
  update: (id: string, input: UpdateShopInput) =>
    request(myShopSchema, `/v1/shops/${id}`, { method: 'PATCH', body: input }),
  updateLocation: (id: string, input: ShopLocationInput) =>
    request(myShopSchema, `/v1/shops/${id}/location`, { method: 'PUT', body: input }),
  mine: () => request(z.array(myShopSchema), '/v1/me/shops'),
  myShop: (id: string) => request(myShopSchema, `/v1/me/shops/${id}`),
  myListings: (id: string) => request(listingListSchema, `/v1/me/shops/${id}/listings`),
  insights: (id: string, days: 7 | 30) =>
    request(shopInsightsSchema, `/v1/me/shops/${id}/insights?days=${days}`),
  leads: (id: string) => request(leadListSchema, `/v1/me/shops/${id}/leads`),
  requests: (id: string) => request(requestListSchema, `/v1/me/shops/${id}/requests`),
});

export const discoveryEndpoints = (request: Request) => ({
  nearby: (input: NearbyFeedQuery) =>
    request(feedPageSchema, `/v1/feed/nearby?${query({ ...input })}`),
  search: (input: SearchQuery) => request(feedPageSchema, `/v1/search?${query({ ...input })}`),
  areas: () => request(areaListSchema, '/v1/areas'),
});

export const requestEndpoints = (request: Request) => ({
  create: (input: CreateRequestInput) =>
    request(requestDetailSchema, '/v1/requests', { method: 'POST', body: input }),
  nearby: (input: NearbyRequestsQuery) =>
    request(requestListSchema, `/v1/requests/nearby?${query({ ...input })}`),
  get: (id: string) => request(requestDetailSchema, `/v1/requests/${id}`),
  close: (id: string) =>
    request(requestDetailSchema, `/v1/requests/${id}/close`, { method: 'POST' }),
  sendOffer: (id: string, input: SendOfferInput) =>
    request(offerSchema, `/v1/requests/${id}/offers`, { method: 'POST', body: input }),
  report: (input: CreateReportInput) =>
    request(z.object({ id: z.string() }), '/v1/reports', { method: 'POST', body: input }),
});
