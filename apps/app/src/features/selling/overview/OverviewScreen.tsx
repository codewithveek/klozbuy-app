import { useMe, useShopInsights } from '@klozbuy/api-client';
import type { MyShop, ShopInsights } from '@klozbuy/contracts';
import { createStyles, KlozSegmented, KlozSkeleton, KlozText, KlozView } from '@klozbuy/ui';
import { useState } from 'react';
import { Panel, SectionHeading } from '../../../lib/Panel';
import { SellerShell } from '../shell/SellerShell';
import { ChatsChart } from './ChatsChart';
import { DistanceCard } from './DistanceCard';
import { greeting, periodLabel, type Period } from './insight-math';
import { KpiTiles } from './KpiTiles';
import { ListingsTable, type ListingRowData } from './ListingsTable';
import { RequestsPanel } from './RequestsPanel';
import { BoostCard, ShopChecklist } from './ShopChecklist';

const PERIODS = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
] as const;

const useStyles = createStyles((t) => ({
  wide: { flexGrow: 2, flexShrink: 1, flexBasis: 440, minWidth: 0 },
  narrow: { flexGrow: 1, flexShrink: 1, flexBasis: 280, minWidth: 0, gap: t.spacing[4] },
}));

export const toRows = (insights: ShopInsights): ListingRowData[] =>
  insights.listings.map((l) => ({ ...l, id: l.listingId }));

function Heading({
  shop,
  insights,
  period,
  onPeriod,
}: {
  shop: MyShop;
  insights?: ShopInsights;
  period: Period;
  onPeriod: (p: Period) => void;
}) {
  const me = useMe();
  const first = me.data?.name.split(' ')[0];
  const where = shop.location?.areaName ?? 'you';
  return (
    <KlozView row wrap align="end" justify="between" gap={3}>
      <KlozView gap={0.5}>
        <KlozText
          variant="title-1"
          level={1}
        >{`${greeting(new Date())}${first ? `, ${first}` : ''}`}</KlozText>
        <KlozText variant="body-sm" tone="secondary">
          {insights
            ? `How buyers near ${where} found your shop, ${periodLabel(insights.from, insights.to)}`
            : ' '}
        </KlozText>
      </KlozView>
      <KlozSegmented
        label="Period"
        value={String(period) as '7' | '30'}
        options={PERIODS}
        onChange={(v) => onPeriod(v === '30' ? 30 : 7)}
      />
    </KlozView>
  );
}

function Body({ shop, insights }: { shop: MyShop; insights: ShopInsights }) {
  const styles = useStyles();
  const top = toRows(insights).slice(0, 5);
  return (
    <>
      <KpiTiles insights={insights} />
      <KlozView row wrap gap={4}>
        <KlozView style={styles.wide}>
          <ChatsChart insights={insights} />
        </KlozView>
        <KlozView style={styles.narrow}>
          <DistanceCard distance={insights.distance} />
        </KlozView>
      </KlozView>
      <Panel p={5}>
        <SectionHeading
          title="Your listings"
          sub={`Top ${top.length} of ${insights.listings.length}, by chats this period`}
          link={{ label: 'See all listings', href: `/sell/${shop.id}/listings` }}
        />
        {top.length ? (
          <ListingsTable rows={top} />
        ) : (
          <KlozText tone="secondary">Add your first listing to see its figures here.</KlozText>
        )}
      </Panel>
      <KlozView row wrap gap={4} align="start">
        <KlozView style={styles.wide}>
          <RequestsPanel shopId={shop.id} limit={3} />
        </KlozView>
        <KlozView style={styles.narrow}>
          <BoostCard />
          <ShopChecklist shop={shop} />
        </KlozView>
      </KlozView>
    </>
  );
}

function Overview({ shop }: { shop: MyShop }) {
  const [period, setPeriod] = useState<Period>(7);
  const insights = useShopInsights(shop.id, period);
  return (
    <>
      <Heading shop={shop} insights={insights.data} period={period} onPeriod={setPeriod} />
      {insights.data ? (
        <Body shop={shop} insights={insights.data} />
      ) : (
        <KlozSkeleton height={320} />
      )}
    </>
  );
}

/** The seller's home, as in the mockup: figures, chats, listings, requests, verification. */
export function OverviewScreen({ shopId }: { shopId: string }) {
  return (
    <SellerShell shopId={shopId} active="overview">
      {(shop) => <Overview shop={shop} />}
    </SellerShell>
  );
}
