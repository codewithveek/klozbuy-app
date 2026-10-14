import type { Listing } from '@klozbuy/contracts';
import {
  createStyles,
  KlozBadge,
  KlozButton,
  KlozIcon,
  KlozPrice,
  KlozTap,
  KlozText,
  KlozView,
} from '@klozbuy/ui';
import { CONDITION_LABELS } from '../../lib/format';
import { goUrl } from '../../lib/links';

const useStyles = createStyles((t) => ({
  card: {
    height: '100%',
    backgroundColor: t.colors.bgSurface,
    borderWidth: t.stroke.hairline,
    borderColor: t.colors.borderDefault,
    borderRadius: t.radius.lg,
    overflow: 'hidden',
  },
  photo: {
    aspectRatio: 4 / 3,
    backgroundColor: t.colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { marginTop: 'auto' },
}));

/** A listing on its shop's page: no distance or shop line, those are on the page already. */
export function ShopListingCard({ listing }: { listing: Listing }) {
  const styles = useStyles();
  return (
    <KlozView as="article" style={styles.card}>
      <KlozTap href={`/l/${listing.slug}`} accessibilityLabel={listing.title} style={styles.photo}>
        <KlozIcon name={listing.type === 'service' ? 'wrench' : 'tag'} size={48} tone="tertiary" />
      </KlozTap>
      <KlozView p={4} gap={2} flex={1}>
        <KlozTap href={`/l/${listing.slug}`}>
          <KlozText variant="title-3" level={3} numberOfLines={2}>
            {listing.title}
          </KlozText>
        </KlozTap>
        <KlozView row align="center" gap={2} wrap>
          <KlozPrice amount={listing.priceNgn} />
          {listing.negotiable && <KlozBadge tone="warning">Negotiable</KlozBadge>}
          {listing.condition && <KlozBadge>{CONDITION_LABELS[listing.condition]}</KlozBadge>}
        </KlozView>
        <KlozView style={styles.actions}>
          <KlozButton fullWidth leading="chat" href={goUrl('whatsapp', listing.id)}>
            WhatsApp
          </KlozButton>
        </KlozView>
      </KlozView>
    </KlozView>
  );
}
