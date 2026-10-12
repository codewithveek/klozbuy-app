import { createStyles, KlozButton, KlozSkeleton, KlozText, KlozView } from '@klozbuy/ui';
import type { ReactNode } from 'react';
import { ListingCard, type ListingCardData } from './ListingCard';

export interface ListingGridProps {
  items: (ListingCardData & { key: string })[];
  loading: boolean;
  empty: ReactNode;
  hasMore?: boolean;
  loadingMore?: boolean;
  onMore?: () => void;
}

const usePlaceholderStyles = createStyles(() => ({ cell: { flexGrow: 1, flexBasis: 165 } }));

function Placeholders() {
  const styles = usePlaceholderStyles();
  return (
    <KlozView row wrap gap={4}>
      {[0, 1, 2, 3].map((i) => (
        <KlozView key={i} gap={2} style={styles.cell}>
          <KlozSkeleton height={180} />
          <KlozSkeleton height={20} width="80%" />
          <KlozSkeleton height={20} width="40%" />
        </KlozView>
      ))}
    </KlozView>
  );
}

/** Cards wrap to fill the width: one column on phones, up to four on desktop. */
export function ListingGrid({
  items,
  loading,
  empty,
  hasMore,
  loadingMore,
  onMore,
}: ListingGridProps) {
  if (loading) return <Placeholders />;
  if (items.length === 0) return <>{empty}</>;
  return (
    <KlozView gap={6}>
      <KlozView as="list" row wrap gap={4}>
        {items.map(({ key, ...item }) => (
          <ListingCard key={key} listing={item} />
        ))}
      </KlozView>
      {hasMore && (
        <KlozButton variant="outline" onPress={onMore} loading={loadingMore}>
          Show more
        </KlozButton>
      )}
    </KlozView>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <KlozView gap={3} p={6} bg="surface" radius="lg" border align="start">
      <KlozText variant="title-3">{title}</KlozText>
      <KlozText tone="secondary">{body}</KlozText>
      {action}
    </KlozView>
  );
}
