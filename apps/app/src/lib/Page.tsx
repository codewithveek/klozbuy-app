import { createStyles, KlozView } from '@klozbuy/ui';
import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const useStyles = createStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.bgCanvas },
  scroll: { flexGrow: 1 },
  // Phone gutter everywhere for now: a width-based gutter would differ between the server
  // render and the browser. Wide screens get their margin from the centred max width.
  content: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: t.spacing[6],
    paddingHorizontal: t.spacing[4],
  },
  narrow: { maxWidth: 440 },
  wide: { maxWidth: 1120 },
}));

export interface PageProps {
  /** narrow for forms such as sign-in; wide for browsing. */
  width?: 'narrow' | 'wide';
  header?: ReactNode;
  children: ReactNode;
}

/** Page frame: canvas background, safe areas, centred content and the side gutter. */
export function Page({ width = 'wide', header, children }: PageProps) {
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.screen}>
      {header}
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <KlozView as="main" style={[styles.content, styles[width]]}>
          {children}
        </KlozView>
      </ScrollView>
    </SafeAreaView>
  );
}
