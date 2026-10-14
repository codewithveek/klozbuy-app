import { StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';
import type { Theme, ThemeName } from './themes';

/**
 * Declares a component's styles once per theme. The returned hook builds them with
 * StyleSheet.create the first time a theme is used and reuses them on every render after.
 */
export function createStyles<T extends StyleSheet.NamedStyles<T>>(factory: (theme: Theme) => T) {
  const cache = new Map<ThemeName, T>();
  return function useStyles(): T {
    const theme = useTheme();
    let styles = cache.get(theme.name);
    if (!styles) {
      styles = StyleSheet.create(factory(theme));
      cache.set(theme.name, styles);
    }
    return styles;
  };
}
