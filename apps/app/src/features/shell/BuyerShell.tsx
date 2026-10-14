import { createStyles, KlozView } from '@klozbuy/ui';
import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabs } from './BottomTabs';
import { BuyerHeader } from './BuyerHeader';
import type { BuyerSection } from './nav-items';
import { SideNav } from './SideNav';

const useStyles = createStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.bgCanvas },
  scroll: { flexGrow: 1 },
  body: {
    width: '100%',
    maxWidth: 1440,
    alignSelf: 'center',
    paddingTop: t.spacing[5],
    paddingBottom: t.spacing[12],
    gap: t.spacing[6],
  },
  left: { width: 216, flexShrink: 0 },
  main: { flex: 1, minWidth: 0, gap: t.spacing[4] + 2 },
  right: { width: 300, flexShrink: 0, gap: t.spacing[4] },
}));

export interface BuyerShellProps {
  active: BuyerSection;
  /** The right column on wide screens: map, requests, tips. */
  aside?: ReactNode;
  /** False for detail pages that use the full width (listing, shop). */
  nav?: boolean;
  children: ReactNode;
}

/**
 * Every buyer page: header, the section nav on the left (wide screens), the page, an
 * optional right column (widest screens), and tabs at the bottom on phones.
 */
export function BuyerShell({ active, aside, nav = true, children }: BuyerShellProps) {
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <BuyerHeader />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <KlozView row align="start" style={styles.body} responsive="gutter">
          {nav && (
            <KlozView style={styles.left} responsive="show-from-lg">
              <SideNav active={active} />
            </KlozView>
          )}
          <KlozView as="main" style={styles.main}>
            {children}
          </KlozView>
          {aside && (
            <KlozView as="aside" style={styles.right} responsive="show-from-xl">
              {aside}
            </KlozView>
          )}
        </KlozView>
      </ScrollView>
      <KlozView responsive="show-below-md">
        <SafeAreaView edges={['bottom']}>
          <BottomTabs active={active} />
        </SafeAreaView>
      </KlozView>
    </SafeAreaView>
  );
}
