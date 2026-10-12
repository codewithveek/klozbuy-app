import { useMe, useMyShops } from '@klozbuy/api-client';
import { KlozButton, KlozText, KlozView } from '@klozbuy/ui';
import { Redirect } from 'expo-router';
import { AppHeader } from '../../lib/AppHeader';
import { Page } from '../../lib/Page';
import { HeaderActions } from '../identity/HeaderActions';
import { CreateShopForm } from './CreateShopForm';

function SignInFirst() {
  return (
    <KlozView gap={4} p={5} bg="surface" radius="lg" border>
      <KlozText variant="title-2" level={2}>
        Sign in to start selling
      </KlozText>
      <KlozText tone="secondary">
        We use your phone number so buyers know a real person runs the shop.
      </KlozText>
      <KlozButton href="/sign-in?next=/sell">Sign in with your phone</KlozButton>
    </KlozView>
  );
}

/** /sell: sign in, then open a shop; sellers who have one go straight to their dashboard. */
export function SellScreen() {
  const me = useMe();
  const shops = useMyShops(!!me.data);
  const firstShop = shops.data?.[0];
  if (firstShop) return <Redirect href={`/sell/${firstShop.id}`} />;
  const loading = me.isPending || (!!me.data && shops.isPending);
  return (
    <Page width="narrow" header={<AppHeader actions={<HeaderActions />} />}>
      <KlozView gap={6} py={4}>
        <KlozView gap={2}>
          <KlozText variant="title-1" level={1}>
            Sell to buyers near you
          </KlozText>
          <KlozText tone="secondary">
            List what you have in stock. Buyers within walking distance find it and message you on
            WhatsApp.
          </KlozText>
        </KlozView>
        {loading ? null : me.data ? <CreateShopForm /> : <SignInFirst />}
      </KlozView>
    </Page>
  );
}
