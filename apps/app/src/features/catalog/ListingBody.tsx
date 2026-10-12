import { useShopListings } from '@klozbuy/api-client';
import type { ListingDetail } from '@klozbuy/contracts';
import {
  createStyles,
  KlozGrid,
  KlozIcon,
  KlozPrice,
  KlozTap,
  KlozText,
  KlozView,
} from '@klozbuy/ui';
import { formatDistance } from '../../lib/format';
import { Panel, SectionHeading } from '../../lib/Panel';
import { useDistanceTo } from '../location/use-distance';
import { detailRows } from './listing-facts';

const useStyles = createStyles((t) => ({
  photo: {
    aspectRatio: 16 / 10,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    left: t.spacing[3] + 2,
    top: t.spacing[3] + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[1],
    paddingLeft: t.spacing[2] + 1,
    paddingRight: t.spacing[3],
    paddingVertical: t.spacing[1] + 1,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.bgSurface,
  },
  row: {
    flexGrow: 1,
    flexBasis: '40%',
    minWidth: 220,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: t.spacing[3],
    paddingBottom: t.spacing[3],
    borderBottomWidth: t.stroke.hairline,
    borderBottomColor: t.colors.borderDefault,
  },
  thumb: {
    aspectRatio: 1,
    backgroundColor: t.colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mini: {
    backgroundColor: t.colors.bgSurface,
    borderWidth: t.stroke.hairline,
    borderColor: t.colors.borderDefault,
    borderRadius: t.radius.lg,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
}));

export function ListingPhoto({ listing }: { listing: ListingDetail }) {
  const styles = useStyles();
  const km = useDistanceTo(listing.shop.location);
  return (
    <Panel p={3}>
      <KlozView style={styles.photo}>
        <KlozIcon name={listing.type === 'service' ? 'wrench' : 'tag'} size={48} tone="tertiary" />
        <KlozText variant="caption" tone="tertiary">
          No photos yet
        </KlozText>
        {km !== null && (
          <KlozView style={styles.badge}>
            <KlozIcon name="pin" size={14} tone="brand" />
            <KlozText variant="caption">{`${formatDistance(km)} away`}</KlozText>
          </KlozView>
        )}
      </KlozView>
    </Panel>
  );
}

export function ListingDetails({ listing }: { listing: ListingDetail }) {
  const styles = useStyles();
  return (
    <Panel p={5} gap={4}>
      <SectionHeading title="Details" size="title-2" />
      <KlozView row wrap gap={3}>
        {detailRows(listing, new Date()).map(([label, value]) => (
          <KlozView key={label} style={styles.row}>
            <KlozText variant="body-sm" tone="secondary">
              {label}
            </KlozText>
            <KlozText variant="body-sm">{value}</KlozText>
          </KlozView>
        ))}
      </KlozView>
      {listing.description && (
        <KlozView gap={1}>
          <KlozText variant="label" level={3}>
            From the seller
          </KlozText>
          <KlozText>{listing.description}</KlozText>
        </KlozView>
      )}
    </Panel>
  );
}

/** Reviews aren't open yet; say so rather than show an empty score. */
export function ShopReviews({ shopName }: { shopName: string }) {
  return (
    <Panel p={5}>
      <SectionHeading title={`Reviews of ${shopName}`} size="title-2" />
      <KlozText tone="secondary">
        No reviews yet. Reviews will come only from buyers who confirmed they bought here.
      </KlozText>
    </Panel>
  );
}

export function MoreFromShop({ listing }: { listing: ListingDetail }) {
  const styles = useStyles();
  const more = useShopListings(listing.shop.slug);
  const others = (more.data ?? []).filter((l) => l.id !== listing.id).slice(0, 4);
  if (others.length === 0) return null;
  return (
    <KlozView as="section" gap={3}>
      <SectionHeading
        title={`More from ${listing.shop.name}`}
        size="title-2"
        link={{ label: 'View shop', href: `/s/${listing.shop.slug}` }}
      />
      <KlozGrid min={160}>
        {others.map((other) => (
          <KlozTap key={other.id} href={`/l/${other.slug}`} style={styles.mini}>
            <KlozView style={styles.thumb}>
              <KlozIcon
                name={other.type === 'service' ? 'wrench' : 'tag'}
                size={24}
                tone="tertiary"
              />
            </KlozView>
            <KlozView p={3} gap={0.5}>
              <KlozText variant="body-sm" numberOfLines={1}>
                {other.title}
              </KlozText>
              <KlozPrice amount={other.priceNgn} />
            </KlozView>
          </KlozTap>
        ))}
      </KlozGrid>
    </KlozView>
  );
}
