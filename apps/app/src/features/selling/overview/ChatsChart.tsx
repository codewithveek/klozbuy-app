import type { ShopInsights } from '@klozbuy/contracts';
import { FONT_FAMILY, KlozText, KlozView, useTheme } from '@klozbuy/ui';
import Svg, { G, Line, Path, Text } from 'react-native-svg';
import { Panel } from '../../../lib/Panel';
import { chatsHeadline, periodLabel } from './insight-math';

const W = 560;
const H = 200;
const BASE = 170;
const TOP = 34;

/** A bar with only its top corners rounded (4px), standing on the baseline. */
function barPath(x: number, width: number, height: number): string {
  const r = Math.min(4, width / 2, height);
  const y = BASE - height;
  return `M${x} ${BASE}V${y + r}Q${x} ${y} ${x + r} ${y}H${x + width - r}Q${x + width} ${y} ${x + width} ${y + r}V${BASE}Z`;
}

function Bars({ days }: { days: ShopInsights['whatsappByDay'] }) {
  const theme = useTheme();
  const max = Math.max(1, ...days.map((d) => d.count));
  const slot = (W - 24) / days.length;
  // Thin marks: at most 24px wide, with at least a 2px gap between neighbours.
  const width = Math.max(4, Math.min(24, slot - 2));
  const peak = days.reduce((best, d, i) => (d.count > (days[best]?.count ?? 0) ? i : best), 0);
  const labelEvery = days.length > 10 ? 5 : 1;
  return (
    <G fontFamily={FONT_FAMILY}>
      {days.map((d, i) => {
        const x = 12 + i * slot + (slot - width) / 2;
        const h = (d.count / max) * (BASE - TOP);
        const showValue = d.count > 0 && (days.length <= 10 || i === peak);
        return (
          <G key={d.day}>
            {h > 0 && (
              <Path
                d={barPath(x, width, h)}
                fill={theme.colors.actionPrimary}
                accessibilityLabel={`${d.day}: ${d.count} chats`}
              />
            )}
            {showValue && (
              <Text
                x={x + width / 2}
                y={BASE - h - 6}
                fontSize={11}
                fontWeight="600"
                textAnchor="middle"
                fill={theme.colors.textPrimary}
              >
                {String(d.count)}
              </Text>
            )}
            {i % labelEvery === 0 && (
              <Text
                x={x + width / 2}
                y={BASE + 18}
                fontSize={10.5}
                textAnchor="middle"
                fill={theme.colors.textTertiary}
              >
                {String(Number(d.day.slice(8, 10)))}
              </Text>
            )}
          </G>
        );
      })}
      <Line x1={12} y1={BASE} x2={W - 12} y2={BASE} stroke={theme.colors.borderDefault} />
    </G>
  );
}

/** WhatsApp chats started each day in the period. */
export function ChatsChart({ insights }: { insights: ShopInsights }) {
  const total = insights.totals.whatsapp;
  return (
    <Panel p={5}>
      <KlozView gap={0.5}>
        <KlozText variant="label" level={2}>
          {chatsHeadline(insights)}
        </KlozText>
        <KlozText variant="body-sm" tone="secondary">
          {`Chats started from your listings each day, ${periodLabel(insights.from, insights.to)}`}
        </KlozText>
      </KlozView>
      <Svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ aspectRatio: W / H }}
        role="img"
        accessibilityLabel={`Bar chart of WhatsApp chats per day: ${total} in total`}
      >
        <Bars days={insights.whatsappByDay} />
      </Svg>
    </Panel>
  );
}
