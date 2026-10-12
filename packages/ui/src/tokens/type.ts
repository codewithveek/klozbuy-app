/** Named type styles, mirroring tokens.json. Sizes are in points (px on web). */

export type FontWeight = '400' | '500' | '600' | '700';

export interface TypeStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: FontWeight;
  letterSpacing?: number;
  /** Prices and figures that line up or change use tabular figures. */
  tabular?: boolean;
  uppercase?: boolean;
}

export const typeStyles = {
  display: { fontSize: 32, lineHeight: 40, fontWeight: '700', letterSpacing: -0.4 },
  'title-1': { fontSize: 24, lineHeight: 32, fontWeight: '700', letterSpacing: -0.2 },
  'title-2': { fontSize: 20, lineHeight: 28, fontWeight: '700' },
  'title-3': { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  'body-strong': { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  'body-sm': { fontSize: 13, lineHeight: 20, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  label: { fontSize: 13, lineHeight: 16, fontWeight: '600' },
  overline: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.6,
    uppercase: true,
  },
  price: { fontSize: 18, lineHeight: 24, fontWeight: '700', tabular: true },
  'price-lg': {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.3,
    tabular: true,
  },
  metric: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.3, tabular: true },
} as const satisfies Record<string, TypeStyle>;

export type TextVariant = keyof typeof typeStyles;

/** The one font family. It has the ₦ sign, Yoruba dot-below letters and tabular figures. */
export const FONT_FAMILY = 'Plus Jakarta Sans';

/**
 * Native apps load one static font file per weight (expo-google-fonts names), because
 * Android cannot pick weights from a variable font. The web uses the variable font.
 */
export const NATIVE_FONT_FAMILIES = {
  '400': 'PlusJakartaSans_400Regular',
  '500': 'PlusJakartaSans_500Medium',
  '600': 'PlusJakartaSans_600SemiBold',
  '700': 'PlusJakartaSans_700Bold',
} as const satisfies Record<FontWeight, string>;
