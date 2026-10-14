import {
  colors,
  control,
  duration,
  opacity,
  radius,
  spacing,
  stroke,
  typeStyles,
  type ColorScheme,
} from '../tokens';

export type ThemeName = 'light' | 'dark';

/** Everything a component styles itself from. Components never import hex values or raw sizes. */
export interface Theme {
  name: ThemeName;
  colors: ColorScheme;
  spacing: typeof spacing;
  radius: typeof radius;
  control: typeof control;
  stroke: typeof stroke;
  duration: typeof duration;
  opacity: typeof opacity;
  type: typeof typeStyles;
}

const shared = { spacing, radius, control, stroke, duration, opacity, type: typeStyles };

export const themes: Record<ThemeName, Theme> = {
  light: { name: 'light', colors: colors.light, ...shared },
  dark: { name: 'dark', colors: colors.dark, ...shared },
};
