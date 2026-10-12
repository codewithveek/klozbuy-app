import type { TextStyle } from 'react-native';
import { FONT_FAMILY, type FontWeight } from '../tokens';

const WEB_FONT_STACK = `"${FONT_FAMILY}", system-ui, -apple-system, "Segoe UI", sans-serif`;

/** Web: one variable font, weight set by fontWeight. See fonts.native.ts for apps. */
export function fontFor(weight: FontWeight): TextStyle {
  return { fontFamily: WEB_FONT_STACK, fontWeight: weight };
}
