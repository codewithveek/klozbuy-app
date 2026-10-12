import type { Context, MiddlewareHandler } from 'hono';

/**
 * Cache-Control for public reads. Edge caches may share these between visitors, so only
 * use them on responses that never depend on who is signed in.
 */
export const CACHE = {
  /** Categories and areas change rarely. */
  reference: 'public, max-age=300, stale-while-revalidate=3600',
  /** Listing and shop pages: fresh for a minute, then served stale while refreshing. */
  page: 'public, max-age=60, stale-while-revalidate=600',
  /** The near-me feed and search. */
  feed: 'public, max-age=30',
  never: 'no-store',
} as const;

export function cacheFor(policy: string): MiddlewareHandler {
  return async (c: Context, next) => {
    await next();
    if (c.res.ok) c.header('Cache-Control', policy);
  };
}
