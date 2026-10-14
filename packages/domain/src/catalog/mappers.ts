import type { Category, Listing } from '@klozbuy/contracts';
import type { CategoryRow, ListingRow } from './repository';

export function toListing(row: ListingRow): Listing {
  return {
    id: row.id,
    shopId: row.shopId,
    slug: row.slug,
    type: row.type,
    title: row.title,
    description: row.description,
    priceNgn: row.priceNgn,
    negotiable: row.negotiable,
    condition: row.condition,
    stockStatus: row.stockStatus,
    stockConfirmedAt: row.stockConfirmedAt?.toISOString() ?? null,
    status: row.status,
    categoryId: row.categoryId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toCategory(row: CategoryRow): Category {
  return { id: row.id, parentId: row.parentId, slug: row.slug, name: row.name, type: row.type };
}
