import type { DbExecutor } from '@klozbuy/db';
import { areas, listingSearch, searchTerms } from '@klozbuy/db/schema';
import { and, count, desc, eq, inArray, type SQL } from 'drizzle-orm';

export type SearchRow = typeof listingSearch.$inferSelect;
export type AreaRow = typeof areas.$inferSelect;
type SearchInsert = typeof listingSearch.$inferInsert;

export async function upsertSearchRow(db: DbExecutor, row: SearchInsert) {
  const { listingId: _id, createdAt: _created, ...changes } = row;
  await db.insert(listingSearch).values(row).onDuplicateKeyUpdate({ set: changes });
}

export async function removeFromIndex(db: DbExecutor, listingId: string) {
  await db.delete(searchTerms).where(eq(searchTerms.listingId, listingId));
  await db.delete(listingSearch).where(eq(listingSearch.listingId, listingId));
}

export async function replaceTerms(
  db: DbExecutor,
  listingId: string,
  h3r7: string,
  terms: string[],
) {
  await db.delete(searchTerms).where(eq(searchTerms.listingId, listingId));
  if (terms.length === 0) return;
  await db.insert(searchTerms).values(terms.map((term) => ({ term, h3r7, listingId })));
}

export interface CandidateFilter {
  resolution: 7 | 8;
  cells: string[];
  categoryId?: string;
  verifiedOnly: boolean;
}

/** Active listings in the cells, filtered; served by the (h3, status, category) indexes. */
function candidateWhere(filter: CandidateFilter): SQL | undefined {
  const cellColumn = filter.resolution === 8 ? listingSearch.h3r8 : listingSearch.h3r7;
  return and(
    inArray(cellColumn, filter.cells),
    eq(listingSearch.status, 'active'),
    filter.categoryId ? eq(listingSearch.categoryId, filter.categoryId) : undefined,
    filter.verifiedOnly ? eq(listingSearch.verified, true) : undefined,
  );
}

const MAX_CANDIDATES = 400;

export async function findCandidates(
  db: DbExecutor,
  filter: CandidateFilter,
): Promise<SearchRow[]> {
  return db.select().from(listingSearch).where(candidateWhere(filter)).limit(MAX_CANDIDATES);
}

/** Listings matching any of the words near the cells, with how many words each matched. */
export async function findTermMatches(db: DbExecutor, terms: string[], cells: string[]) {
  const matches = count().as('matches');
  return db
    .select({ listingId: searchTerms.listingId, matches })
    .from(searchTerms)
    .where(and(inArray(searchTerms.term, terms), inArray(searchTerms.h3r7, cells)))
    .groupBy(searchTerms.listingId)
    .orderBy(desc(matches))
    .limit(MAX_CANDIDATES);
}

export async function findSearchRows(
  db: DbExecutor,
  listingIds: string[],
  filter: Omit<CandidateFilter, 'cells' | 'resolution'>,
) {
  if (listingIds.length === 0) return [];
  return db
    .select()
    .from(listingSearch)
    .where(
      and(
        inArray(listingSearch.listingId, listingIds),
        eq(listingSearch.status, 'active'),
        filter.categoryId ? eq(listingSearch.categoryId, filter.categoryId) : undefined,
        filter.verifiedOnly ? eq(listingSearch.verified, true) : undefined,
      ),
    );
}

export async function findAreas(db: DbExecutor): Promise<AreaRow[]> {
  return db.select().from(areas);
}
