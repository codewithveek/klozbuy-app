import type { FeedPage, NearbyFeedQuery, SearchQuery } from '@klozbuy/contracts';
import { ok, searchTerms } from '@klozbuy/shared';
import { searchArea } from '@klozbuy/shared/geo';
import type { Ctx } from '../context';
import type { DomainResult } from '../errors';
import { toFeedItem } from './mappers';
import { openNow, paginate, rankByDistance, sortRanked, type Ranked } from './ranking';
import * as repo from './repository';

/** Distance filter, open-now filter, sort, then one page: the same steps for feed and search. */
function toPage(
  rows: repo.SearchRow[],
  query: NearbyFeedQuery,
  ctx: Ctx,
  reorder?: (r: Ranked<repo.SearchRow>[]) => Ranked<repo.SearchRow>[],
): FeedPage {
  const now = ctx.clock.now();
  let ranked = rankByDistance(rows, query, query.radiusKm, now);
  if (query.openNow) ranked = openNow(ranked, now);
  ranked = sortRanked(reorder ? reorder(ranked) : ranked, query.sort);
  const { page, nextCursor } = paginate(ranked, query.cursor, query.limit);
  return { items: page.map(toFeedItem), nextCursor, total: ranked.length };
}

/** Listings near the buyer: one indexed query over the H3 cells, then exact distance. */
export async function nearbyFeed(
  ctx: Ctx,
  query: NearbyFeedQuery,
): Promise<DomainResult<FeedPage>> {
  const area = searchArea(query, query.radiusKm);
  const rows = await repo.findCandidates(ctx.db, {
    ...query,
    resolution: area.resolution,
    cells: area.cells,
  });
  return ok(toPage(rows, query, ctx));
}

/**
 * Text search near the buyer through the search_terms index. Listings matching more of
 * the words come first, then the nearest (unless another sort is chosen).
 */
export async function searchNearby(ctx: Ctx, query: SearchQuery): Promise<DomainResult<FeedPage>> {
  const terms = searchTerms(query.q);
  if (terms.length === 0) return ok({ items: [], nextCursor: null, total: 0 });
  // search_terms stores r7 cells, so search at least the 3 km ring and trim by distance.
  const cells = searchArea(query, Math.max(query.radiusKm, 3)).cells;
  const matches = await repo.findTermMatches(ctx.db, terms, cells);
  const matchCount = new Map(matches.map((m) => [m.listingId, m.matches]));
  const rows = await repo.findSearchRows(ctx.db, [...matchCount.keys()], query);
  const byMatches = (ranked: Ranked<repo.SearchRow>[]) =>
    [...ranked].sort(
      (a, b) => (matchCount.get(b.item.listingId) ?? 0) - (matchCount.get(a.item.listingId) ?? 0),
    );
  return ok(toPage(rows, query, ctx, byMatches));
}
