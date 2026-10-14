import { useMe, useMyShop } from '@klozbuy/api-client';
import type { MyShop } from '@klozbuy/contracts';
import { createStyles, KlozButton, KlozChip, KlozSkeleton, KlozView } from '@klozbuy/ui';
import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotFound } from '../../../lib/NotFound';
import { SELLER_NAV, sellerHref, type SellerSection } from './seller-nav';
import { SellerHeader } from './SellerHeader';
import { SellerSideNav } from './SellerSideNav';

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
}));

/** Below lg the section nav becomes a row of chips you can swipe. */
function PhoneNav({ shopId, active }: { shopId: string; active: SellerSection }) {
  return (
    <KlozView responsive="show-below-lg">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <KlozView row gap={2}>
          {SELLER_NAV.map((item) => (
            <KlozChip
              key={item.key}
              icon={item.icon}
              selected={item.key === active}
              href={sellerHref(shopId, item.path)}
            >
              {item.label}
            </KlozChip>
          ))}
        </KlozView>
      </ScrollView>
    </KlozView>
  );
}

export interface SellerShellProps {
  shopId: string;
  active: SellerSection;
  children: (shop: MyShop) => ReactNode;
}

/** Every seller page: header, section nav, and the page for the current shop. */
export function SellerShell({ shopId, active, children }: SellerShellProps) {
  const styles = useStyles();
  const me = useMe();
  const shop = useMyShop(shopId);
  if (!me.isPending && !me.data) {
    return (
      <NotFound
        title="Sign in to manage your shop"
        body="Use the phone number that opened the shop."
      >
        <KlozButton href={`/sign-in?next=/sell/${shopId}`}>Sign in</KlozButton>
      </NotFound>
    );
  }
  if (shop.isError)
    return (
      <NotFound
        title="This shop is not yours"
        body="Sign in with the number that opened the shop."
      />
    );
  if (!shop.data) return <KlozSkeleton height={300} />;
  return (
    <SafeAreaView style={styles.screen}>
      <SellerHeader shop={shop.data} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <KlozView row align="start" style={styles.body} responsive="gutter">
          <KlozView style={styles.left} responsive="show-from-lg">
            <SellerSideNav shop={shop.data} active={active} />
          </KlozView>
          <KlozView as="main" style={styles.main}>
            <PhoneNav shopId={shopId} active={active} />
            {children(shop.data)}
          </KlozView>
        </KlozView>
      </ScrollView>
    </SafeAreaView>
  );
}
