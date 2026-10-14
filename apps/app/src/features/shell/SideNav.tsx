import { useAreas, useMe, useMyRequests } from '@klozbuy/api-client';
import type { Area } from '@klozbuy/contracts';
import { haversineKm } from '@klozbuy/shared';
import { createStyles, KlozIcon, KlozTap, KlozText, KlozView } from '@klozbuy/ui';
import { router } from 'expo-router';
import { formatDistance } from '../../lib/format';
import { useBuyerLocation } from '../location/LocationProvider';
import { SIDE_NAV, type BuyerSection, type NavItem } from './nav-items';

const useStyles = createStyles((t) => ({
  card: {
    backgroundColor: t.colors.bgSurface,
    borderWidth: t.stroke.hairline,
    borderColor: t.colors.borderDefault,
    borderRadius: t.radius.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: t.spacing[3],
    paddingHorizontal: t.spacing[3],
    borderRadius: t.radius.md,
  },
  hovered: { backgroundColor: t.colors.bgSubtle },
  current: { backgroundColor: t.colors.bgBrandSubtle },
  count: {
    marginLeft: 'auto',
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.actionPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function NavLink({ item, current, count }: { item: NavItem; current: boolean; count?: number }) {
  const styles = useStyles();
  const tone = current ? 'brand' : 'primary';
  return (
    <KlozTap
      href={item.href}
      style={({ hovered }) => [styles.item, current ? styles.current : hovered && styles.hovered]}
    >
      <KlozIcon name={item.icon} tone={tone} />
      <KlozText variant={current ? 'body-strong' : 'body'} tone={tone}>
        {item.label}
      </KlozText>
      {!!count && (
        <KlozView style={styles.count}>
          <KlozText variant="caption" tone="on-action">
            {String(count)}
          </KlozText>
        </KlozView>
      )}
    </KlozTap>
  );
}

/** How many of the buyer's open requests have offers waiting. */
function useOfferCount(): number {
  const me = useMe();
  const requests = useMyRequests(!!me.data);
  return requests.data?.filter((r) => r.status === 'open' && r.offerCount > 0).length ?? 0;
}

function MarketsNearYou() {
  const styles = useStyles();
  const areas = useAreas();
  const { location, chooseArea } = useBuyerLocation();
  const markets = (areas.data ?? [])
    .filter((area) => area.kind === 'market')
    .map((area) => ({ area, km: haversineKm(location, area) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, 3);
  if (markets.length === 0) return null;
  const visit = (area: Area) => {
    chooseArea(area);
    router.push('/');
  };
  return (
    <KlozView as="section" p={4} gap={3} style={styles.card}>
      <KlozText variant="label" level={2}>
        Markets near you
      </KlozText>
      {markets.map(({ area, km }) => (
        <KlozTap
          key={area.id}
          onPress={() => visit(area)}
          accessibilityLabel={`${area.name}, ${formatDistance(km)}`}
        >
          <KlozView row justify="between" align="center" gap={2}>
            <KlozView flex={1}>
              <KlozText variant="body-sm">{area.name}</KlozText>
              {area.description && (
                <KlozText variant="caption" tone="secondary" numberOfLines={1}>
                  {area.description}
                </KlozText>
              )}
            </KlozView>
            <KlozText variant="caption" tone="secondary">
              {formatDistance(km)}
            </KlozText>
          </KlozView>
        </KlozTap>
      ))}
    </KlozView>
  );
}

/** The left column on wide screens: sections, then markets near the buyer. */
export function SideNav({ active }: { active: BuyerSection }) {
  const styles = useStyles();
  const offers = useOfferCount();
  return (
    <KlozView gap={4}>
      <KlozView as="nav" p={2} gap={0.5} style={styles.card}>
        {SIDE_NAV.map((item) => (
          <NavLink
            key={item.key}
            item={item}
            current={item.key === active}
            count={item.key === 'requests' ? offers : undefined}
          />
        ))}
      </KlozView>
      <MarketsNearYou />
    </KlozView>
  );
}
