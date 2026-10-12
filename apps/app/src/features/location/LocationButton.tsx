import { createStyles, KlozIcon, KlozPopover, KlozTap, KlozText, KlozView } from '@klozbuy/ui';
import { useState } from 'react';
import { LocationPicker } from './LocationPicker';
import { useBuyerLocation } from './LocationProvider';

const useStyles = createStyles((t) => ({
  anchor: { position: 'relative', zIndex: 40 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[2] + 2,
    minHeight: 46,
    paddingHorizontal: t.spacing[3] + 2,
    borderRadius: t.radius.full,
    borderWidth: t.stroke.hairline,
    borderColor: t.colors.borderStrong,
    backgroundColor: t.colors.bgSurface,
  },
  plain: { flexDirection: 'row', alignItems: 'center', gap: t.spacing[2] + 2 },
  hovered: { backgroundColor: t.colors.bgSubtle },
  mark: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: t.colors.actionPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: { width: 320, maxWidth: '100%' },
}));

/** "Yaba, Lagos · Within 3 km": where the feed is centred. Opens the area picker. */
export function LocationButton({ variant = 'pill' }: { variant?: 'pill' | 'phone' }) {
  const styles = useStyles();
  const { location, radiusKm } = useBuyerLocation();
  const [open, setOpen] = useState(false);
  const place = location.source === 'device' ? 'Your location' : `${location.label}, Lagos`;
  return (
    <KlozView style={styles.anchor}>
      <KlozTap
        accessibilityLabel={`Location: ${place}, within ${radiusKm} km. Change`}
        pressed={open}
        onPress={() => setOpen(!open)}
        style={({ hovered }) => [
          variant === 'pill' ? styles.pill : styles.plain,
          variant === 'pill' && hovered && styles.hovered,
        ]}
      >
        {variant === 'pill' ? (
          <KlozIcon name="pin" tone="brand" />
        ) : (
          <KlozView style={styles.mark}>
            <KlozIcon name="pin" tone="on-action" />
          </KlozView>
        )}
        <KlozView>
          <KlozView row align="center" gap={1}>
            <KlozText variant={variant === 'pill' ? 'label' : 'body-strong'}>{place}</KlozText>
            {variant === 'phone' && <KlozIcon name="chevron-down" size={16} tone="secondary" />}
          </KlozView>
          <KlozText variant="caption" tone="secondary">{`Within ${radiusKm} km`}</KlozText>
        </KlozView>
        {variant === 'pill' && <KlozIcon name="chevron-down" size={16} tone="secondary" />}
      </KlozTap>
      {open && (
        <KlozPopover onClose={() => setOpen(false)}>
          <KlozView style={styles.picker}>
            <LocationPicker onDone={() => setOpen(false)} />
          </KlozView>
        </KlozPopover>
      )}
    </KlozView>
  );
}
