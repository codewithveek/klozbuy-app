import { createId, slugify } from '@klozbuy/shared';

const MAX_ATTEMPTS = 4;

/** A short lowercase suffix that keeps slugs readable: "tunde-gadgets-k3x9q". */
const suffix = () => createId().slice(0, 5).toLowerCase();

/**
 * A URL slug from a name that no other row uses. The plain slug is tried first unless
 * `alwaysSuffix` is set (listing titles repeat too often for plain slugs to be useful).
 */
export async function uniqueSlug(
  text: string,
  isTaken: (slug: string) => Promise<boolean>,
  { alwaysSuffix = false } = {},
): Promise<string> {
  const base = slugify(text, 60) || 'item';
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const slug = attempt === 0 && !alwaysSuffix ? base : `${base}-${suffix()}`;
    if (!(await isTaken(slug))) return slug;
  }
  return `${base}-${createId().toLowerCase()}`;
}
