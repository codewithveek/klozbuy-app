import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readStored, writeStored } from '../../lib/device-store';

/** What a saved card needs to show without asking the server. */
export interface SavedListing {
  slug: string;
  title: string;
  priceNgn: number;
  shopName: string;
}

export interface SavedShop {
  slug: string;
  name: string;
}

interface Saved {
  listings: SavedListing[];
  shops: SavedShop[];
}

interface SavedContextValue extends Saved {
  isListingSaved: (slug: string) => boolean;
  isShopSaved: (slug: string) => boolean;
  toggleListing: (listing: SavedListing) => void;
  toggleShop: (shop: SavedShop) => void;
}

const KEY = 'klozbuy.saved';
const EMPTY: Saved = { listings: [], shops: [] };
const SavedContext = createContext<SavedContextValue | null>(null);

function toggle<T extends { slug: string }>(items: T[], item: T): T[] {
  return items.some((i) => i.slug === item.slug)
    ? items.filter((i) => i.slug !== item.slug)
    : [item, ...items];
}

/** Hearts and "Save shop": kept on this device, no account needed. */
export function SavedProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Saved>(EMPTY);
  // Read after hydration so the server render and the first browser render agree.
  useEffect(() => setSaved(readStored<Saved>(KEY) ?? EMPTY), []);
  const value = useMemo<SavedContextValue>(() => {
    const update = (next: Saved) => {
      writeStored(KEY, next);
      setSaved(next);
    };
    return {
      ...saved,
      isListingSaved: (slug) => saved.listings.some((l) => l.slug === slug),
      isShopSaved: (slug) => saved.shops.some((s) => s.slug === slug),
      toggleListing: (listing) => update({ ...saved, listings: toggle(saved.listings, listing) }),
      toggleShop: (shop) => update({ ...saved, shops: toggle(saved.shops, shop) }),
    };
  }, [saved]);
  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved(): SavedContextValue {
  const value = useContext(SavedContext);
  if (!value) throw new Error('useSaved needs a SavedProvider above it');
  return value;
}
