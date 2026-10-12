import { useShopStats } from '@klozbuy/api-client';
import type { ShopStats } from '@klozbuy/contracts';
import {
  createStyles,
  KlozIcon,
  KlozSkeleton,
  KlozText,
  KlozView,
  type IconName,
} from '@klozbuy/ui';

const useStyles = createStyles((t) => ({
  tile: { flexGrow: 1, flexBasis: 88 },
  chart: { height: 72, alignItems: 'flex-end' },
  bar: {
    flex: 1,
    backgroundColor: t.colors.actionPrimary,
    borderTopLeftRadius: t.radius.sm,
    borderTopRightRadius: t.radius.sm,
    minHeight: 2,
  },
  empty: { backgroundColor: t.colors.bgSubtle },
}));

const TILES: { key: keyof ShopStats['totals']; label: string; icon: IconName }[] = [
  { key: 'whatsapp', label: 'WhatsApp chats', icon: 'chat' },
  { key: 'call', label: 'Calls', icon: 'phone' },
  { key: 'directions', label: 'Directions', icon: 'navigate' },
];

function DailyBars({ days }: { days: ShopStats['days'] }) {
  const styles = useStyles();
  const totals = days.map((d) => d.whatsapp + d.call + d.directions);
  const max = Math.max(1, ...totals);
  return (
    <KlozView row gap={1} style={styles.chart}>
      {totals.map((total, i) => (
        <KlozView
          key={days[i]?.day}
          style={[
            styles.bar,
            total === 0 && styles.empty,
            { height: `${Math.max(4, (total / max) * 100)}%` },
          ]}
        />
      ))}
    </KlozView>
  );
}

/** Buyers who reached out in the last 14 days. */
export function StatsPanel({ shopId }: { shopId: string }) {
  const styles = useStyles();
  const stats = useShopStats(shopId);
  if (!stats.data) return <KlozSkeleton height={160} />;
  return (
    <KlozView as="section" gap={4} p={5} bg="surface" radius="lg" border>
      <KlozText variant="title-3" level={2}>
        Buyers who reached out, last 14 days
      </KlozText>
      <KlozView row wrap gap={4}>
        {TILES.map((tile) => (
          <KlozView key={tile.key} style={styles.tile} gap={1}>
            <KlozView row gap={2} align="center">
              <KlozIcon name={tile.icon} size={16} tone="secondary" />
              <KlozText variant="body-sm" tone="secondary">
                {tile.label}
              </KlozText>
            </KlozView>
            <KlozText variant="metric">{stats.data.totals[tile.key]}</KlozText>
          </KlozView>
        ))}
      </KlozView>
      <DailyBars days={stats.data.days} />
    </KlozView>
  );
}
