import type { ReactNode } from 'react';
import { KlozIcon, type IconName } from '../primitives/KlozIcon';
import { KlozTap } from '../primitives/KlozTap';
import { KlozText } from '../primitives/KlozText';
import { createStyles } from '../theme/createStyles';

const useStyles = createStyles((t) => ({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[1],
    minHeight: t.control.md,
    paddingHorizontal: t.spacing[4],
    borderRadius: t.radius.full,
    borderWidth: t.stroke.hairline,
    borderColor: t.colors.borderStrong,
    backgroundColor: t.colors.bgSurface,
  },
  active: { backgroundColor: t.colors.bgPressed },
  selected: { backgroundColor: t.colors.bgInverse, borderColor: t.colors.bgInverse },
}));

export interface KlozChipProps {
  selected?: boolean;
  icon?: IconName;
  onPress?: () => void;
  href?: string;
  testID?: string;
  children: ReactNode;
}

/** A filter or choice. Selected chips are inverse, the one strong neutral in Kloz. */
export function KlozChip({
  selected = false,
  icon,
  onPress,
  href,
  testID,
  children,
}: KlozChipProps) {
  const styles = useStyles();
  const tone = selected ? 'inverse' : 'primary';
  return (
    <KlozTap
      onPress={onPress}
      href={href}
      pressed={selected}
      testID={testID}
      style={({ pressed, hovered }) => [
        styles.chip,
        !selected && (pressed || hovered) && styles.active,
        selected && styles.selected,
      ]}
    >
      {icon && <KlozIcon name={icon} size={16} tone={tone} />}
      <KlozText variant="label" tone={tone} numberOfLines={1}>
        {children}
      </KlozText>
    </KlozTap>
  );
}
