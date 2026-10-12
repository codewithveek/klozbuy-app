import type { ColorToken } from '../tokens';

/** Colour roles for text and icons. Icons take the tone of the text beside them. */
export type TextTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'brand'
  | 'inverse'
  | 'on-action'
  | 'danger'
  | 'warning'
  | 'info';

export const TONE_COLORS: Record<TextTone, ColorToken> = {
  primary: 'textPrimary',
  secondary: 'textSecondary',
  tertiary: 'textTertiary',
  brand: 'textBrand',
  inverse: 'textInverse',
  'on-action': 'onAction',
  danger: 'dangerFg',
  warning: 'warningFg',
  info: 'infoFg',
};
