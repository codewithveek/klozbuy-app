import {
  avatarTone,
  KlozAvatar,
  KlozButton,
  KlozIconButton,
  KlozPrice,
  KlozTap,
  KlozText,
  KlozView,
} from '@klozbuy/ui';
import { Panel, SectionHeading } from '../../lib/Panel';
import { BuyerShell } from '../shell/BuyerShell';
import { useSaved, type SavedListing, type SavedShop } from './SavedProvider';

function ListingRow({ listing, onRemove }: { listing: SavedListing; onRemove: () => void }) {
  return (
    <KlozView row align="center" gap={3}>
      <KlozTap href={`/l/${listing.slug}`} style={{ flex: 1 }}>
        <KlozText variant="body-strong">{listing.title}</KlozText>
        <KlozView row gap={2} align="center">
          <KlozPrice amount={listing.priceNgn} />
          <KlozText variant="body-sm" tone="secondary">
            {listing.shopName}
          </KlozText>
        </KlozView>
      </KlozTap>
      <KlozIconButton icon="x" label={`Remove ${listing.title}`} onPress={onRemove} />
    </KlozView>
  );
}

function ShopRow({ shop, onRemove }: { shop: SavedShop; onRemove: () => void }) {
  return (
    <KlozView row align="center" gap={3}>
      <KlozAvatar name={shop.name} tone={avatarTone(shop.name)} />
      <KlozTap href={`/s/${shop.slug}`} style={{ flex: 1 }}>
        <KlozText variant="body-strong">{shop.name}</KlozText>
      </KlozTap>
      <KlozIconButton icon="x" label={`Remove ${shop.name}`} onPress={onRemove} />
    </KlozView>
  );
}

/** Hearted listings and saved shops, kept on this device. */
export function SavedScreen() {
  const saved = useSaved();
  const empty = saved.listings.length === 0 && saved.shops.length === 0;
  return (
    <BuyerShell active="saved">
      <KlozView gap={1}>
        <KlozText variant="title-1" level={1}>
          Saved
        </KlozText>
        <KlozText variant="body-sm" tone="secondary">
          Kept on this device. Prices may have changed since you saved them.
        </KlozText>
      </KlozView>
      {empty && (
        <Panel p={5}>
          <SectionHeading
            title="Nothing saved yet"
            sub="Tap the heart on a listing, or Save shop on a shop page."
          />
          <KlozButton variant="outline" href="/">
            See what’s near you
          </KlozButton>
        </Panel>
      )}
      {saved.listings.length > 0 && (
        <Panel p={5}>
          <SectionHeading title="Listings" />
          {saved.listings.map((listing) => (
            <ListingRow
              key={listing.slug}
              listing={listing}
              onRemove={() => saved.toggleListing(listing)}
            />
          ))}
        </Panel>
      )}
      {saved.shops.length > 0 && (
        <Panel p={5}>
          <SectionHeading title="Shops" />
          {saved.shops.map((shop) => (
            <ShopRow key={shop.slug} shop={shop} onRemove={() => saved.toggleShop(shop)} />
          ))}
        </Panel>
      )}
    </BuyerShell>
  );
}
