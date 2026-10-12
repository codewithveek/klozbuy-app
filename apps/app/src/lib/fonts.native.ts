import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { NATIVE_FONT_FAMILIES } from '@klozbuy/ui';

/** Loads one font file per weight under the family names Kloz components use. */
export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    [NATIVE_FONT_FAMILIES['400']]: PlusJakartaSans_400Regular,
    [NATIVE_FONT_FAMILIES['500']]: PlusJakartaSans_500Medium,
    [NATIVE_FONT_FAMILIES['600']]: PlusJakartaSans_600SemiBold,
    [NATIVE_FONT_FAMILIES['700']]: PlusJakartaSans_700Bold,
  });
  return loaded;
}
