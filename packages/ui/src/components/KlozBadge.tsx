import type { ReactNode } from 'react';
import { KlozIcon, type IconName } from '../primitives/KlozIcon';
import { KlozText } from '../primitives/KlozText';
import { KlozView } from '../primitives/KlozView';
import { createVariants } from '../theme/createVariants';
import type { TextTone } from '../theme/tones';

type Tone = 'neutral' | 'brand' | 'warning' | 'danger' | 'info' | 'inverse';

const TEXT_TONE: Record<Tone, TextTone> = {
  neutral: 'secondary',
  brand: 'brand',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
  inverse: 'inverse',
};

const useBadge = createVariants((t) => ({
  base: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    alignSelf: 'flex-start' as const,
    gap: t.spacing[1],
    paddingHorizontal: t.spacing[2],
    paddingVertical: t.spacing[0.5],
    borderRadius: t.radius.sm,
  },
  variants: {
    tone: {
      neutral: { backgroundColor: t.colors.bgSubtle },
      brand: { backgroundColor: t.colors.bgBrandSubtle },
      warning: { backgroundColor: t.colors.warningBg },
      danger: { backgroundColor: t.colors.dangerBg },
      info: { backgroundColor: t.colors.infoBg },
      inverse: { backgroundColor: t.colors.bgInverse },
    },
  },
  defaults: { tone: 'neutral' },
}));

export interface KlozBadgeProps {
  tone?: Tone;
  icon?: IconName;
  children: ReactNode;
}

/** A short status: Verified, Negotiable, Low stock. Always words, never colour alone. */
export function KlozBadge({ tone = 'neutral', icon, children }: KlozBadgeProps) {
  const style = useBadge({ tone });
  return (
    <KlozView style={style}>
      {icon && <KlozIcon name={icon} size={14} tone={TEXT_TONE[tone]} />}
      <KlozText variant="caption" tone={TEXT_TONE[tone]} numberOfLines={1}>
        {children}
      </KlozText>
    </KlozView>
  );
}
