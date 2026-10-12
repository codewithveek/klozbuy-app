import { useAreas } from '@klozbuy/api-client';
import type { Area } from '@klozbuy/contracts';
import { haversineKm } from '@klozbuy/shared';
import { KlozButton, KlozGrid, KlozIcon, KlozSkeleton, KlozText, KlozView } from '@klozbuy/ui';
import { router } from 'expo-router';
import { formatDistance } from '../../lib/format';
import { Panel } from '../../lib/Panel';
import { useBuyerLocation } from '../location/LocationProvider';
import { BuyerShell } from '../shell/BuyerShell';

function MarketCard({ market, km }: { market: Area; km: number }) {
  const { chooseArea, setRadius } = useBuyerLocation();
  const browse = () => {
    chooseArea(market);
    setRadius(1);
    router.push('/');
  };
  return (
    <Panel>
      <KlozView row align="start" gap={3}>
        <KlozIcon name="market" tone="brand" size={24} />
        <KlozView flex={1} gap={0.5}>
          <KlozText variant="title-3" level={2}>
            {market.name}
          </KlozText>
          <KlozText variant="body-sm" tone="secondary">
            {`${formatDistance(km)} away · ${market.city}`}
          </KlozText>
        </KlozView>
      </KlozView>
      {market.description && <KlozText variant="body-sm">{market.description}</KlozText>}
      <KlozButton variant="outline" fullWidth onPress={browse} trailing="chevron-right">
        See what’s in stock here
      </KlozButton>
    </Panel>
  );
}

/** The big markets, nearest first. Opening one centres the feed on it. */
export function MarketsScreen() {
  const areas = useAreas();
  const { location } = useBuyerLocation();
  const markets = (areas.data ?? [])
    .filter((area) => area.kind === 'market')
    .map((market) => ({ market, km: haversineKm(location, market) }))
    .sort((a, b) => a.km - b.km);
  return (
    <BuyerShell active="markets">
      <KlozView gap={1}>
        <KlozText variant="title-1" level={1}>
          Markets near you
        </KlozText>
        <KlozText variant="body-sm" tone="secondary">
          Pick a market to see what its shops have listed, within 1 km of it.
        </KlozText>
      </KlozView>
      {areas.isPending ? (
        <KlozSkeleton height={160} />
      ) : (
        <KlozGrid min={280} list>
          {markets.map(({ market, km }) => (
            <MarketCard key={market.id} market={market} km={km} />
          ))}
        </KlozGrid>
      )}
    </BuyerShell>
  );
}
