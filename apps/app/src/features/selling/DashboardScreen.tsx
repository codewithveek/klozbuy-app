import { useMyListings, useMyShop } from '@klozbuy/api-client';
import type { MyShop } from '@klozbuy/contracts';
import { createStyles, KlozBadge, KlozButton, KlozText, KlozView } from '@klozbuy/ui';
import { AppHeader } from '../../lib/AppHeader';
import { NotFound } from '../../lib/NotFound';
import { Page } from '../../lib/Page';
import { EmptyState } from '../discovery/ListingGrid';
import { HeaderActions } from '../identity/HeaderActions';
import { MyListingRow } from './MyListingRow';
import { StatsPanel } from './StatsPanel';

const useStyles = createStyles(() => ({ heading: { flexGrow: 1, flexShrink: 1, flexBasis: 260 } }));

function Verification({ shop }: { shop: MyShop }) {
  if (shop.verified)
    return (
      <KlozBadge tone="brand" icon="shield-check">
        Checked in person
      </KlozBadge>
    );
  return (
    <KlozView gap={1}>
      <KlozBadge tone="warning" icon="clock">
        Waiting for a visit
      </KlozBadge>
      <KlozText variant="caption" tone="secondary">
        Our team will visit to check the shop. Verified shops show to more buyers.
      </KlozText>
    </KlozView>
  );
}

/** The seller's home: leads, then listings with their daily actions. */
export function DashboardScreen({ shopId }: { shopId: string }) {
  const styles = useStyles();
  const shop = useMyShop(shopId);
  const listings = useMyListings(shopId);
  if (shop.isPending) return <Page header={<AppHeader actions={<HeaderActions />} />}>{null}</Page>;
  if (!shop.data)
    return (
      <NotFound
        title="This shop is not yours"
        body="Sign in with the number that opened the shop."
      />
    );
  return (
    <Page header={<AppHeader actions={<HeaderActions />} />}>
      <KlozView gap={6} py={2}>
        <KlozView row wrap justify="between" align="start" gap={4}>
          <KlozView gap={2} style={styles.heading}>
            <KlozText variant="title-1" level={1}>
              {shop.data.name}
            </KlozText>
            <Verification shop={shop.data} />
          </KlozView>
          <KlozView row gap={2} wrap>
            <KlozButton variant="outline" href={`/s/${shop.data.slug}`}>
              View shop page
            </KlozButton>
            <KlozButton leading="plus" href={`/sell/${shopId}/new`} testID="add-listing">
              Add a listing
            </KlozButton>
          </KlozView>
        </KlozView>
        <StatsPanel shopId={shopId} />
        <KlozText variant="title-2" level={2}>
          Your listings
        </KlozText>
        {listings.data && listings.data.length === 0 ? (
          <EmptyState
            title="No listings yet"
            body="Add what you have in stock. It shows to buyers nearby straight away."
          />
        ) : (
          <KlozView as="list" gap={3}>
            {(listings.data ?? []).map((listing) => (
              <MyListingRow key={listing.id} listing={listing} />
            ))}
          </KlozView>
        )}
      </KlozView>
    </Page>
  );
}
