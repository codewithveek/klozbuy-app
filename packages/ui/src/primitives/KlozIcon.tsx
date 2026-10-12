import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '../theme/ThemeProvider';
import { ICONS, type IconName } from './icons';
import { TONE_COLORS, type TextTone } from '../theme/tones';

export interface KlozIconProps {
  name: IconName;
  /** 14 in badges, 16 inline with small text, 20 in controls (default), 24 on its own. */
  size?: 14 | 16 | 20 | 24;
  /** Match the text it sits beside. Default 'primary'. */
  tone?: TextTone;
  /** Give a label only when the icon carries meaning on its own. */
  label?: string;
}

export function KlozIcon({ name, size = 20, tone = 'primary', label }: KlozIconProps) {
  const theme = useTheme();
  const color = theme.colors[TONE_COLORS[tone]];
  const a11y = label
    ? { role: 'img' as const, accessibilityLabel: label }
    : { 'aria-hidden': true };
  return (
    <Svg
      {...a11y}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={theme.stroke.icon}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name].map((shape, index) =>
        shape.kind === 'circle' ? (
          <Circle key={index} cx={shape.cx} cy={shape.cy} r={shape.r} />
        ) : (
          <Path key={index} d={shape.d} fill={'filled' in shape ? color : 'none'} />
        ),
      )}
    </Svg>
  );
}

export type { IconName };
