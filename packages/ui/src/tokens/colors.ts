/**
 * Colour tokens, mirroring tokens.json in the Kloz design system.
 * Components use the semantic names only; the palette is for charts and illustrations.
 */

export const palette = {
  green50: '#e4f3e9',
  green100: '#c3e2cd',
  green200: '#a1d1b0',
  green300: '#7fc094',
  green400: '#5daf78',
  green500: '#3b9e5c',
  green600: '#24753a',
  green700: '#1f6131',
  green800: '#194d27',
  green900: '#13391d',
  amber50: '#fff8e1',
  amber500: '#ffc107',
} as const;

const light = {
  /** App and page background, behind every surface. */
  bgCanvas: '#f6f7f6',
  /** Cards, header, sidebar, sheets, inputs. */
  bgSurface: '#ffffff',
  /** Secondary button fill, segmented track, photo placeholders, hovered rows. */
  bgSubtle: '#eef1ee',
  /** Pressed state of bg-subtle and ghost controls. */
  bgPressed: '#e3e7e3',
  /** Selected category chip, toasts, Boosted badge. */
  bgInverse: '#121a15',
  /** Active nav item, Verified and Checked in person chips, tip panels. */
  bgBrandSubtle: '#e4f3e9',
  /** Card outlines and dividers. */
  borderDefault: '#e2e6e2',
  /** Input, outline button and chip edges: 3.1:1 on bg-surface in both themes. */
  borderStrong: '#8a948e',
  /** Headings, body copy, prices. */
  textPrimary: '#121a15',
  /** Metadata, descriptions, addresses. */
  textSecondary: '#4a5550',
  /** Placeholders, timestamps, axis labels. */
  textTertiary: '#66706a',
  /** Text on bg-inverse. */
  textInverse: '#ffffff',
  /** Links, active nav label, Verified text. */
  textBrand: '#1f6131',
  /** Primary button fill (Chat on WhatsApp, Post request, Search). */
  actionPrimary: '#24753a',
  /** Pressed and hovered primary button. */
  actionPrimaryPressed: '#1f6131',
  /** Text and icons on action-primary and danger-solid. */
  onAction: '#ffffff',
  /** Negotiable tag, Low stock chip, Buy safely panel. */
  warningBg: '#fff1cc',
  /** Text and icons on warning-bg (7:1 or more). */
  warningFg: '#6e4a00',
  /** Error field background, Report listing panel. */
  dangerBg: '#fee4e2',
  /** Error text and icons, falling metrics. */
  dangerFg: '#b42318',
  /** Destructive button fill. */
  dangerSolid: '#b42318',
  /** Info notices, service avatars. */
  infoBg: '#e1eefb',
  /** Text and icons on info-bg and bg-surface. */
  infoFg: '#1d5fa7',
  /** 2px keyboard focus ring with a 2px offset. */
  focusRing: '#1d5fa7',
  /** Star glyph beside a rating. */
  ratingStar: '#f2a900',
  /** Backdrop behind sheets and dialogs. */
  scrim: 'rgba(18, 26, 21, 0.5)',
  /** Avatars only: a fourth tint so neighbouring shops look different. */
  roseBg: '#f7e1ea',
  roseFg: '#7a2148',
  /** The "something new" dot on the bell. */
  attention: '#e0571f',
};

export type ColorToken = keyof typeof light;
export type ColorScheme = Record<ColorToken, string>;

const dark: ColorScheme = {
  bgCanvas: '#0f1311',
  bgSurface: '#171c19',
  bgSubtle: '#1f2521',
  bgPressed: '#283029',
  bgInverse: '#ecf1ed',
  bgBrandSubtle: '#183322',
  borderDefault: '#2b332e',
  borderStrong: '#5f6b64',
  textPrimary: '#ecf1ed',
  textSecondary: '#a9b4ad',
  textTertiary: '#85908a',
  textInverse: '#121a15',
  textBrand: '#8fd0a3',
  actionPrimary: '#24753a',
  actionPrimaryPressed: '#1f6131',
  onAction: '#ffffff',
  warningBg: '#3a2e0f',
  warningFg: '#f2c24e',
  dangerBg: '#3d1512',
  dangerFg: '#f97066',
  dangerSolid: '#b42318',
  infoBg: '#132a44',
  infoFg: '#7cb4f2',
  focusRing: '#7cb4f2',
  ratingStar: '#f2c24e',
  scrim: 'rgba(0, 0, 0, 0.6)',
  roseBg: '#3a1726',
  roseFg: '#f2a7c6',
  attention: '#f07a45',
};

export const colors: { light: ColorScheme; dark: ColorScheme } = { light, dark };
