import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';
import { useTheme } from './ThemeProvider';
import type { Theme, ThemeName } from './themes';

type AnyStyle = ViewStyle | TextStyle | ImageStyle;
type Groups = Record<string, Record<string, AnyStyle>>;

/** The style type a config produces, so Text gets TextStyle and View gets ViewStyle. */
type StyleOf<G extends Groups, B extends AnyStyle> = B | G[keyof G][keyof G[keyof G]];

export type VariantSelection<G extends Groups> = { [K in keyof G]?: keyof G[K] & string };

export interface VariantConfig<G extends Groups, B extends AnyStyle> {
  base: B;
  variants: G;
  defaults: { [K in keyof G]: keyof G[K] & string };
}

interface Compiled<S> {
  base: S;
  groups: Record<string, Record<string, S>>;
  defaults: Record<string, string>;
  /** Style arrays already built, keyed by the selected values. */
  arrays: Map<string, S[]>;
}

function compile<G extends Groups, B extends AnyStyle>(
  config: VariantConfig<G, B>,
): Compiled<StyleOf<G, B>> {
  const groups: Record<string, Record<string, StyleOf<G, B>>> = {};
  for (const [name, options] of Object.entries(config.variants)) {
    const created: Record<string, AnyStyle> = StyleSheet.create(options);
    // Same objects as in the config, so they keep the config's style type.
    groups[name] = created as Record<string, StyleOf<G, B>>;
  }
  const base = StyleSheet.create({ base: config.base }).base;
  return { base, groups, defaults: config.defaults, arrays: new Map() };
}

function select<S>(compiled: Compiled<S>, selection: Record<string, string | undefined>): S[] {
  const names = Object.keys(compiled.groups);
  const values = names.map((name) => selection[name] ?? compiled.defaults[name] ?? '');
  const key = values.join('|');
  let styles = compiled.arrays.get(key);
  if (!styles) {
    const built = [compiled.base];
    names.forEach((name, index) => {
      const style = compiled.groups[name]?.[values[index] ?? ''];
      if (style) built.push(style);
    });
    compiled.arrays.set(key, built);
    styles = built;
  }
  return styles;
}

/**
 * Maps variant props (variant, size, tone…) to precomputed style arrays, per theme:
 *
 *   const useButtonStyles = createVariants((t) => ({ base, variants: { size: { md, lg } }, defaults: { size: 'md' } }));
 *   const style = useButtonStyles({ size });
 *
 * The same selection always returns the same array, so memoized children don't re-render.
 */
export function createVariants<G extends Groups, B extends AnyStyle>(
  factory: (theme: Theme) => VariantConfig<G, B>,
) {
  const cache = new Map<ThemeName, Compiled<StyleOf<G, B>>>();
  return function useVariants(selection: VariantSelection<G>): StyleOf<G, B>[] {
    const theme = useTheme();
    let compiled = cache.get(theme.name);
    if (!compiled) {
      compiled = compile(factory(theme));
      cache.set(theme.name, compiled);
    }
    return select(compiled, selection as Record<string, string | undefined>);
  };
}
