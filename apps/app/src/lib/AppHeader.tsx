import { createStyles, KlozView } from '@klozbuy/ui';
import type { ReactNode } from 'react';
import { Wordmark } from '../features/shell/Wordmark';

const useStyles = createStyles((t) => ({
  bar: {
    backgroundColor: t.colors.bgSurface,
    borderBottomWidth: t.stroke.hairline,
    borderBottomColor: t.colors.borderDefault,
  },
  inner: { width: '100%', maxWidth: 1440, alignSelf: 'center', minHeight: 72 },
}));

/** A plain header for focused pages such as sign-in: the wordmark and an optional action. */
export function AppHeader({ actions }: { actions?: ReactNode }) {
  const styles = useStyles();
  return (
    <KlozView as="header" style={styles.bar}>
      <KlozView row align="center" justify="between" style={styles.inner} responsive="gutter">
        <Wordmark />
        {actions && <KlozView justify="center">{actions}</KlozView>}
      </KlozView>
    </KlozView>
  );
}
