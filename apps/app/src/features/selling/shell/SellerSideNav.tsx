import { useMyListings, useShopRequests } from '@klozbuy/api-client';
import type { MyShop } from '@klozbuy/contracts';
import { createStyles, KlozButton, KlozIcon, KlozTap, KlozText, KlozView } from '@klozbuy/ui';
import { useState } from 'react';
import { Platform } from 'react-native';
import { SITE_URL } from '../../../lib/config';
import { SELLER_NAV, sellerHref, type SellerNavItem, type SellerSection } from './seller-nav';

const useStyles = createStyles((t) => ({
  card: {
    backgroundColor: t.colors.bgSurface,
    borderWidth: t.stroke.hairline,
    borderColor: t.colors.borderDefault,
    borderRadius: t.radius.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: t.spacing[3],
    paddingHorizontal: t.spacing[3],
    borderRadius: t.radius.md,
  },
  hovered: { backgroundColor: t.colors.bgSubtle },
  current: { backgroundColor: t.colors.bgBrandSubtle },
  end: { marginLeft: 'auto' },
  count: {
    marginLeft: 'auto',
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.actionPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  share: { backgroundColor: t.colors.bgBrandSubtle, borderRadius: t.radius.lg },
}));

function Item({
  item,
  shopId,
  current,
  note,
  badge,
}: {
  item: SellerNavItem;
  shopId: string;
  current: boolean;
  note?: number;
  badge?: number;
}) {
  const styles = useStyles();
  const tone = current ? 'brand' : 'primary';
  return (
    <KlozTap
      href={sellerHref(shopId, item.path)}
      style={({ hovered }) => [styles.item, current ? styles.current : hovered && styles.hovered]}
    >
      <KlozIcon name={item.icon} tone={tone} />
      <KlozText variant={current ? 'body-strong' : 'body'} tone={tone}>
        {item.label}
      </KlozText>
      {note !== undefined && (
        <KlozView style={styles.end}>
          <KlozText variant="caption" tone="secondary">
            {String(note)}
          </KlozText>
        </KlozView>
      )}
      {!!badge && (
        <KlozView style={styles.count}>
          <KlozText variant="caption" tone="on-action">
            {String(badge)}
          </KlozText>
        </KlozView>
      )}
    </KlozTap>
  );
}

/** The shop's public link, ready to paste into WhatsApp status or Instagram. */
function ShareShop({ shop }: { shop: MyShop }) {
  const styles = useStyles();
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/s/${shop.slug}`;
  const copy = async () => {
    if (Platform.OS === 'web')
      await globalThis.navigator?.clipboard?.writeText(url).catch(() => undefined);
    setCopied(true);
  };
  return (
    <KlozView as="section" p={4} gap={2} style={styles.share}>
      <KlozView row align="center" gap={2}>
        <KlozIcon name="share" tone="brand" />
        <KlozText variant="label" tone="brand" level={2}>
          Share your shop
        </KlozText>
      </KlozView>
      <KlozText variant="body-sm">
        Put your shop link on your WhatsApp status. Buyers see everything you have in stock.
      </KlozText>
      <KlozText variant="label" selectable>
        {url.replace(/^https?:\/\//, '')}
      </KlozText>
      <KlozButton
        variant="brand-outline"
        size="sm"
        fullWidth
        leading={copied ? 'check' : 'copy'}
        onPress={copy}
      >
        {copied ? 'Link copied' : 'Copy link'}
      </KlozButton>
    </KlozView>
  );
}

export function SellerSideNav({ shop, active }: { shop: MyShop; active: SellerSection }) {
  const styles = useStyles();
  const listings = useMyListings(shop.id);
  const requests = useShopRequests(shop.id);
  const listed = listings.data?.filter((l) => l.status === 'active').length;
  const toAnswer = requests.data?.filter((r) => !r.offered).length;
  return (
    <KlozView gap={4}>
      <KlozView as="nav" p={2} gap={0.5} style={styles.card}>
        {SELLER_NAV.map((item) => (
          <Item
            key={item.key}
            item={item}
            shopId={shop.id}
            current={item.key === active}
            note={item.key === 'listings' ? listed : undefined}
            badge={item.key === 'requests' ? toAnswer : undefined}
          />
        ))}
      </KlozView>
      <ShareShop shop={shop} />
    </KlozView>
  );
}
