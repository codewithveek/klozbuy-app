const STOP_WORDS = new Set(['and', 'the', 'for', 'with', 'of', 'in', 'on', 'to', 'a', 'an']);
const MAX_TERMS = 24;

/** Lower case, accents removed (Ọlá → ola), anything else becomes a space. */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Mark}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** URL slug from a title: "iPhone 13, 128 GB" → "iphone-13-128-gb". */
export function slugify(text: string, maxLength = 60): string {
  return normalizeText(text).replace(/\s+/g, '-').slice(0, maxLength).replace(/-+$/, '');
}

/** Unique search terms for the search_terms index. Numbers are kept ("13", "128"). */
export function searchTerms(text: string): string[] {
  const words = normalizeText(text).split(' ');
  const terms = words.filter((word) => word.length > 1 && !STOP_WORDS.has(word));
  return [...new Set(terms)].slice(0, MAX_TERMS);
}
