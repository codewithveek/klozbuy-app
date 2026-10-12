import type { ShopInsights } from '@klozbuy/contracts';
import { createStyles, KlozGrid, KlozIcon, KlozText, KlozView, type IconName } from '@klozbuy/ui';
import { change, type Change, type Metric, type Period } from './insight-math';

const TILES: { key: Metric; label: string; icon: IconName }[] = [
  { key: 'views', label: 'Views from people nearby', icon: 'eye' },
  { key: 'whatsapp', label: 'WhatsApp chats started', icon: 'chat' },
  { key: 'call', label: 'Calls', icon: 'phone' },
  { key: 'directions', label: 'Direction requests', icon: 'navigate' },
];

const useStyles = createStyles((t) => ({
  tile: {
    backgroundColor: t.colors.bgSurface,
    borderWidth: t.stroke.hairline,
    borderColor: t.colors.borderDefault,
    borderRadius: t.radius.lg,
  },
  main: { borderWidth: 1.5, borderColor: t.colors.actionPrimary },
}));

function Delta({ delta }: { delta: Change | null }) {
  if (!delta) {
    return (
      <KlozText variant="caption" tone="tertiary">
        Nothing to compare yet
      </KlozText>
    );
  }
  const tone =
    delta.direction === 'down' ? 'danger' : delta.direction === 'up' ? 'brand' : 'secondary';
  return (
    <KlozView row align="center" gap={1}>
      {delta.direction !== 'flat' && (
        <KlozIcon
          name={delta.direction === 'up' ? 'arrow-up' : 'arrow-down'}
          size={14}
          tone={tone}
        />
      )}
      <KlozText variant="label" tone={tone}>
        {delta.label}
      </KlozText>
    </KlozView>
  );
}

function Tile({ metric, insights }: { metric: (typeof TILES)[number]; insights: ShopInsights }) {
  const styles = useStyles();
  const main = metric.key === 'whatsapp';
  const value = insights.totals[metric.key];
  return (
    <KlozView p={4} gap={2} style={[styles.tile, main && styles.main]}>
      <KlozView row align="center" gap={2}>
        <KlozIcon name={metric.icon} size={16} tone={main ? 'brand' : 'secondary'} />
        <KlozText variant={main ? 'label' : 'body-sm'} tone={main ? 'brand' : 'secondary'}>
          {metric.label}
        </KlozText>
      </KlozView>
      <KlozText variant="metric">{value.toLocaleString('en-NG')}</KlozText>
      <Delta delta={change(value, insights.previous[metric.key], insights.days as Period)} />
    </KlozView>
  );
}

/** Views, chats, calls and directions, each against the period before. */
export function KpiTiles({ insights }: { insights: ShopInsights }) {
  return (
    <KlozGrid min={160} fit>
      {TILES.map((metric) => (
        <Tile key={metric.key} metric={metric} insights={insights} />
      ))}
    </KlozGrid>
  );
}
