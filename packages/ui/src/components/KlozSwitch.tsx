import { KlozTap } from '../primitives/KlozTap';
import { KlozText } from '../primitives/KlozText';
import { KlozView } from '../primitives/KlozView';
import { createStyles } from '../theme/createStyles';

const useStyles = createStyles((t) => ({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[2],
    minHeight: 40,
    paddingLeft: t.spacing[2] + 2,
    paddingRight: t.spacing[3] + 2,
    borderRadius: t.radius.md,
    borderWidth: t.stroke.hairline,
    borderColor: t.colors.borderStrong,
    backgroundColor: t.colors.bgSurface,
  },
  hovered: { backgroundColor: t.colors.bgSubtle },
  track: {
    width: 30,
    height: 18,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.borderStrong,
    padding: 2,
  },
  trackOn: { backgroundColor: t.colors.actionPrimary, alignItems: 'flex-end' },
  thumb: { width: 14, height: 14, borderRadius: t.radius.full, backgroundColor: t.colors.onAction },
}));

export interface KlozSwitchProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  testID?: string;
}

/** An on/off filter with its label inside the control: "Verified shops only". */
export function KlozSwitch({ label, value, onChange, testID }: KlozSwitchProps) {
  const styles = useStyles();
  return (
    <KlozTap
      role="switch"
      pressed={value}
      onPress={() => onChange(!value)}
      testID={testID}
      style={({ hovered }) => [styles.field, hovered && styles.hovered]}
    >
      <KlozView style={[styles.track, value && styles.trackOn]}>
        <KlozView style={styles.thumb} />
      </KlozView>
      <KlozText variant="label">{label}</KlozText>
    </KlozTap>
  );
}
