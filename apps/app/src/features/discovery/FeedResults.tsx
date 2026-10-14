import type { FeedItem } from '@klozbuy/contracts';
import { KlozButton, KlozGrid, KlozSkeleton, KlozText, KlozView } from '@klozbuy/ui';
import type { ReactNode } from 'react';
import { FeedCard } from './FeedCard';

interface Props {
  items: FeedItem[];
  loading: boolean;
  hasMore?: boolean;
  loadingMore?: boolean;
  onMore?: () => void;
  empty: ReactNode;
}

function Placeholders() {
  return (
    <KlozGrid min={220}>
      {[0, 1, 2].map((i) => (
        <KlozView key={i} gap={2}>
          <KlozSkeleton height={170} />
          <KlozSkeleton height={20} width="80%" />
          <KlozSkeleton height={20} width="40%" />
        </KlozView>
      ))}
    </KlozGrid>
  );
}

/** The listing cards: three to a row on desktop, stacked rows on phones. */
export function FeedResults({ items, loading, hasMore, loadingMore, onMore, empty }: Props) {
  if (loading) return <Placeholders />;
  if (items.length === 0) return <>{empty}</>;
  return (
    <KlozView gap={5}>
      <KlozGrid min={220} list>
        {items.map((item) => (
          <FeedCard key={item.listingId} item={item} />
        ))}
      </KlozGrid>
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
