import { createStyles, KlozIcon, KlozTap, KlozText, KlozView } from '@klozbuy/ui';
import type { ReactNode } from 'react';

const useStyles = createStyles((t) => ({
  bar: {
    backgroundColor: t.colors.bgSurface,
    borderBottomWidth: t.stroke.hairline,
    borderBottomColor: t.colors.borderDefault,
  },
  inner: { width: '100%', maxWidth: 1120, alignSelf: 'center', minHeight: 60 },
  mark: {
    width: 32,
    height: 32,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.actionPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

/** Until there is a logo file: "Klozbuy" beside the map pin in a green square. */
function Wordmark() {
  const styles = useStyles();
  return (
    <KlozTap href="/" accessibilityLabel="Klozbuy home">
      <KlozView row align="center" gap={2}>
        <KlozView style={styles.mark}>
          <KlozIcon name="pin" size={20} tone="on-action" />
        </KlozView>
        <KlozText variant="title-3">Klozbuy</KlozText>
      </KlozView>
    </KlozTap>
  );
}

export function AppHeader({ actions }: { actions?: ReactNode }) {
  const styles = useStyles();
  return (
    <KlozView as="header" style={styles.bar} px={4}>
      <KlozView row align="center" justify="between" style={styles.inner}>
        <Wordmark />
        {/* A column wrapper, so buttons (which align to the start of their parent) sit centred in the bar. */}
        <KlozView justify="center">{actions}</KlozView>
      </KlozView>
    </KlozView>
  );
}
