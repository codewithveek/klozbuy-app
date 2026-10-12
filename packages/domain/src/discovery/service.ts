import type { Area, FeedPage, NearbyFeedQuery, SearchQuery } from '@klozbuy/contracts';
import { ok, searchTerms } from '@klozbuy/shared';
import { searchArea } from '@klozbuy/shared/geo';
import type { Ctx } from '../context';
import type { DomainResult } from '../errors';
import { toArea, toFeedItem } from './mappers';
import { paginate, rankByDistance } from './ranking';
import * as repo from './repository';

/** Listings near the buyer: one indexed query over the H3 cells, then exact distance. */
export async function nearbyFeed(
  ctx: Ctx,
  query: NearbyFeedQuery,
): Promise<DomainResult<FeedPage>> {
  const area = searchArea(query, query.radiusKm);
  const rows = await repo.findCandidates(ctx.db, {
    resolution: area.resolution,
    cells: area.cells,
    categoryId: query.categoryId,
    verifiedOnly: query.verifiedOnly,
  });
  const ranked = rankByDistance(rows, query, query.radiusKm, ctx.clock.now());
  const { page, nextCursor } = paginate(ranked, query.cursor);
  return ok({ items: page.map(toFeedItem), nextCursor });
}

/**
 * Text search near the buyer through the search_terms index. Listings matching more of
 * the words come first, then the nearest.
 */
export async function searchNearby(ctx: Ctx, query: SearchQuery): Promise<DomainResult<FeedPage>> {
  const terms = searchTerms(query.q);
  if (terms.length === 0) return ok({ items: [], nextCursor: null });
  // search_terms stores r7 cells, so search at least the 3 km ring and trim by distance.
  const cells = searchArea(query, Math.max(query.radiusKm, 3)).cells;
  const matches = await repo.findTermMatches(ctx.db, terms, cells);
  const matchCount = new Map(matches.map((m) => [m.listingId, m.matches]));
  const rows = await repo.findSearchRows(ctx.db, [...matchCount.keys()], query);
  const ranked = rankByDistance(rows, query, query.radiusKm, ctx.clock.now()).sort(
    (a, b) => (matchCount.get(b.item.listingId) ?? 0) - (matchCount.get(a.item.listingId) ?? 0),
  );
  const { page, nextCursor } = paginate(ranked, query.cursor);
  return ok({ items: page.map(toFeedItem), nextCursor });
}

export async function listAreas(ctx: Ctx): Promise<DomainResult<Area[]>> {
  const rows = await repo.findAreas(ctx.db);
  return ok(rows.map(toArea).sort((a, b) => a.name.localeCompare(b.name)));
}
