import type { ListingDetail } from '@klozbuy/contracts';
import { listingMessage } from '@klozbuy/shared';
import {
  createStyles,
  KlozBadge,
  KlozButton,
  KlozIcon,
  KlozPrice,
  KlozText,
  KlozView,
} from '@klozbuy/ui';
import { Share } from 'react-native';
import { SITE_URL } from '../../lib/config';
import { formatDistance } from '../../lib/format';
import { goUrl } from '../../lib/links';
import { Panel } from '../../lib/Panel';
import { useDistanceTo } from '../location/use-distance';
import { useSaved } from '../saved/SavedProvider';
import { listingSubtitle, stockSentence } from './listing-facts';

const useStyles = createStyles((t) => ({
  dot: { width: 8, height: 8, marginHorizontal: 4, borderRadius: t.radius.full },
  inStock: { backgroundColor: t.colors.actionPrimary },
  low: { backgroundColor: t.colors.warningFg },
  preview: { backgroundColor: t.colors.bgCanvas, borderRadius: t.radius.md },
  bubble: {
    alignSelf: 'flex-start',
    maxWidth: '94%',
    paddingHorizontal: t.spacing[3],
    paddingVertical: t.spacing[2] + 2,
    borderWidth: t.stroke.hairline,
    borderColor: t.colors.borderDefault,
    borderRadius: t.radius.md,
    borderBottomLeftRadius: 4,
    backgroundColor: t.colors.bgSurface,
  },
}));

/** The WhatsApp message the buyer will send, shown before they tap. */
function MessagePreview({ listing, url }: { listing: ListingDetail; url: string }) {
  const styles = useStyles();
  const message = listingMessage({
    shopName: listing.shop.name,
    title: listing.title,
    priceNgn: listing.priceNgn,
    url,
  });
  return (
    <KlozView p={3} gap={2} style={styles.preview}>
      <KlozText variant="caption" tone="secondary">
        Opens WhatsApp with this message ready to send
      </KlozText>
      <KlozView style={styles.bubble}>
        <KlozText variant="body-sm">{message}</KlozText>
      </KlozView>
    </KlozView>
  );
}

function Facts({ listing }: { listing: ListingDetail }) {
  const styles = useStyles();
  const km = useDistanceTo(listing.shop.location);
  return (
    <KlozView gap={2}>
      <KlozView row align="center" gap={2}>
        <KlozView
          style={[styles.dot, listing.stockStatus === 'in_stock' ? styles.inStock : styles.low]}
        />
        <KlozText variant="body-sm">{stockSentence(listing, new Date())}</KlozText>
      </KlozView>
      {km !== null && listing.shop.location && (
        <KlozView row align="center" gap={2}>
          <KlozIcon name="pin" size={16} tone="secondary" />
          <KlozView flex={1}>
            <KlozText variant="body-sm">{`${formatDistance(km)} away · ${listing.shop.location.landmark}`}</KlozText>
          </KlozView>
        </KlozView>
      )}
    </KlozView>
  );
}

function SecondaryActions({
  listing,
  url,
  km,
}: {
  listing: ListingDetail;
  url: string;
  km: number | null;
}) {
  const saved = useSaved();
  const isSaved = saved.isListingSaved(listing.slug);
  const d = km ?? undefined;
  return (
    <KlozView gap={2}>
      <KlozView row gap={2}>
        <KlozButton grow variant="outline" leading="phone" href={goUrl('call', listing.id, d)}>
          Call
        </KlozButton>
        <KlozButton
          grow
          variant="outline"
          leading="navigate"
          disabled={!listing.shop.location}
          href={goUrl('directions', listing.id, d)}
        >
          Directions
        </KlozButton>
      </KlozView>
      <KlozView row gap={2}>
        <KlozButton
          grow
          variant="outline"
          leading="heart"
          onPress={() =>
            saved.toggleListing({
              slug: listing.slug,
              title: listing.title,
              priceNgn: listing.priceNgn,
              shopName: listing.shop.name,
            })
          }
        >
          {isSaved ? 'Saved' : 'Save'}
        </KlozButton>
        <KlozButton
          grow
          variant="outline"
          leading="share"
          onPress={() => void Share.share({ message: `${listing.title} on Klozbuy: ${url}`, url })}
        >
          Share
        </KlozButton>
      </KlozView>
    </KlozView>
  );
}

/** The right-hand box: what it is, what it costs, whether it's there, and how to get it. */
export function BuyBox({ listing }: { listing: ListingDetail }) {
  const url = `${SITE_URL}/l/${listing.slug}`;
  const km = useDistanceTo(listing.shop.location);
  const sold = listing.status !== 'active';
  return (
    <Panel p={5} gap={4}>
      <KlozView gap={1}>
        <KlozText variant="title-1" level={1}>
          {listing.title}
        </KlozText>
        <KlozText variant="body-sm" tone="secondary">
          {listingSubtitle(listing)}
        </KlozText>
      </KlozView>
      <KlozView row align="center" gap={2}>
        <KlozPrice amount={listing.priceNgn} size="lg" />
        {listing.negotiable && <KlozBadge tone="warning">Negotiable</KlozBadge>}
      </KlozView>
      {sold ? (
        <KlozBadge tone="inverse" icon="check-circle">
          This item has sold
        </KlozBadge>
      ) : (
        <>
          <Facts listing={listing} />
          <KlozButton
            size="lg"
            fullWidth
            leading="chat"
            href={goUrl('whatsapp', listing.id, km ?? undefined)}
            testID="chat-whatsapp"
          >
            Chat on WhatsApp
          </KlozButton>
          <MessagePreview listing={listing} url={url} />
          <SecondaryActions listing={listing} url={url} km={km} />
        </>
      )}
    </Panel>
  );
}
