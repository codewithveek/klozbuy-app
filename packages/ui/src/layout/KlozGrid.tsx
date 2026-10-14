import { Children, useState, type ReactNode } from 'react';
import { Platform, View, type LayoutChangeEvent } from 'react-native';
import './web-props';
import { spacing, type SpaceKey } from '../tokens';

export interface KlozGridProps {
  /** Narrowest a cell may get, in px; as many columns fit as the width allows. */
  min: 160 | 220 | 280;
  gap?: SpaceKey;
  /** Renders the grid as a list for screen readers. */
  list?: boolean;
  /** Stretch a few cells across the row instead of leaving empty columns (CSS auto-fit). */
  fit?: boolean;
  children: ReactNode;
}

/** CSS for the web grid; native measures its width and sizes cells to match. */
export const GRID_CSS = ([160, 220, 280] as const)
  .flatMap((min) =>
    (['fill', 'fit'] as const).map(
      (mode) =>
        `[data-kgrid="${min}-${mode}"]{display:grid!important;grid-template-columns:repeat(auto-${mode},minmax(min(${min}px,100%),1fr))}`,
    ),
  )
  .join('\n');

/** Cards in equal columns: as many as fit at `min` px each, like CSS auto-fill. */
export function KlozGrid({ min, gap = 4, list, fit = false, children }: KlozGridProps) {
  const [width, setWidth] = useState(0);
  const space = spacing[gap];
  const role = list ? 'list' : undefined;
  if (Platform.OS === 'web') {
    return (
      <View
        role={role}
        dataSet={{ kgrid: `${min}-${fit ? 'fit' : 'fill'}` }}
        style={{ gap: space }}
      >
        {children}
      </View>
    );
  }
  const fitting = Math.max(1, Math.floor((width + space) / (min + space)));
  const columns = fit ? Math.min(fitting, Children.count(children)) : fitting;
  const cell = width ? (width - space * (columns - 1)) / columns : undefined;
  return (
    <View
      role={role}
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
      style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space }}
    >
      {Children.map(children, (child) => (
        <View style={{ width: cell ?? '100%' }}>{child}</View>
      ))}
    </View>
  );
}
