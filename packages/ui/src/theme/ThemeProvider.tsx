import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { themes, type Theme, type ThemeName } from './themes';

const ThemeContext = createContext<Theme>(themes.light);

export interface ThemeProviderProps {
  /** Follow the system setting (default) or force one theme, e.g. from a user preference. */
  scheme?: ThemeName | 'system';
  children: ReactNode;
}

export function ThemeProvider({ scheme = 'system', children }: ThemeProviderProps) {
  const system = useColorScheme();
  const name: ThemeName = scheme === 'system' ? (system === 'dark' ? 'dark' : 'light') : scheme;
  return <ThemeContext.Provider value={themes[name]}>{children}</ThemeContext.Provider>;
}

/** The token object for the active theme. */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}
