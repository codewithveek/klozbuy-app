import { useState, type ReactNode } from 'react';
import { Modal, Platform, Pressable } from 'react-native';
import { KlozIcon } from '../primitives/KlozIcon';
import { KlozTap } from '../primitives/KlozTap';
import { KlozText } from '../primitives/KlozText';
import { KlozView } from '../primitives/KlozView';
import { createStyles } from '../theme/createStyles';

const useStyles = createStyles((t) => ({
  anchor: { position: 'relative' },
  anchorOpen: { zIndex: 50 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[1] + 2,
    minHeight: 40,
    paddingLeft: t.spacing[3] + 2,
    paddingRight: t.spacing[3],
    borderRadius: t.radius.md,
    borderWidth: t.stroke.hairline,
    borderColor: t.colors.borderStrong,
    backgroundColor: t.colors.bgSurface,
  },
  plain: { flexDirection: 'row', alignItems: 'center', gap: t.spacing[1] + 2, minHeight: 40 },
  hovered: { backgroundColor: t.colors.bgSubtle },
  // Web: a popover under the trigger. Native: a sheet from the bottom.
  popover: {
    zIndex: 60,
    position: 'absolute',
    top: '100%',
    marginTop: t.spacing[1] + 2,
    minWidth: 220,
    padding: t.spacing[1] + 2,
    borderRadius: t.radius.lg,
    borderWidth: t.stroke.hairline,
    borderColor: t.colors.borderDefault,
    backgroundColor: t.colors.bgSurface,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
  },
  start: { left: 0 },
  end: { right: 0 },
  // A fixed, invisible layer behind the popover: a click outside closes it.
  backdrop: { position: 'fixed' as 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scrim: { flex: 1, justifyContent: 'flex-end', backgroundColor: t.colors.scrim },
  sheet: {
    padding: t.spacing[4],
    paddingBottom: t.spacing[8],
    borderTopLeftRadius: t.radius.xl,
    borderTopRightRadius: t.radius.xl,
    backgroundColor: t.colors.bgSurface,
    gap: t.spacing[1],
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.spacing[3],
    paddingHorizontal: t.spacing[3],
    borderRadius: t.radius.md,
  },
  optionActive: { backgroundColor: t.colors.bgSubtle },
}));

export interface MenuOption<V> {
  value: V;
  label: string;
}

export interface KlozMenuProps<V> {
  /** What the trigger shows, e.g. "Distance: 3 km". */
  label: string;
  /** Read aloud as the menu's name, e.g. "Distance". */
  title: string;
  value: V;
  options: readonly MenuOption<V>[];
  onChange: (value: V) => void;
  /** field: bordered like the filter bar; plain: text only, like "Sort: Closest". */
  variant?: 'field' | 'plain';
  /** Which edge of the trigger the popover lines up with. */
  align?: 'start' | 'end';
  testID?: string;
}

function Options<V>({
  title,
  value,
  options,
  onPick,
}: Pick<KlozMenuProps<V>, 'title' | 'value' | 'options'> & { onPick: (value: V) => void }) {
  const styles = useStyles();
  return (
    <KlozView as="list" gap={0.5}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <KlozTap
            key={String(option.value)}
            pressed={selected}
            accessibilityLabel={`${title}: ${option.label}`}
            onPress={() => onPick(option.value)}
            style={({ hovered, pressed }) => [
              styles.option,
              (hovered || pressed || selected) && styles.optionActive,
            ]}
          >
            <KlozText variant={selected ? 'body-strong' : 'body'}>{option.label}</KlozText>
            {selected && <KlozIcon name="check" size={16} tone="brand" />}
          </KlozTap>
        );
      })}
    </KlozView>
  );
}

export interface KlozPopoverProps {
  align?: 'start' | 'end';
  onClose: () => void;
  children: ReactNode;
}

/**
 * Floating content under a trigger: a popover on web (place it right after the trigger inside
 * a position-relative parent) and a bottom sheet on native.
 */
export function KlozPopover({ align = 'start', onClose, children }: KlozPopoverProps) {
  const styles = useStyles();
  if (Platform.OS === 'web') {
    return (
      <>
        <Pressable accessibilityLabel="Close menu" onPress={onClose} style={styles.backdrop} />
        <KlozView style={[styles.popover, styles[align]]}>{children}</KlozView>
      </>
    );
  }
  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose}>
        <Pressable style={styles.sheet}>{children}</Pressable>
      </Pressable>
    </Modal>
  );
}

/** A dropdown for one choice: distance, price range, condition, sort order. */
export function KlozMenu<V>({
  label,
  title,
  value,
  options,
  onChange,
  variant = 'field',
  align = 'start',
  testID,
}: KlozMenuProps<V>) {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const pick = (next: V) => {
    setOpen(false);
    onChange(next);
  };
  return (
    <KlozView style={[styles.anchor, open && styles.anchorOpen]}>
      <KlozTap
        testID={testID}
        accessibilityLabel={`${title}: ${label}`}
        pressed={open}
        onPress={() => setOpen(!open)}
        style={({ hovered }) => [styles[variant], variant === 'field' && hovered && styles.hovered]}
      >
        <KlozText variant="label" tone={variant === 'plain' ? 'secondary' : 'primary'}>
          {label}
        </KlozText>
        <KlozIcon name="chevron-down" size={16} tone="secondary" />
      </KlozTap>
      {open && (
        <KlozPopover align={align} onClose={() => setOpen(false)}>
          <Options title={title} value={value} options={options} onPick={pick} />
        </KlozPopover>
      )}
    </KlozView>
  );
}
