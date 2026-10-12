import { KlozText } from '../primitives/KlozText';
import { KlozView } from '../primitives/KlozView';
import { createVariants } from '../theme/createVariants';
import type { TextTone } from '../theme/tones';

type Tone = 'brand' | 'info' | 'rose' | 'amber';
const AVATAR_TONES: Tone[] = ['brand', 'info', 'rose', 'amber'];
const TEXT_TONE: Record<Tone, TextTone> = {
  brand: 'brand',
  info: 'info',
  rose: 'rose',
  amber: 'warning',
};

const useAvatar = createVariants((t) => ({
  base: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: t.radius.full,
    flexShrink: 0,
  },
  variants: {
    tone: {
      brand: { backgroundColor: t.colors.bgBrandSubtle },
      info: { backgroundColor: t.colors.infoBg },
      rose: { backgroundColor: t.colors.roseBg },
      amber: { backgroundColor: t.colors.warningBg },
    },
    size: {
      sm: { width: 32, height: 32 },
      md: { width: 34, height: 34 },
      lg: { width: 44, height: 44 },
      xl: { width: 48, height: 48 },
    },
  },
  defaults: { tone: 'brand', size: 'md' },
}));

/** "Tunde Gadgets" → "TG". */
export function initials(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N} ]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const [first = '?', second] = words;
  return (second ? first.charAt(0) + second.charAt(0) : first.slice(0, 2)).toUpperCase();
}

/** A tone picked from the name, so the same shop always gets the same colour. */
export function avatarTone(name: string): Tone {
  let sum = 0;
  for (const char of name) sum += char.charCodeAt(0);
  return AVATAR_TONES[sum % AVATAR_TONES.length] ?? 'brand';
}

export interface KlozAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  tone?: Tone;
}

/** Initials in a circle, for shops and people without a photo. */
export function KlozAvatar({ name, size = 'md', tone = 'brand' }: KlozAvatarProps) {
  const style = useAvatar({ tone, size });
  return (
    <KlozView style={style}>
      <KlozText
        variant={size === 'lg' || size === 'xl' ? 'body-strong' : 'caption'}
        tone={TEXT_TONE[tone]}
      >
        {initials(name)}
      </KlozText>
    </KlozView>
  );
}
