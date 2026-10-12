import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { createStyles } from '../theme/createStyles';
import type { Theme } from '../theme/themes';
import { radius, spacing, type ColorToken, type RadiusKey, type SpaceKey } from '../tokens';

export type SurfaceKey = 'canvas' | 'surface' | 'subtle' | 'inverse' | 'brand-subtle';
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around';
type Landmark =
  'main' | 'nav' | 'article' | 'section' | 'header' | 'footer' | 'aside' | 'list' | 'listitem';

const SURFACES: Record<SurfaceKey, ColorToken> = {
  canvas: 'bgCanvas',
  surface: 'bgSurface',
  subtle: 'bgSubtle',
  inverse: 'bgInverse',
  'brand-subtle': 'bgBrandSubtle',
};
const ALIGN = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
} as const;
const JUSTIFY = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
} as const;
/** Landmarks become <main>, <nav>, <header>… on web, which crawlers and screen readers use. */
const LANDMARK_ROLES = {
  main: 'main',
  nav: 'navigation',
  article: 'article',
  section: 'region',
  header: 'banner',
  footer: 'contentinfo',
  aside: 'complementary',
  list: 'list',
  listitem: 'listitem',
} as const satisfies Record<Landmark, ViewProps['role']>;

/** One small style per prop value, built once per theme and combined per render. */
function atoms(theme: Theme) {
  const styles: Record<string, ViewStyle> = {
    row: { flexDirection: 'row' },
    wrap: { flexWrap: 'wrap' },
    border: { borderWidth: theme.stroke.hairline, borderColor: theme.colors.borderDefault },
  };
  for (const [key, value] of Object.entries(spacing)) {
    styles[`gap-${key}`] = { gap: value };
    styles[`p-${key}`] = { padding: value };
    styles[`px-${key}`] = { paddingHorizontal: value };
    styles[`py-${key}`] = { paddingVertical: value };
  }
  for (const [key, value] of Object.entries(radius))
    styles[`radius-${key}`] = { borderRadius: value };
  for (const [key, token] of Object.entries(SURFACES))
    styles[`bg-${key}`] = { backgroundColor: theme.colors[token] };
  for (const [key, value] of Object.entries(ALIGN)) styles[`align-${key}`] = { alignItems: value };
  for (const [key, value] of Object.entries(JUSTIFY))
    styles[`justify-${key}`] = { justifyContent: value };
  for (const value of [1, 2, 3]) styles[`flex-${value}`] = { flex: value };
  return styles;
}

const useAtoms = createStyles(atoms);

export interface KlozViewProps extends Pick<
  ViewProps,
  'testID' | 'nativeID' | 'onLayout' | 'pointerEvents'
> {
  /** Lay children out in a row. Default column. */
  row?: boolean;
  gap?: SpaceKey;
  p?: SpaceKey;
  px?: SpaceKey;
  py?: SpaceKey;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  flex?: 1 | 2 | 3;
  bg?: SurfaceKey;
  radius?: RadiusKey;
  /** Hairline border in border-default. */
  border?: boolean;
  /** Landmark role on web. */
  as?: Landmark;
  /** For building Kloz components only; screens use the props above. */
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

type AtomProps = Pick<
  KlozViewProps,
  | 'row'
  | 'wrap'
  | 'border'
  | 'gap'
  | 'p'
  | 'px'
  | 'py'
  | 'radius'
  | 'bg'
  | 'align'
  | 'justify'
  | 'flex'
>;

/** Names of the atoms a set of props selects, e.g. { row: true, gap: 2 } → ['row', 'gap-2']. */
function atomNames({ row, wrap, border, ...valued }: AtomProps): string[] {
  const flags = Object.entries({ row, wrap, border })
    .filter(([, on]) => on)
    .map(([name]) => name);
  const values = Object.entries(valued)
    .filter(([, value]) => value !== undefined)
    .map(([name, value]) => `${name}-${String(value)}`);
  return [...flags, ...values];
}

export function KlozView({
  as,
  style,
  children,
  testID,
  nativeID,
  onLayout,
  pointerEvents,
  ...atomProps
}: KlozViewProps) {
  const atoms = useAtoms();
  const composed = [...atomNames(atomProps).map((name) => atoms[name]), style];
  return (
    <View
      testID={testID}
      nativeID={nativeID}
      onLayout={onLayout}
      pointerEvents={pointerEvents}
      role={as ? LANDMARK_ROLES[as] : undefined}
      style={composed}
    >
      {children}
    </View>
  );
}
