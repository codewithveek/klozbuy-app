import type { ViewStyle } from 'react-native';
import { breakpoint, spacing } from '../tokens';

/**
 * Layout that changes with the screen width. The web server renders before it knows the
 * width, so on web each rule is a data attribute styled by RESPONSIVE_CSS media queries
 * (the page is right at first paint and hydration matches). Native apps know their width
 * and apply the same rule as a style.
 *
 * - show-from-md / show-below-md (and lg, xl): render only from, or only below, a width.
 * - stack-md / stack-lg: a row that becomes a column below the width. Children drop any max
 *   width and flex basis there, so they fill the width and take their own height.
 * - card-md, card-media-md, card-body-md: a media card. From md the photo sits on top at
 *   full width (4:3) and the body is padded; below md the card is a padded row with a
 *   100 px thumbnail beside an unpadded body (the phone feed).
 * - gutter: the page's side padding, 16 on phones and 32 from md.
 */
export const RESPONSIVE_RULES = [
  'show-from-md',
  'show-from-lg',
  'show-from-xl',
  'show-below-md',
  'show-below-lg',
  'show-below-xl',
  'stack-md',
  'stack-lg',
  'card-md',
  'card-media-md',
  'card-body-md',
  'gutter',
] as const;
export type ResponsiveRule = (typeof RESPONSIVE_RULES)[number];
export type Breakpoint = keyof typeof breakpoint;

const below = (bp: Breakpoint) => `@media (max-width: ${breakpoint[bp] - 0.02}px)`;
const from = (bp: Breakpoint) => `@media (min-width: ${breakpoint[bp]}px)`;
const rule = (name: ResponsiveRule, css: string) => `[data-k~="${name}"]{${css}}`;

const BREAKPOINTS: Breakpoint[] = ['md', 'lg', 'xl'];

/** Global CSS for the rules; the web app puts it in the document head. */
export const RESPONSIVE_CSS = [
  ...BREAKPOINTS.map(
    (bp) =>
      `${below(bp)}{${rule(`show-from-${bp}` as ResponsiveRule, 'display:none!important')}}` +
      `${from(bp)}{${rule(`show-below-${bp}` as ResponsiveRule, 'display:none!important')}}`,
  ),
  `${below('md')}{${rule('stack-md', 'flex-direction:column!important;align-items:stretch!important')}[data-k~="stack-md"]>*{max-width:none!important;flex-basis:auto!important}}`,
  `${below('lg')}{${rule('stack-lg', 'flex-direction:column!important;align-items:stretch!important')}[data-k~="stack-lg"]>*{max-width:none!important;flex-basis:auto!important}}`,
  `${from('md')}{${rule('card-md', 'flex-direction:column!important')}}`,
  `${below('md')}{${rule('card-md', 'flex-direction:row!important;padding:10px!important;gap:12px!important')}}`,
  `${below('md')}{${rule('card-media-md', 'width:100px!important;height:100px!important;flex:none!important;border-radius:10px!important')}}`,
  `${from('md')}{${rule('card-media-md', 'width:100%!important;aspect-ratio:4/3')}}`,
  `${from('md')}{${rule('card-body-md', 'padding:14px 16px 16px!important')}}`,
  rule('gutter', `padding-left:${spacing[4]}px!important;padding-right:${spacing[4]}px!important`),
  `${from('md')}{${rule('gutter', `padding-left:${spacing[8]}px!important;padding-right:${spacing[8]}px!important`)}}`,
].join('\n');

const column: ViewStyle = { flexDirection: 'column', alignItems: 'stretch' };

/** Styles for the non-show rules, at narrow and at wide widths. */
const NATIVE_STYLES: Partial<
  Record<ResponsiveRule, (wide: (bp: Breakpoint) => boolean) => ViewStyle>
> = {
  'stack-md': (wide) => (wide('md') ? {} : column),
  'stack-lg': (wide) => (wide('lg') ? {} : column),
  'card-md': (wide) =>
    wide('md') ? { flexDirection: 'column' } : { flexDirection: 'row', padding: 10, gap: 12 },
  'card-media-md': (wide) =>
    wide('md')
      ? { width: '100%', aspectRatio: 4 / 3 }
      : { width: 100, height: 100, borderRadius: 10 },
  'card-body-md': (wide) =>
    wide('md') ? { paddingTop: 14, paddingHorizontal: 16, paddingBottom: 16 } : {},
  gutter: (wide) => ({ paddingHorizontal: wide('md') ? spacing[8] : spacing[4] }),
};

/** The same rules for native, from the window width. null means "don't render". */
export function nativeRuleStyle(name: ResponsiveRule, width: number): ViewStyle | null {
  const wide = (bp: Breakpoint) => width >= breakpoint[bp];
  const show = /^show-(from|below)-(md|lg|xl)$/.exec(name);
  if (show) return (show[1] === 'from') === wide(show[2] as Breakpoint) ? {} : null;
  return NATIVE_STYLES[name]?.(wide) ?? {};
}
