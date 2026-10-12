import { useConfirmStock, useSetListingStatus } from '@klozbuy/api-client';
import type { Listing } from '@klozbuy/contracts';
import { KlozBadge, KlozButton, KlozPrice, KlozTap, KlozText, KlozView } from '@klozbuy/ui';
import { stockLine } from '../../lib/format';

const STATUS: Record<
  Listing['status'],
  { label: string; tone: 'brand' | 'neutral' | 'inverse' | 'warning' }
> = {
  active: { label: 'On sale', tone: 'brand' },
  sold: { label: 'Sold', tone: 'inverse' },
  hidden: { label: 'Hidden', tone: 'neutral' },
  draft: { label: 'Draft', tone: 'neutral' },
  removed: { label: 'Removed', tone: 'warning' },
};

/** One listing with the actions sellers use daily: confirm stock, mark sold, hide or relist. */
export function MyListingRow({ listing }: { listing: Listing }) {
  const confirm = useConfirmStock();
  const setStatus = useSetListingStatus();
  const status = STATUS[listing.status];
  const busy = confirm.isPending || setStatus.isPending;
  return (
    <KlozView as="listitem" gap={3} p={4} bg="surface" radius="lg" border>
      <KlozView row justify="between" align="start" gap={3}>
        <KlozView flex={1} gap={1}>
          <KlozTap href={`/l/${listing.slug}`}>
            <KlozText variant="title-3" numberOfLines={2}>
              {listing.title}
            </KlozText>
          </KlozTap>
          <KlozPrice amount={listing.priceNgn} />
          <KlozText variant="body-sm" tone="secondary">
            {stockLine(listing, new Date())}
          </KlozText>
        </KlozView>
        <KlozBadge tone={status.tone}>{status.label}</KlozBadge>
      </KlozView>
      <KlozView row wrap gap={2}>
        {listing.status === 'active' && (
          <>
            <KlozButton
              size="sm"
              variant="secondary"
              leading="check-circle"
              disabled={busy}
              onPress={() => confirm.mutate(listing.id)}
            >
              Still in stock
            </KlozButton>
            <KlozButton
              size="sm"
              variant="outline"
              disabled={busy}
              onPress={() => setStatus.mutate({ id: listing.id, status: 'sold' })}
            >
              Mark sold
            </KlozButton>
            <KlozButton
              size="sm"
              variant="ghost"
              disabled={busy}
              onPress={() => setStatus.mutate({ id: listing.id, status: 'hidden' })}
            >
              Hide
            </KlozButton>
          </>
        )}
        {listing.status !== 'active' && (
          <KlozButton
            size="sm"
            variant="outline"
            disabled={busy}
            onPress={() => setStatus.mutate({ id: listing.id, status: 'active' })}
          >
            Put back on sale
          </KlozButton>
        )}
      </KlozView>
    </KlozView>
  );
}
