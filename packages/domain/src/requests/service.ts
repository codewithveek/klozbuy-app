import type {
  CreateRequestInput,
  NearbyRequestsQuery,
  RequestDetail,
  RequestSummary,
} from '@klozbuy/contracts';
import { createId, err, ok } from '@klozbuy/shared';
import { cellsForPoint, haversineKm, searchArea, type Point } from '@klozbuy/shared/geo';
import type { Ctx } from '../context';
import { forbidden, notFound, requireActor, type DomainResult } from '../errors';
import { getShopSnapshot, requireShopOwner } from '../shops';
import { toOffer, toRequestSummary } from './mappers';
import * as repo from './repository';

/** Requests stay open for a week; buyers rarely still need something after that. */
const REQUEST_TTL_MS = 7 * 24 * 60 * 60 * 1000;
/** How far a shop sees requests from. */
const SHOP_REACH_KM = 5;

export async function createRequest(
  ctx: Ctx,
  input: CreateRequestInput,
): Promise<DomainResult<RequestDetail>> {
  const actor = requireActor(ctx);
  if (!actor.ok) return actor;
  const id = createId();
  await repo.insertRequest(ctx.db, {
    id,
    buyerId: actor.value.userId,
    text: input.text,
    categoryId: input.categoryId ?? null,
    budgetNgn: input.budgetNgn ?? null,
    lat: input.lat,
    lng: input.lng,
    h3r7: cellsForPoint(input).h3r7,
    expiresAt: new Date(ctx.clock.now().getTime() + REQUEST_TTL_MS),
  });
  return getRequest(ctx, id);
}

/** Open requests within the radius, closest first, each with its distance from the point. */
async function requestsAround(ctx: Ctx, point: Point, radiusKm: number) {
  // Requests are stored by r7 cell only, so search at r7 even for small radii.
  const { cells } = searchArea(point, Math.max(radiusKm, 2));
  const rows = await repo.findOpenRequests(ctx.db, cells, ctx.clock.now());
  return rows
    .map((row) => ({ row, distanceKm: haversineKm(point, row) }))
    .filter((item) => item.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/** "Asked near you": what buyers around the point are looking for. */
export async function listNearbyRequests(
  ctx: Ctx,
  query: NearbyRequestsQuery,
): Promise<RequestSummary[]> {
  const nearby = await requestsAround(ctx, query, query.radiusKm);
  const counts = await repo.countOffers(
    ctx.db,
    nearby.map(({ row }) => row.id),
  );
  const now = ctx.clock.now();
  return nearby.map(({ row, distanceKm }) =>
    toRequestSummary(row, now, { offerCount: counts.get(row.id) ?? 0, distanceKm, offered: false }),
  );
}

export async function listMyRequests(ctx: Ctx): Promise<DomainResult<RequestSummary[]>> {
  const actor = requireActor(ctx);
  if (!actor.ok) return actor;
  const rows = await repo.findBuyerRequests(ctx.db, actor.value.userId);
  const counts = await repo.countOffers(
    ctx.db,
    rows.map((row) => row.id),
  );
  const now = ctx.clock.now();
  return ok(
    rows.map((row) =>
      toRequestSummary(row, now, {
        offerCount: counts.get(row.id) ?? 0,
        distanceKm: null,
        offered: false,
      }),
    ),
  );
}

/** A request page. Anyone can read the request; only the buyer who posted it sees the offers. */
export async function getRequest(ctx: Ctx, id: string): Promise<DomainResult<RequestDetail>> {
  const row = await repo.findRequestById(ctx.db, id);
  if (!row || row.status === 'removed') return err(notFound('REQUEST_NOT_FOUND', 'That request'));
  const mine = ctx.actor?.userId === row.buyerId;
  const offerRows = await repo.findOffers(ctx.db, id);
  const offers = mine ? await Promise.all(offerRows.map((offer) => toOffer(ctx.db, offer))) : [];
  const summary = toRequestSummary(row, ctx.clock.now(), {
    offerCount: offerRows.length,
    distanceKm: null,
    offered: false,
  });
  return ok({ ...summary, mine, offers: offers.filter((offer) => offer !== null) });
}

/** The buyer found what they needed; the request leaves sellers' lists. */
export async function closeRequest(ctx: Ctx, id: string): Promise<DomainResult<RequestDetail>> {
  const actor = requireActor(ctx);
  if (!actor.ok) return actor;
  const row = await repo.findRequestById(ctx.db, id);
  if (!row || row.status === 'removed') return err(notFound('REQUEST_NOT_FOUND', 'That request'));
  if (row.buyerId !== actor.value.userId) return err(forbidden('Only the buyer can close this'));
  await repo.setRequestStatus(ctx.db, id, 'closed');
  return getRequest(ctx, id);
}

/** Open requests near one of the seller's shops, marking the ones it already answered. */
export async function requestsForShop(
  ctx: Ctx,
  shopId: string,
): Promise<DomainResult<RequestSummary[]>> {
  const owner = await requireShopOwner(ctx, shopId);
  if (!owner.ok) return owner;
  const location = (await getShopSnapshot(ctx.db, shopId))?.location;
  if (!location) return ok([]);
  const nearby = (await requestsAround(ctx, location, SHOP_REACH_KM)).filter(
    ({ row }) => row.buyerId !== owner.value.ownerId,
  );
  const ids = nearby.map(({ row }) => row.id);
  const [counts, offered] = await Promise.all([
    repo.countOffers(ctx.db, ids),
    repo.offeredBy(ctx.db, shopId, ids),
  ]);
  const now = ctx.clock.now();
  return ok(
    nearby.map(({ row, distanceKm }) =>
      toRequestSummary(row, now, {
        offerCount: counts.get(row.id) ?? 0,
        distanceKm,
        offered: offered.has(row.id),
      }),
    ),
  );
}
