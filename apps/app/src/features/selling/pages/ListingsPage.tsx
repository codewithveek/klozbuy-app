import { useMyListings, useShopInsights } from '@klozbuy/api-client';
import type { MyShop } from '@klozbuy/contracts';
import { KlozButton, KlozSkeleton, KlozText } from '@klozbuy/ui';
import { Panel } from '../../../lib/Panel';
import { ListingsTable, type ListingRowData } from '../overview/ListingsTable';
import { SellerShell } from '../shell/SellerShell';
import { PageTitle } from './PageTitle';

function Listings({ shop }: { shop: MyShop }) {
  const listings = useMyListings(shop.id);
  const insights = useShopInsights(shop.id, 30);
  const figures = new Map(insights.data?.listings.map((l) => [l.listingId, l]) ?? []);
  const rows: ListingRowData[] = (listings.data ?? [])
    .filter((l) => l.status !== 'removed')
    .map((l) => ({
      ...l,
      views: figures.get(l.id)?.views ?? 0,
      whatsapp: figures.get(l.id)?.whatsapp ?? 0,
    }));
  return (
    <>
      <PageTitle title="Listings" sub="Views and WhatsApp chats over the last 30 days" />
      <Panel p={5}>
        {listings.isPending ? (
          <KlozSkeleton height={200} />
        ) : rows.length === 0 ? (
          <>
            <KlozText tone="secondary">
              Nothing listed yet. What you add shows to buyers nearby straight away.
            </KlozText>
            <KlozButton leading="plus" href={`/sell/${shop.id}/new`}>
              Add listing
            </KlozButton>
          </>
        ) : (
          <ListingsTable rows={rows} />
        )}
      </Panel>
    </>
  );
}

export function ListingsPage({ shopId }: { shopId: string }) {
  return (
    <SellerShell shopId={shopId} active="listings">
      {(shop) => <Listings shop={shop} />}
    </SellerShell>
  );
}
