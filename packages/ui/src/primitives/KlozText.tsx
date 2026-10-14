import type { ReactNode } from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { createVariants } from '../theme/createVariants';
import { fontFor } from '../theme/fonts';
import { TONE_COLORS, type TextTone } from '../theme/tones';
import type { TextVariant, TypeStyle } from '../tokens';
import { mapValues } from '../utils';

function toTextStyle(style: TypeStyle): TextStyle {
  return {
    fontSize: style.fontSize,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    ...fontFor(style.fontWeight),
    ...(style.tabular ? { fontVariant: ['tabular-nums'] } : null),
    ...(style.uppercase ? { textTransform: 'uppercase' } : null),
  };
}

const useTextStyles = createVariants((theme) => ({
  base: {},
  variants: {
    variant: mapValues(theme.type, (style: TypeStyle) => toTextStyle(style)),
    tone: mapValues(TONE_COLORS, (token) => ({ color: theme.colors[token] })),
    align: {
      auto: {},
      left: { textAlign: 'left' as const },
      center: { textAlign: 'center' as const },
      right: { textAlign: 'right' as const },
    },
  },
  defaults: { variant: 'body', tone: 'primary', align: 'auto' },
}));

export type { TextTone };

const TITLE_VARIANTS = new Set<TextVariant>(['display', 'title-1', 'title-2', 'title-3']);

export interface KlozTextProps extends Pick<
  TextProps,
  'numberOfLines' | 'selectable' | 'nativeID' | 'testID'
> {
  /** Named type style. Default 'body'. */
  variant?: TextVariant;
  /** Text colour. Default 'primary'. */
  tone?: TextTone;
  /** Makes the text a heading: <h1>–<h6> on web, a header for screen readers on native. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  align?: 'left' | 'center' | 'right';
  /** Screen readers announce changes, e.g. a form error that appears. */
  announce?: boolean;
  children?: ReactNode;
}

export function KlozText({
  variant = 'body',
  tone = 'primary',
  level,
  align,
  announce,
  children,
  ...rest
}: KlozTextProps) {
  const style = useTextStyles({ variant, tone, align });
  // aria-level is not in React Native's types; react-native-web renders it as <hN>.
  const heading = level ? { role: 'heading' as const, 'aria-level': level } : null;
  return (
    <Text
      {...rest}
      {...heading}
      aria-live={announce ? 'polite' : undefined}
      style={style}
      maxFontSizeMultiplier={TITLE_VARIANTS.has(variant) ? 1.4 : undefined}
    >
      {children}
    </Text>
  );
}
