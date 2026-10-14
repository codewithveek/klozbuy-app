import type { RequestSummary } from '@klozbuy/contracts';
import { formatNaira, toNaira } from '@klozbuy/shared';
import { createStyles, KlozBadge, KlozIcon, KlozTap, KlozText, KlozView } from '@klozbuy/ui';
import { formatDistance, timeAgo } from '../../lib/format';
import { offersLabel } from './AskedNearYou';

const useStyles = createStyles((t) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: t.spacing[3],
    paddingVertical: t.spacing[3],
    borderTopWidth: t.stroke.hairline,
    borderTopColor: t.colors.borderDefault,
  },
}));

const STATUS_LABEL = {
  open: 'Open',
  closed: 'Closed',
  expired: 'Expired',
  removed: 'Removed',
} as const;

/** "Used iPhone 11, under ₦300k · 0.9 km · 5 hours ago · 3 offers". */
export function requestMeta(request: RequestSummary, now: Date): string {
  return [
    request.budgetNgn ? `budget ${formatNaira(toNaira(request.budgetNgn))}` : null,
    request.distanceKm !== null ? formatDistance(request.distanceKm) : null,
    timeAgo(request.createdAt, now),
    offersLabel(request.offerCount).toLowerCase(),
  ]
    .filter(Boolean)
    .join(' · ');
}

export function RequestRow({
  request,
  showStatus,
}: {
  request: RequestSummary;
  showStatus?: boolean;
}) {
  const styles = useStyles();
  return (
    <KlozTap href={`/requests/${request.id}`} style={styles.row}>
      <KlozView flex={1} gap={0.5}>
        <KlozText variant="body-strong">{request.text}</KlozText>
        <KlozText variant="body-sm" tone="secondary">
          {requestMeta(request, new Date())}
        </KlozText>
      </KlozView>
      {showStatus && (
        <KlozBadge tone={request.status === 'open' ? 'brand' : 'neutral'}>
          {STATUS_LABEL[request.status]}
        </KlozBadge>
      )}
      <KlozIcon name="chevron-right" tone="secondary" />
    </KlozTap>
  );
}
