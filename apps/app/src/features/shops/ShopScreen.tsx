import { useShop, useShopListings } from '@klozbuy/api-client';
import type { Listing, ShopPublic } from '@klozbuy/contracts';
import { describeHours } from '@klozbuy/shared';
import {
  avatarTone,
  KlozAvatar,
  KlozBadge,
  KlozButton,
  KlozGrid,
  KlozIcon,
  KlozSkeleton,
  KlozText,
  KlozView,
} from '@klozbuy/ui';
import { SITE_URL } from '../../lib/config';
import { formatDistance, verifiedLine } from '../../lib/format';
import { mapsUrl } from '../../lib/links';
import { NotFound } from '../../lib/NotFound';
import { Panel, SectionHeading } from '../../lib/Panel';
import { JsonLd } from '../catalog/JsonLd';
import { shopJsonLd } from '../catalog/seo';
import { VerifiedMark } from '../discovery/ShopLine';
import { useDistanceTo } from '../location/use-distance';
import { useSaved } from '../saved/SavedProvider';
import { BuyerShell } from '../shell/BuyerShell';
import { ShopListingCard } from './ShopListingCard';

function InfoLine({ icon, text }: { icon: 'clock' | 'pin'; text: string }) {
  return (
    <KlozView row align="start" gap={2}>
      <KlozIcon name={icon} size={16} tone="secondary" />
      <KlozView flex={1}>
        <KlozText variant="body-sm">{text}</KlozText>
      </KlozView>
    </KlozView>
  );
}

function ShopTitle({ shop }: { shop: ShopPublic }) {
  const km = useDistanceTo(shop.location);
  const where = [shop.location?.areaName, km !== null ? `${formatDistance(km)} from you` : null]
    .filter(Boolean)
    .join(' · ');
  return (
    <KlozView row align="center" gap={3}>
      <KlozAvatar name={shop.name} size="xl" tone={avatarTone(shop.name)} />
      <KlozView flex={1}>
        <KlozView row align="center" gap={1}>
          <KlozText variant="title-1" level={1}>
            {shop.name}
          </KlozText>
          <VerifiedMark verified={shop.verified} />
        </KlozView>
        {where !== '' && (
          <KlozText variant="body-sm" tone="secondary">
            {where}
          </KlozText>
        )}
      </KlozView>
    </KlozView>
  );
}

function ShopActions({ shop }: { shop: ShopPublic }) {
  const saved = useSaved();
  return (
    <KlozView row gap={2} wrap>
      {shop.location && (
        <KlozButton
          variant="outline"
          leading="navigate"
          href={mapsUrl(shop.location.lat, shop.location.lng)}
        >
          Directions
        </KlozButton>
      )}
      <KlozButton
        variant="outline"
        leading="bookmark"
        onPress={() => saved.toggleShop({ slug: shop.slug, name: shop.name })}
      >
        {saved.isShopSaved(shop.slug) ? 'Saved' : 'Save shop'}
      </KlozButton>
    </KlozView>
  );
}

function ShopHeader({ shop }: { shop: ShopPublic }) {
  const hours = describeHours(shop.hours, new Date());
  return (
    <Panel p={5} gap={4}>
      <ShopTitle shop={shop} />
      {shop.verified ? (
        <KlozBadge tone="brand" icon="shield-check">
          {verifiedLine(shop.verifiedAt)}
        </KlozBadge>
      ) : (
        <KlozBadge>Not yet visited by Klozbuy</KlozBadge>
      )}
      {shop.description && <KlozText>{shop.description}</KlozText>}
      {hours && <InfoLine icon="clock" text={hours} />}
      {shop.location && (
        <InfoLine icon="pin" text={shop.location.address ?? shop.location.landmark} />
      )}
      <ShopActions shop={shop} />
    </Panel>
  );
}

function ShopItems({ items, loading }: { items: Listing[]; loading: boolean }) {
  return (
    <>
      <SectionHeading
        title="In this shop"
        size="title-2"
        sub={items.length === 1 ? '1 item' : `${items.length} items`}
      />
      {items.length === 0 && !loading ? (
        <Panel>
          <KlozText tone="secondary">This shop hasn’t listed anything yet.</KlozText>
        </Panel>
      ) : (
        <KlozGrid min={220} list>
          {items.map((listing) => (
            <ShopListingCard key={listing.id} listing={listing} />
          ))}
        </KlozGrid>
      )}
    </>
  );
}

export interface ShopScreenProps {
  slug: string;
  initial?: { shop: ShopPublic | null; listings: Listing[] };
}

/** A shop's public page: who they are, where, when they're open, and everything listed. */
export function ShopScreen({ slug, initial }: ShopScreenProps) {
  const shop = useShop(slug, initial?.shop ?? undefined);
  const listings = useShopListings(slug, initial?.listings);
  if (!shop.isPending && !shop.data) {
    return (
      <NotFound title="This shop is not here" body="It may have closed or changed its name." />
    );
  }
  return (
    <BuyerShell active="near" nav={false}>
      {shop.data ? (
        <>
          <JsonLd data={shopJsonLd(shop.data, `${SITE_URL}/s/${shop.data.slug}`)} />
          <ShopHeader shop={shop.data} />
          <ShopItems items={listings.data ?? []} loading={listings.isPending} />
        </>
      ) : (
        <KlozSkeleton height={240} />
      )}
    </BuyerShell>
  );
}
