const KEY = 'klozbuy.area';

/** The visitor's chosen area, remembered in this browser. Storage can be blocked, so never throw. */
export function loadSavedArea(): string | null {
  try {
    return globalThis.localStorage?.getItem(KEY) ?? null;
  } catch {
    return null;
  }
}

export function saveArea(slug: string): void {
  try {
    globalThis.localStorage?.setItem(KEY, slug);
  } catch {
    // Remembering is a convenience; the feed works without it.
  }
}
