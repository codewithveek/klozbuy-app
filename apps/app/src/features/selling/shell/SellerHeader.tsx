import { useShopRequests } from '@klozbuy/api-client';
import type { MyShop } from '@klozbuy/contracts';
import { KlozButton, KlozIconButton, KlozView } from '@klozbuy/ui';
import { useBarStyles } from '../../shell/BuyerHeader';
import { Wordmark } from '../../shell/Wordmark';
import { AccountButtons } from '../../identity/AccountButtons';
import { ShopSwitcher } from './ShopSwitcher';

/** "Klozbuy for sellers", the shop, and the two things sellers do most. */
export function SellerHeader({ shop }: { shop: MyShop }) {
  const styles = useBarStyles();
  const requests = useShopRequests(shop.id);
  const newRequests = requests.data?.filter((r) => !r.offered).length ?? 0;
  return (
    <KlozView as="header" style={styles.bar}>
      <KlozView row wrap align="center" style={styles.inner} responsive="gutter">
        <Wordmark sellers />
        <KlozView responsive="show-from-md">
          <ShopSwitcher shop={shop} />
        </KlozView>
        <KlozView as="nav" row align="center" gap={2} style={styles.end}>
          <KlozView responsive="show-from-md">
            <KlozButton variant="outline" shape="pill" href={`/s/${shop.slug}`}>
              View my shop
            </KlozButton>
          </KlozView>
          <KlozView responsive="show-from-md">
            <KlozButton
              shape="pill"
              leading="plus"
              href={`/sell/${shop.id}/new`}
              testID="add-listing"
            >
              Add listing
            </KlozButton>
          </KlozView>
          <KlozView responsive="show-below-md">
            <KlozIconButton
              icon="plus"
              label="Add listing"
              variant="subtle"
              shape="circle"
              href={`/sell/${shop.id}/new`}
            />
          </KlozView>
          <KlozIconButton
            icon="bell"
            label={newRequests ? `${newRequests} buyer requests to answer` : 'Buyer requests'}
            variant="subtle"
            shape="circle"
            dot={newRequests > 0}
            href={`/sell/${shop.id}/requests`}
          />
          <AccountButtons bell={false} />
        </KlozView>
      </KlozView>
    </KlozView>
  );
}
