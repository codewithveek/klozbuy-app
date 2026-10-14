/** Spacing, shape and motion tokens, mirroring tokens.json in the Kloz design system. */

/** A 4-point scale: spacing[4] === 16. */
export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;
export type SpaceKey = keyof typeof spacing;

export const radius = { sm: 6, md: 10, lg: 14, xl: 20, full: 999 } as const;
export type RadiusKey = keyof typeof radius;

/** Heights of interactive controls. Nothing tappable is smaller than touchMin. */
export const control = { sm: 36, md: 44, lg: 52, touchMin: 44 } as const;

export const stroke = { hairline: 1, focus: 2, icon: 1.8 } as const;

/** Milliseconds. */
export const duration = { fast: 120, base: 200, slow: 300 } as const;

export const opacity = { disabled: 0.4 } as const;

/** Web layout widths; native phones use the base layout. */
export const breakpoint = { md: 768, lg: 1024, xl: 1280 } as const;
