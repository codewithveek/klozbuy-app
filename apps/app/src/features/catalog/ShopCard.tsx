import type { ListingDetail } from '@klozbuy/contracts';
import { describeHours } from '@klozbuy/shared';
import {
  avatarTone,
  KlozAvatar,
  KlozBadge,
  KlozButton,
  KlozIcon,
  KlozText,
  KlozView,
  createStyles,
} from '@klozbuy/ui';
import { formatDistance } from '../../lib/format';
import { Panel } from '../../lib/Panel';
import { RadiusMap } from '../discovery/RadiusMap';
import { VerifiedMark } from '../discovery/ShopLine';
import { useBuyerLocation } from '../location/LocationProvider';
import { useDistanceTo } from '../location/use-distance';
import { useSaved } from '../saved/SavedProvider';
import { walkingMinutes } from './listing-facts';

type Shop = ListingDetail['shop'];

const useStyles = createStyles((t) => ({
  stats: {
    paddingVertical: t.spacing[3],
    borderTopWidth: t.stroke.hairline,
    borderBottomWidth: t.stroke.hairline,
    borderColor: t.colors.borderDefault,
  },
  map: { borderRadius: t.radius.md, overflow: 'hidden' },
}));

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <KlozView flex={1} align="center" gap={0.5}>
      <KlozText variant="title-3">{value}</KlozText>
      <KlozText variant="caption" tone="secondary" align="center">
        {label}
      </KlozText>
    </KlozView>
  );
}

function Stats({ shop, km }: { shop: Shop; km: number | null }) {
  const styles = useStyles();
  const rated = shop.ratingAvg !== null && shop.ratingCount > 0;
  return (
    <KlozView row style={styles.stats}>
      <Stat
        value={rated ? (shop.ratingAvg ?? 0).toFixed(1) : 'New'}
        label={rated ? `${shop.ratingCount} reviews` : 'No reviews yet'}
      />
      <Stat value={String(shop.activeListings)} label="Items listed" />
      <Stat value={km === null ? '–' : formatDistance(km)} label="From you" />
    </KlozView>
  );
}

function Where({ shop, km }: { shop: Shop; km: number | null }) {
  const styles = useStyles();
  const { location } = useBuyerLocation();
  const hours = describeHours(shop.hours, new Date());
  return (
    <KlozView gap={2}>
      {hours && (
        <KlozView row align="center" gap={2}>
          <KlozIcon name="clock" size={16} tone="secondary" />
          <KlozText variant="body-sm">{hours}</KlozText>
        </KlozView>
      )}
      {shop.location && (
        <KlozView row align="start" gap={2}>
          <KlozIcon name="pin" size={16} tone="secondary" />
          <KlozView flex={1}>
            <KlozText variant="body-sm">{shop.location.address ?? shop.location.landmark}</KlozText>
          </KlozView>
        </KlozView>
      )}
      {shop.location && km !== null && (
        <KlozView gap={1}>
          <KlozView style={styles.map}>
            <RadiusMap
              centre={location}
              radiusKm={Math.max(1, Math.ceil(km))}
              pins={[{ key: shop.id, label: shop.name, ...shop.location }]}
            />
          </KlozView>
          <KlozText
            variant="caption"
            tone="secondary"
          >{`About ${walkingMinutes(km)} minutes on foot`}</KlozText>
        </KlozView>
      )}
    </KlozView>
  );
}

/** Who sells it: checked or not, how they're rated, when they're open and where. */
export function ShopCard({ shop, category }: { shop: Shop; category: string }) {
  const saved = useSaved();
  const km = useDistanceTo(shop.location);
  const area = shop.location?.areaName;
  return (
    <Panel p={5} gap={4}>
      <KlozView row align="center" gap={3}>
        <KlozAvatar name={shop.name} size="xl" tone={avatarTone(shop.name)} />
        <KlozView flex={1}>
          <KlozView row align="center" gap={1}>
            <KlozText variant="title-3" level={2}>
              {shop.name}
            </KlozText>
            <VerifiedMark verified={shop.verified} />
          </KlozView>
          <KlozText variant="body-sm" tone="secondary">
            {area ? `${category} · ${area}` : category}
          </KlozText>
        </KlozView>
      </KlozView>
      {shop.verified ? (
        <KlozBadge tone="brand" icon="shield-check">
          Checked in person
        </KlozBadge>
      ) : (
        <KlozBadge>Not yet visited by Klozbuy</KlozBadge>
      )}
      <Stats shop={shop} km={km} />
      <Where shop={shop} km={km} />
      <KlozView row gap={2}>
        <KlozButton grow variant="outline" href={`/s/${shop.slug}`}>
          View shop
        </KlozButton>
        <KlozButton
          grow
          variant="outline"
          onPress={() => saved.toggleShop({ slug: shop.slug, name: shop.name })}
        >
          {saved.isShopSaved(shop.slug) ? 'Saved' : 'Save shop'}
        </KlozButton>
      </KlozView>
    </Panel>
  );
}
