import { useListing, useRecordView } from '@klozbuy/api-client';
import type { ListingDetail } from '@klozbuy/contracts';
import { createStyles, KlozSkeleton, KlozTap, KlozText, KlozView } from '@klozbuy/ui';
import { useEffect } from 'react';
import { SITE_URL } from '../../lib/config';
import { NotFound } from '../../lib/NotFound';
import { BuyerShell } from '../shell/BuyerShell';
import { BuyBox } from './BuyBox';
import { BuySafely } from './BuySafely';
import { JsonLd } from './JsonLd';
import { ListingDetails, ListingPhoto, MoreFromShop, ShopReviews } from './ListingBody';
import { listingJsonLd } from './seo';
import { ShopCard } from './ShopCard';

const useStyles = createStyles((t) => ({
  // The buy box comes first in the page so phones (stacked) show it right after the photo;
  // row-reverse puts it back on the right on wide screens.
  columns: { flexDirection: 'row-reverse', gap: t.spacing[6], alignItems: 'flex-start' },
  left: { flexGrow: 999, flexShrink: 1, flexBasis: 560, minWidth: 0, gap: t.spacing[5] },
  right: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 340,
    maxWidth: 420,
    minWidth: 0,
    gap: t.spacing[4],
  },
}));

function Breadcrumb({ listing }: { listing: ListingDetail }) {
  return (
    <KlozView as="nav" row wrap align="center" gap={2}>
      <KlozTap href="/">
        <KlozText variant="body-sm" tone="secondary">
          Near me
        </KlozText>
      </KlozTap>
      <KlozText variant="body-sm" tone="secondary">
        /
      </KlozText>
      <KlozText variant="body-sm" tone="secondary">
        {listing.category.name}
      </KlozText>
      <KlozText variant="body-sm" tone="secondary">
        /
      </KlozText>
      <KlozText variant="body-sm" numberOfLines={1}>
        {listing.title}
      </KlozText>
    </KlozView>
  );
}

/** Counts one view per page open, for the seller's figures. */
function useViewBeacon(listingId: string | undefined) {
  const record = useRecordView();
  const { mutate } = record;
  useEffect(() => {
    if (listingId) mutate(listingId);
  }, [listingId, mutate]);
}

/** A listing, laid out as in the mockup: photo and details left, the buy box and shop right. */
export function ListingScreen({ slug, initial }: { slug: string; initial?: ListingDetail }) {
  const styles = useStyles();
  const query = useListing(slug, initial);
  const listing = query.data;
  useViewBeacon(listing?.status === 'active' ? listing.id : undefined);
  if (!query.isPending && !listing) return <NotFound title="This listing is not here" />;
  return (
    <BuyerShell active="near" nav={false}>
      {!listing ? (
        <KlozSkeleton height={400} />
      ) : (
        <>
          <JsonLd data={listingJsonLd(listing, `${SITE_URL}/l/${listing.slug}`)} />
          <Breadcrumb listing={listing} />
          <KlozView as="article" style={styles.columns} responsive="stack-lg">
            <KlozView style={styles.right}>
              <KlozView responsive="show-below-lg">
                <ListingPhoto listing={listing} />
              </KlozView>
              <BuyBox listing={listing} />
              <ShopCard shop={listing.shop} category={listing.category.name} />
              <BuySafely listingId={listing.id} />
            </KlozView>
            <KlozView style={styles.left}>
              <KlozView responsive="show-from-lg">
                <ListingPhoto listing={listing} />
              </KlozView>
              <ListingDetails listing={listing} />
              <ShopReviews shopName={listing.shop.name} />
              <MoreFromShop listing={listing} />
            </KlozView>
          </KlozView>
        </>
      )}
    </BuyerShell>
  );
}
