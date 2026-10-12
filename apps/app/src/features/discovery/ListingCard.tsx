import type { Listing } from '@klozbuy/contracts';
import {
  createStyles,
  KlozBadge,
  KlozIcon,
  KlozPrice,
  KlozTap,
  KlozText,
  KlozView,
} from '@klozbuy/ui';
import { CONDITION_LABELS } from '../../lib/format';

export interface ListingCardData {
  slug: string;
  title: string;
  priceNgn: number;
  negotiable: boolean;
  condition: Listing['condition'];
  type: Listing['type'];
  /** "0.6 km · Tejuosho Market" in the feed; stock in a shop page. */
  meta?: string;
  shop?: { name: string; verified: boolean };
}

const useStyles = createStyles((t) => ({
  // Two columns on phones, four to six on wider screens, without measuring the window.
  card: {
    flexGrow: 1,
    flexBasis: 165,
    maxWidth: 200,
    justifyContent: 'flex-start',
    backgroundColor: t.colors.bgSurface,
    borderRadius: t.radius.lg,
    borderWidth: t.stroke.hairline,
    borderColor: t.colors.borderDefault,
    overflow: 'hidden',
  },
  hovered: { borderColor: t.colors.borderStrong },
  photo: {
    aspectRatio: 4 / 3,
    backgroundColor: t.colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

/** One listing in a grid: the facts a buyer decides on, nothing else. */
export function ListingCard({ listing }: { listing: ListingCardData }) {
  const styles = useStyles();
  return (
    <KlozTap
      href={`/l/${listing.slug}`}
      style={({ hovered }) => [styles.card, hovered && styles.hovered]}
    >
      <KlozView style={styles.photo}>
        <KlozIcon name={listing.type === 'service' ? 'wrench' : 'tag'} size={24} tone="tertiary" />
      </KlozView>
      <KlozView p={3} gap={2}>
        <KlozText variant="title-3" level={2} numberOfLines={2}>
          {listing.title}
        </KlozText>
        <KlozPrice amount={listing.priceNgn} />
        <KlozView row gap={1} wrap>
          {listing.negotiable && <KlozBadge tone="warning">Negotiable</KlozBadge>}
          {listing.condition && <KlozBadge>{CONDITION_LABELS[listing.condition]}</KlozBadge>}
        </KlozView>
        {listing.meta && (
          <KlozText variant="body-sm" tone="secondary" numberOfLines={1}>
            {listing.meta}
          </KlozText>
        )}
        {listing.shop && (
          <KlozView row align="center" gap={1}>
            <KlozText variant="body-sm" numberOfLines={1}>
              {listing.shop.name}
            </KlozText>
            {listing.shop.verified && (
              <KlozIcon name="shield-check" size={16} tone="brand" label="Verified shop" />
            )}
          </KlozView>
        )}
      </KlozView>
    </KlozTap>
  );
}
