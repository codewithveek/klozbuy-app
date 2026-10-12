import { KlozIcon, type IconName } from '../primitives/KlozIcon';
import { KlozTap } from '../primitives/KlozTap';
import { KlozView } from '../primitives/KlozView';
import { createVariants } from '../theme/createVariants';
import { createStyles } from '../theme/createStyles';

const useBox = createVariants((t) => ({
  base: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: t.stroke.hairline,
    borderColor: 'transparent',
  },
  variants: {
    variant: {
      outline: { backgroundColor: t.colors.bgSurface, borderColor: t.colors.borderStrong },
      subtle: { backgroundColor: t.colors.bgSubtle },
      surface: { backgroundColor: t.colors.bgSurface },
    },
    size: {
      sm: { width: t.control.sm, height: t.control.sm, minHeight: t.control.sm },
      md: { width: t.control.md, height: t.control.md },
    },
    shape: { rounded: { borderRadius: t.radius.md }, circle: { borderRadius: t.radius.full } },
  },
  defaults: { variant: 'outline', size: 'md', shape: 'rounded' },
}));

const useStyles = createStyles((t) => ({
  active: { backgroundColor: t.colors.bgPressed },
  dot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: t.radius.full,
    borderWidth: 2,
    borderColor: t.colors.bgSubtle,
    backgroundColor: t.colors.attention,
  },
}));

export interface KlozIconButtonProps {
  icon: IconName;
  /** Always required: the button has no visible text. */
  label: string;
  variant?: 'outline' | 'subtle' | 'surface';
  /** sm 36px (inside photos), md 44px. */
  size?: 'sm' | 'md';
  shape?: 'rounded' | 'circle';
  /** Fills the icon, e.g. a saved heart. */
  pressed?: boolean;
  /** A small dot for something new, e.g. offers on a request. */
  dot?: boolean;
  href?: string;
  onPress?: () => void;
  testID?: string;
}

/** Call, directions, save and other one-icon actions. */
export function KlozIconButton({
  icon,
  label,
  variant = 'outline',
  size = 'md',
  shape = 'rounded',
  pressed,
  dot,
  href,
  onPress,
  testID,
}: KlozIconButtonProps) {
  const box = useBox({ variant, size, shape });
  const styles = useStyles();
  return (
    <KlozTap
      href={href}
      onPress={onPress}
      pressed={pressed}
      accessibilityLabel={label}
      testID={testID}
      style={(state) => [box, (state.pressed || state.hovered) && styles.active]}
    >
      <KlozIcon name={icon} size={size === 'sm' ? 16 : 20} tone={pressed ? 'danger' : 'primary'} />
      {dot && <KlozView style={styles.dot} />}
    </KlozTap>
  );
}
