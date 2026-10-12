/** Native keeps the chosen area for the session only, for now. */
let saved: string | null = null;

export const loadSavedArea = (): string | null => saved;
export const saveArea = (slug: string): void => {
  saved = slug;
};
