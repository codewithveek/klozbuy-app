import { useListing } from '@klozbuy/api-client';
import type { ListingDetail } from '@klozbuy/contracts';
import { createStyles, KlozBadge, KlozIcon, KlozPrice, KlozText, KlozView } from '@klozbuy/ui';
import { AppHeader } from '../../lib/AppHeader';
import { SITE_URL } from '../../lib/config';
import { CONDITION_LABELS, stockLine } from '../../lib/format';
import { NotFound } from '../../lib/NotFound';
import { Page } from '../../lib/Page';
import { HeaderActions } from '../identity/HeaderActions';
import { JsonLd } from './JsonLd';
import { ListingActions } from './ListingActions';
import { listingJsonLd } from './seo';
import { BuySafely, ShopPanel } from './ShopPanel';

const useStyles = createStyles((t) => ({
  photo: {
    aspectRatio: 4 / 3,
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: { flexGrow: 1, flexBasis: 320 },
}));

function Facts({ listing }: { listing: ListingDetail }) {
  return (
    <KlozView gap={3}>
      <KlozText variant="overline" tone="secondary">
        {listing.category.name}
      </KlozText>
      <KlozText variant="title-1" level={1}>
        {listing.title}
      </KlozText>
      <KlozPrice amount={listing.priceNgn} size="lg" />
      <KlozView row gap={2} wrap>
        {listing.negotiable && <KlozBadge tone="warning">Negotiable</KlozBadge>}
        {listing.condition && <KlozBadge>{CONDITION_LABELS[listing.condition]}</KlozBadge>}
        <KlozBadge tone={listing.stockStatus === 'in_stock' ? 'brand' : 'warning'}>
          {stockLine(listing, new Date())}
        </KlozBadge>
      </KlozView>
    </KlozView>
  );
}

function SoldNotice() {
  return (
    <KlozView row gap={2} p={4} radius="lg" bg="inverse" align="center">
      <KlozIcon name="check-circle" tone="inverse" />
      <KlozText tone="inverse">This item has sold. See what else the shop has below.</KlozText>
    </KlozView>
  );
}

export function ListingScreen({ slug, initial }: { slug: string; initial?: ListingDetail }) {
  const styles = useStyles();
  const query = useListing(slug, initial);
  const listing = query.data;
  if (query.isPending)
    return <Page header={<AppHeader actions={<HeaderActions />} />}>{null}</Page>;
  if (!listing) return <NotFound title="This listing is not here" />;
  return (
    <Page header={<AppHeader actions={<HeaderActions />} />}>
      <JsonLd data={listingJsonLd(listing, `${SITE_URL}/l/${listing.slug}`)} />
      <KlozView as="article" row wrap gap={8} py={2}>
        <KlozView style={styles.column} gap={4}>
          <KlozView style={styles.photo}>
            <KlozIcon
              name={listing.type === 'service' ? 'wrench' : 'tag'}
              size={24}
              tone="tertiary"
            />
          </KlozView>
        </KlozView>
        <KlozView style={styles.column} gap={5}>
          <Facts listing={listing} />
          {listing.status === 'sold' ? <SoldNotice /> : <ListingActions listing={listing} />}
          {listing.description && (
            <KlozView as="section" gap={2}>
              <KlozText variant="title-3" level={2}>
                About this {listing.type === 'service' ? 'service' : 'item'}
              </KlozText>
              <KlozText tone="secondary">{listing.description}</KlozText>
            </KlozView>
          )}
          <ShopPanel shop={listing.shop} />
          <BuySafely />
        </KlozView>
      </KlozView>
    </Page>
  );
}
