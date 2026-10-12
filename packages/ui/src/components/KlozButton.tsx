import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { KlozIcon, type IconName } from '../primitives/KlozIcon';
import { KlozTap } from '../primitives/KlozTap';
import { KlozText, type TextTone } from '../primitives/KlozText';
import { KlozView } from '../primitives/KlozView';
import { createStyles } from '../theme/createStyles';
import { createVariants } from '../theme/createVariants';
import { useTheme } from '../theme/ThemeProvider';
import { TONE_COLORS } from '../theme/tones';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const LABEL_TONE: Record<Variant, TextTone> = {
  primary: 'on-action',
  secondary: 'primary',
  outline: 'primary',
  ghost: 'primary',
  danger: 'on-action',
};

const useContainer = createVariants((t) => ({
  base: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    alignSelf: 'flex-start' as const,
    gap: t.spacing[2],
    borderRadius: t.radius.md,
    borderWidth: t.stroke.hairline,
    borderColor: 'transparent',
  },
  variants: {
    variant: {
      primary: { backgroundColor: t.colors.actionPrimary },
      secondary: { backgroundColor: t.colors.bgSubtle },
      outline: { backgroundColor: t.colors.bgSurface, borderColor: t.colors.borderStrong },
      ghost: { backgroundColor: 'transparent' },
      danger: { backgroundColor: t.colors.dangerSolid },
    },
    size: {
      sm: { minHeight: t.control.sm, paddingHorizontal: t.spacing[3] },
      md: { minHeight: t.control.md, paddingHorizontal: t.spacing[4] },
      lg: { minHeight: t.control.lg, paddingHorizontal: t.spacing[5] },
    },
    width: { auto: {}, full: { alignSelf: 'stretch' as const } },
  },
  defaults: { variant: 'primary', size: 'md', width: 'auto' },
}));

/** Pressed and hovered look: primary darkens, neutral controls move to bg-pressed. */
const useActive = createStyles((t) => ({
  primary: { backgroundColor: t.colors.actionPrimaryPressed },
  secondary: { backgroundColor: t.colors.bgPressed },
  outline: { backgroundColor: t.colors.bgPressed },
  ghost: { backgroundColor: t.colors.bgPressed },
  danger: { opacity: 0.88 },
  hidden: { opacity: 0 },
}));

export interface KlozButtonProps {
  variant?: Variant;
  /** sm 36px (desktop tables only), md 44px, lg 52px (the screen's main action). */
  size?: Size;
  leading?: IconName;
  trailing?: IconName;
  /** Shows a spinner in place of the label and keeps the button's width. */
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  href?: string;
  onPress?: () => void;
  testID?: string;
  children: ReactNode;
}

function ButtonLabel({
  size,
  tone,
  leading,
  trailing,
  hidden,
  children,
}: {
  size: Size;
  tone: TextTone;
  leading?: IconName;
  trailing?: IconName;
  hidden?: boolean;
  children: ReactNode;
}) {
  const active = useActive();
  return (
    <KlozView row align="center" gap={2} style={hidden ? active.hidden : undefined}>
      {leading && <KlozIcon name={leading} tone={tone} />}
      <KlozText variant={size === 'sm' ? 'label' : 'body-strong'} tone={tone} numberOfLines={1}>
        {children}
      </KlozText>
      {trailing && <KlozIcon name={trailing} tone={tone} />}
    </KlozView>
  );
}

function Spinner({ tone }: { tone: TextTone }) {
  const theme = useTheme();
  return (
    <KlozView style={StyleSheet.absoluteFill} align="center" justify="center">
      <ActivityIndicator color={theme.colors[TONE_COLORS[tone]]} />
    </KlozView>
  );
}

export function KlozButton({
  variant = 'primary',
  size = 'md',
  leading,
  trailing,
  loading = false,
  disabled = false,
  fullWidth,
  href,
  onPress,
  testID,
  children,
}: KlozButtonProps) {
  const container = useContainer({ variant, size, width: fullWidth ? 'full' : 'auto' });
  const active = useActive();
  const tone = LABEL_TONE[variant];
  return (
    <KlozTap
      href={loading ? undefined : href}
      onPress={loading ? undefined : onPress}
      disabled={disabled}
      testID={testID}
      busy={loading}
      style={({ pressed, hovered }) => [
        container,
        (pressed || hovered) && !disabled && active[variant],
      ]}
    >
      <ButtonLabel size={size} tone={tone} leading={leading} trailing={trailing} hidden={loading}>
        {children}
      </ButtonLabel>
      {loading && <Spinner tone={tone} />}
    </KlozTap>
  );
}
