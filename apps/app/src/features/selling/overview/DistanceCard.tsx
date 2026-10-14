import type { ShopInsights } from '@klozbuy/contracts';
import { createStyles, KlozText, KlozView } from '@klozbuy/ui';
import { Panel } from '../../../lib/Panel';

const useStyles = createStyles((t) => ({
  track: {
    height: 10,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.bgSubtle,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: t.radius.full, backgroundColor: t.colors.actionPrimary },
}));

const BANDS = [
  { key: 'under1', label: 'Under 1 km' },
  { key: 'from1to2', label: '1 to 2 km' },
  { key: 'from2to3', label: '2 to 3 km' },
  { key: 'over3', label: 'Over 3 km' },
] as const;

function headline(distance: NonNullable<ShopInsights['distance']>): string {
  const within2 = distance.under1 + distance.from1to2;
  return within2 >= 50 ? 'Most buyers are within 2 km' : 'Many buyers come from over 2 km away';
}

/** How far away buyers were when they got in touch. */
export function DistanceCard({ distance }: { distance: ShopInsights['distance'] }) {
  const styles = useStyles();
  return (
    <Panel p={5}>
      <KlozView gap={0.5}>
        <KlozText variant="label" level={2}>
          {distance ? headline(distance) : 'How far your buyers are'}
        </KlozText>
        <KlozText variant="body-sm" tone="secondary">
          How far away people were when they contacted you
        </KlozText>
      </KlozView>
      {distance ? (
        BANDS.map((band) => (
          <KlozView key={band.key} gap={1}>
            <KlozView row justify="between">
              <KlozText variant="body-sm">{band.label}</KlozText>
              <KlozText variant="label">{`${distance[band.key]}%`}</KlozText>
            </KlozView>
            <KlozView style={styles.track}>
              <KlozView style={[styles.fill, { width: `${distance[band.key]}%` }]} />
            </KlozView>
          </KlozView>
        ))
      ) : (
        <KlozText variant="body-sm" tone="secondary">
          Shows up once buyers contact you from the app with their location on.
        </KlozText>
      )}
    </Panel>
  );
}
