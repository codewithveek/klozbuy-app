import { useShop, useShopListings } from '@klozbuy/api-client';
import type { Listing, ShopPublic } from '@klozbuy/contracts';
import { KlozBadge, KlozButton, KlozIcon, KlozText, KlozView } from '@klozbuy/ui';
import { AppHeader } from '../../lib/AppHeader';
import { SITE_URL } from '../../lib/config';
import { verifiedLine } from '../../lib/format';
import { mapsUrl } from '../../lib/links';
import { NotFound } from '../../lib/NotFound';
import { Page } from '../../lib/Page';
import { JsonLd } from '../catalog/JsonLd';
import { shopJsonLd } from '../catalog/seo';
import { fromListing } from '../discovery/feed-items';
import { EmptyState, ListingGrid } from '../discovery/ListingGrid';
import { HeaderActions } from '../identity/HeaderActions';

function ShopHeader({ shop }: { shop: ShopPublic }) {
  return (
    <KlozView as="header" gap={3} p={5} bg="surface" radius="lg" border>
      <KlozText variant="title-1" level={1}>
        {shop.name}
      </KlozText>
      {shop.verified ? (
        <KlozBadge tone="brand" icon="shield-check">
          {verifiedLine(shop.verifiedAt)}
        </KlozBadge>
      ) : (
        <KlozBadge>Not yet visited by our team</KlozBadge>
      )}
      {shop.description && <KlozText tone="secondary">{shop.description}</KlozText>}
      {shop.location && (
        <KlozView row gap={2} align="center" wrap>
          <KlozIcon name="pin" size={16} tone="secondary" />
          <KlozText variant="body-sm" tone="secondary">
            {shop.location.landmark}
          </KlozText>
          <KlozButton
            variant="ghost"
            size="sm"
            leading="navigate"
            href={mapsUrl(shop.location.lat, shop.location.lng)}
          >
            Directions
          </KlozButton>
        </KlozView>
      )}
    </KlozView>
  );
}

export function ShopScreen({
  slug,
  initial,
}: {
  slug: string;
  initial?: { shop: ShopPublic | null; listings: Listing[] };
}) {
  const shop = useShop(slug, initial?.shop ?? undefined);
  const listings = useShopListings(slug, initial?.listings);
  if (shop.isPending) return <Page header={<AppHeader actions={<HeaderActions />} />}>{null}</Page>;
  if (!shop.data)
    return (
      <NotFound title="This shop is not here" body="It may have closed or changed its name." />
    );
  const now = new Date();
  return (
    <Page header={<AppHeader actions={<HeaderActions />} />}>
      <JsonLd data={shopJsonLd(shop.data, `${SITE_URL}/s/${shop.data.slug}`)} />
      <KlozView gap={6} py={2}>
        <ShopHeader shop={shop.data} />
        <KlozText variant="title-2" level={2}>
          In this shop
        </KlozText>
        <ListingGrid
          items={(listings.data ?? []).map((listing) => fromListing(listing, now))}
          loading={listings.isPending}
          empty={<EmptyState title="Nothing listed yet" body="This shop hasn't added any items." />}
        />
      </KlozView>
    </Page>
  );
}
