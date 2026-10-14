import type { FeedItem } from '@klozbuy/contracts';
import { describeHours, formatNaira, toNaira } from '@klozbuy/shared';
import {
  avatarTone,
  KlozAvatar,
  KlozBadge,
  KlozButton,
  KlozIcon,
  KlozTap,
  KlozText,
  KlozView,
} from '@klozbuy/ui';
import { formatDistance } from '../../lib/format';
import { goUrl } from '../../lib/links';
import { Panel } from '../../lib/Panel';

/** A service provider nearby: who, what, how far, whether we checked them, and how to reach them. */
export function ServiceCard({ item }: { item: FeedItem }) {
  const { shop } = item;
  const hours = describeHours(item.hours, new Date());
  return (
    <Panel>
      <KlozView row align="center" gap={3}>
        <KlozAvatar name={shop.name} size="lg" tone={avatarTone(shop.name)} />
        <KlozView flex={1}>
          <KlozTap href={`/l/${item.slug}`}>
            <KlozText variant="title-3" level={3} numberOfLines={1}>
              {shop.name}
            </KlozText>
          </KlozTap>
          <KlozText variant="body-sm" tone="secondary" numberOfLines={1}>
            {`${item.title} · ${formatDistance(item.distanceKm)}`}
          </KlozText>
        </KlozView>
      </KlozView>
      <KlozView row wrap gap={1}>
        {shop.verified && (
          <KlozBadge tone="brand" icon="shield-check">
            Checked in person
          </KlozBadge>
        )}
        {shop.ratingAvg !== null && shop.ratingCount > 0 && (
          <KlozBadge icon="star">{`${shop.ratingAvg.toFixed(1)} (${shop.ratingCount})`}</KlozBadge>
        )}
      </KlozView>
      <KlozView gap={0.5}>
        {hours && (
          <KlozView row align="center" gap={1}>
            <KlozIcon name="clock" size={16} tone="secondary" />
            <KlozText variant="body-sm" tone="secondary">
              {hours}
            </KlozText>
          </KlozView>
        )}
        <KlozText variant="body-sm">{`From ${formatNaira(toNaira(item.priceNgn))}`}</KlozText>
      </KlozView>
      <KlozView row gap={2}>
        <KlozButton grow leading="chat" href={goUrl('whatsapp', item.listingId, item.distanceKm)}>
          WhatsApp
        </KlozButton>
        <KlozButton
          grow
          variant="outline"
          leading="phone"
          href={goUrl('call', item.listingId, item.distanceKm)}
        >
          Call
        </KlozButton>
      </KlozView>
    </Panel>
  );
}
