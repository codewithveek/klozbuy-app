import type { DimensionValue } from 'react-native';
import { KlozView } from '../primitives/KlozView';
import { createStyles } from '../theme/createStyles';

const useStyles = createStyles((t) => ({
  block: { backgroundColor: t.colors.bgSubtle, borderRadius: t.radius.sm },
}));

export interface KlozSkeletonProps {
  width?: DimensionValue;
  height: number;
}

/** A placeholder block shaped like the content that is loading. */
export function KlozSkeleton({ width = '100%', height }: KlozSkeletonProps) {
  const styles = useStyles();
  return <KlozView style={[styles.block, { width, height }]} />;
}
