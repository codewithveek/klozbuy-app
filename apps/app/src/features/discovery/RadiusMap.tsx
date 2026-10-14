import type { Point } from '@klozbuy/shared';
import { FONT_FAMILY, useTheme } from '@klozbuy/ui';
import Svg, { Circle, G, Line, Path, Rect, Text } from 'react-native-svg';
import { project, type MapFrame } from './map-projection';

export interface MapPin extends Point {
  key: string;
  label: string;
}

interface Props {
  centre: Point;
  radiusKm: number;
  pins: MapPin[];
  /** tall for the full map view; the side card uses the default. */
  tall?: boolean;
}

const pinPath = (x: number, y: number) => `M${x} ${y} c -9 -10 -9 -22 0 -22 c 9 0 9 12 0 22 z`;

/** A grid in the background, so the map reads as a map without pretending to show streets. */
function Grid({ frame, color }: { frame: MapFrame; color: string }) {
  const step = 40;
  const xs = Array.from({ length: Math.floor(frame.width / step) }, (_, i) => (i + 1) * step);
  const ys = Array.from({ length: Math.floor(frame.height / step) }, (_, i) => (i + 1) * step);
  return (
    <G stroke={color} strokeWidth={1}>
      {xs.map((x) => (
        <Line key={`x${x}`} x1={x} y1={0} x2={x} y2={frame.height} />
      ))}
      {ys.map((y) => (
        <Line key={`y${y}`} x1={0} y1={y} x2={frame.width} y2={y} />
      ))}
    </G>
  );
}

/**
 * Where listings are around the buyer: each pin is placed by its real distance and direction,
 * and the dashed ring is the search radius.
 */
export function RadiusMap({ centre, radiusKm, pins, tall }: Props) {
  const theme = useTheme();
  const frame: MapFrame = tall
    ? { width: 640, height: 360, ring: 150 }
    : { width: 320, height: 210, ring: 74 };
  const cx = frame.width / 2;
  const cy = frame.height / 2;
  const brand = theme.colors.actionPrimary;
  return (
    <Svg
      viewBox={`0 0 ${frame.width} ${frame.height}`}
      width="100%"
      style={{ aspectRatio: frame.width / frame.height }}
      role="img"
      accessibilityLabel={`Map of ${pins.length} listings within ${radiusKm} km of you`}
    >
      <Rect width={frame.width} height={frame.height} fill={theme.colors.bgSubtle} />
      <Grid frame={frame} color={theme.colors.bgSurface} />
      <Circle
        cx={cx}
        cy={cy}
        r={frame.ring}
        fill={brand}
        fillOpacity={0.07}
        stroke={brand}
        strokeOpacity={0.45}
        strokeDasharray="4 4"
      />
      {pins.map((pin) => {
        const { x, y } = project(centre, pin, radiusKm, frame);
        return (
          <G key={pin.key}>
            <Path d={pinPath(x, y + 8)} fill={brand} />
            <Circle cx={x} cy={y - 7} r={3} fill={theme.colors.onAction} />
          </G>
        );
      })}
      <Circle cx={cx} cy={cy} r={11} fill={theme.colors.infoFg} fillOpacity={0.2} />
      <Circle
        cx={cx}
        cy={cy}
        r={5.5}
        fill={theme.colors.infoFg}
        stroke={theme.colors.bgSurface}
        strokeWidth={2}
      />
      <Text
        x={cx + 12}
        y={cy + 18}
        fontSize={11}
        fontWeight="600"
        fontFamily={FONT_FAMILY}
        fill={theme.colors.textPrimary}
      >
        You
      </Text>
    </Svg>
  );
}
