import type { FeedItem } from '@klozbuy/contracts';
import {
  createStyles,
  KlozBadge,
  KlozButton,
  KlozIcon,
  KlozIconButton,
  KlozPrice,
  KlozTap,
  KlozText,
  KlozView,
} from '@klozbuy/ui';
import { formatDistance } from '../../lib/format';
import { goUrl } from '../../lib/links';
import { useSaved } from '../saved/SavedProvider';
import { ShopLine } from './ShopLine';

const useStyles = createStyles((t) => ({
  card: {
    height: '100%',
    backgroundColor: t.colors.bgSurface,
    borderWidth: t.stroke.hairline,
    borderColor: t.colors.borderDefault,
    borderRadius: t.radius.lg,
    overflow: 'hidden',
  },
  media: {
    position: 'relative',
    backgroundColor: t.colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  distance: {
    position: 'absolute',
    left: t.spacing[3],
    top: t.spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[1],
    paddingLeft: t.spacing[2],
    paddingRight: t.spacing[2] + 2,
    paddingVertical: t.spacing[1],
    borderRadius: t.radius.full,
    backgroundColor: t.colors.bgSurface,
  },
  heart: { position: 'absolute', right: t.spacing[2] + 2, top: t.spacing[2] + 2 },
  body: { flex: 1, minWidth: 0, gap: t.spacing[2] + 2 },
  actions: { marginTop: 'auto' },
  phoneDistance: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.bgSurface,
  },
}));

/** The photo box: the distance badge over it and the heart in the corner, as in the mockups. */
function Media({ item }: { item: FeedItem }) {
  const styles = useStyles();
  const saved = useSaved();
  const isSaved = saved.isListingSaved(item.slug);
  const snapshot = {
    slug: item.slug,
    title: item.title,
    priceNgn: item.priceNgn,
    shopName: item.shop.name,
  };
  return (
    <KlozView style={styles.media} responsive="card-media-md">
      <KlozTap href={`/l/${item.slug}`} accessibilityLabel={item.title}>
        <KlozIcon name={item.type === 'service' ? 'wrench' : 'tag'} size={48} tone="tertiary" />
      </KlozTap>
      <KlozView style={styles.distance} responsive="show-from-md">
        <KlozIcon name="pin" size={14} tone="brand" />
        <KlozText variant="caption">{formatDistance(item.distanceKm)}</KlozText>
      </KlozView>
      <KlozView style={styles.phoneDistance} responsive="show-below-md">
        <KlozText variant="caption">{formatDistance(item.distanceKm)}</KlozText>
      </KlozView>
      <KlozView style={styles.heart} responsive="show-from-md">
        <KlozIconButton
          icon="heart"
          label={isSaved ? 'Remove from saved' : 'Save listing'}
          variant="surface"
          shape="circle"
          size="sm"
          pressed={isSaved}
          onPress={() => saved.toggleListing(snapshot)}
        />
      </KlozView>
    </KlozView>
  );
}

function Actions({ item }: { item: FeedItem }) {
  const styles = useStyles();
  return (
    <KlozView row gap={2} style={styles.actions}>
      <KlozButton grow leading="chat" href={goUrl('whatsapp', item.listingId, item.distanceKm)}>
        WhatsApp
      </KlozButton>
      <KlozIconButton
        icon="phone"
        label={`Call ${item.shop.name}`}
        href={goUrl('call', item.listingId, item.distanceKm)}
      />
      <KlozView responsive="show-from-md">
        <KlozIconButton
          icon="navigate"
          label={`Directions to ${item.shop.name}`}
          href={goUrl('directions', item.listingId, item.distanceKm)}
        />
      </KlozView>
    </KlozView>
  );
}

/** One listing in the near-me feed: a photo card on wide screens, a row on phones. */
export function FeedCard({ item }: { item: FeedItem }) {
  const styles = useStyles();
  return (
    <KlozView as="article" style={styles.card} responsive="card-md">
      <Media item={item} />
      <KlozView style={styles.body} responsive="card-body-md">
        <KlozView>
          <KlozTap href={`/l/${item.slug}`}>
            <KlozText variant="title-3" level={3} numberOfLines={2}>
              {item.title}
            </KlozText>
          </KlozTap>
          {item.summary && (
            <KlozView responsive="show-from-md">
              <KlozText variant="body-sm" tone="secondary" numberOfLines={1}>
                {item.summary}
              </KlozText>
            </KlozView>
          )}
        </KlozView>
        <KlozView row align="center" gap={2}>
          <KlozPrice amount={item.priceNgn} />
          {item.negotiable && <KlozBadge tone="warning">Negotiable</KlozBadge>}
        </KlozView>
        <ShopLine shop={item.shop} hours={item.hours} />
        <KlozView responsive="show-from-md">
          <KlozText variant="body-sm" tone="secondary" numberOfLines={1}>
            {item.landmark}
          </KlozText>
        </KlozView>
        <Actions item={item} />
      </KlozView>
    </KlozView>
  );
}
