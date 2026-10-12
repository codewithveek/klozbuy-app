import type { TextStyle } from 'react-native';
import { NATIVE_FONT_FAMILIES, type FontWeight } from '../tokens';

/** Native: one family per weight; setting fontWeight as well breaks custom fonts on Android. */
export function fontFor(weight: FontWeight): TextStyle {
  return { fontFamily: NATIVE_FONT_FAMILIES[weight] };
}
