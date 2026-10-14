import { createStyles, KlozIcon, KlozText, KlozView, type IconName } from '@klozbuy/ui';

const useStyles = createStyles((t) => ({
  card: { backgroundColor: t.colors.bgBrandSubtle, borderRadius: t.radius.lg },
}));

const POINTS: [IconName, string][] = [
  ['shield-check', 'Verified shops were checked in person'],
  ['chat', 'You talk to the seller directly on WhatsApp'],
  ['lock', 'Pay on inspection (coming soon)'],
];

/** Why buying here is safer: only what is true today, and what is coming marked as such. */
export function SaferCard() {
  const styles = useStyles();
  return (
    <KlozView as="section" p={4} gap={3} style={styles.card}>
      <KlozText variant="label" level={2} tone="brand">
        Why buying here is safer
      </KlozText>
      {POINTS.map(([icon, text]) => (
        <KlozView key={text} row align="center" gap={2}>
          <KlozIcon name={icon} tone="brand" />
          <KlozView flex={1}>
            <KlozText variant="body-sm">{text}</KlozText>
          </KlozView>
        </KlozView>
      ))}
    </KlozView>
  );
}
