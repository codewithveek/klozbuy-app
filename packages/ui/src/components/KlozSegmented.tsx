import { KlozTap } from '../primitives/KlozTap';
import { KlozText } from '../primitives/KlozText';
import { KlozView } from '../primitives/KlozView';
import { createStyles } from '../theme/createStyles';

const useStyles = createStyles((t) => ({
  track: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: t.spacing[1],
    borderRadius: t.radius.full,
    backgroundColor: t.colors.bgSubtle,
  },
  segment: {
    minHeight: 36,
    paddingHorizontal: t.spacing[4] + 2,
    borderRadius: t.radius.full,
    alignItems: 'center',
  },
  selected: { backgroundColor: t.colors.bgSurface },
}));

export interface KlozSegmentedProps<V extends string> {
  label: string;
  value: V;
  options: readonly { value: V; label: string }[];
  onChange: (value: V) => void;
}

/** Two or three views of the same thing: List / Map, 7 days / 30 days. */
export function KlozSegmented<V extends string>({
  label,
  value,
  options,
  onChange,
}: KlozSegmentedProps<V>) {
  const styles = useStyles();
  return (
    <KlozView style={styles.track} as="list">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <KlozTap
            key={option.value}
            pressed={selected}
            accessibilityLabel={`${label}: ${option.label}`}
            onPress={() => onChange(option.value)}
            style={[styles.segment, selected && styles.selected]}
          >
            <KlozText variant="label" tone={selected ? 'primary' : 'secondary'}>
              {option.label}
            </KlozText>
          </KlozTap>
        );
      })}
    </KlozView>
  );
}
