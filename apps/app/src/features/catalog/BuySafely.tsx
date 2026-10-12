import { useReport } from '@klozbuy/api-client';
import { REPORT_REASONS, type ReportReason } from '@klozbuy/contracts';
import {
  createStyles,
  KlozButton,
  KlozChip,
  KlozIcon,
  KlozTap,
  KlozText,
  KlozView,
} from '@klozbuy/ui';
import { useState } from 'react';

const useStyles = createStyles((t) => ({
  panel: {
    backgroundColor: t.colors.warningBg,
    borderRadius: t.radius.lg,
  },
}));

const REASON_LABELS: Record<ReportReason, string> = {
  scam: 'Looks like a scam',
  prohibited_item: 'Not allowed for sale',
  wrong_price: 'Wrong price or details',
  offensive: 'Offensive',
  other: 'Something else',
};

const TIPS = [
  'Meet at the shop or a busy public place',
  'Test the item fully before you pay',
  'Never send a deposit to a seller you have not met',
];

function ReportForm({ listingId, onDone }: { listingId: string; onDone: () => void }) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const report = useReport();
  if (report.isSuccess) {
    return (
      <KlozText variant="body-sm" tone="warning" announce>
        Thanks. Our team will look at this listing.
      </KlozText>
    );
  }
  return (
    <KlozView gap={2}>
      <KlozText variant="label" tone="warning">
        What’s wrong?
      </KlozText>
      <KlozView row wrap gap={2}>
        {REPORT_REASONS.map((value) => (
          <KlozChip key={value} selected={reason === value} onPress={() => setReason(value)}>
            {REASON_LABELS[value]}
          </KlozChip>
        ))}
      </KlozView>
      <KlozView row gap={2}>
        <KlozButton
          size="sm"
          variant="inverse"
          disabled={!reason}
          loading={report.isPending}
          onPress={() =>
            reason && report.mutate({ targetType: 'listing', targetId: listingId, reason })
          }
        >
          Send report
        </KlozButton>
        <KlozButton size="sm" variant="ghost" onPress={onDone}>
          Cancel
        </KlozButton>
      </KlozView>
    </KlozView>
  );
}

/** Safety tips, and the way to report a listing that looks wrong. */
export function BuySafely({ listingId }: { listingId: string }) {
  const styles = useStyles();
  const [reporting, setReporting] = useState(false);
  return (
    <KlozView as="aside" p={4} gap={3} style={styles.panel}>
      <KlozView row align="center" gap={2}>
        <KlozIcon name="alert" tone="warning" />
        <KlozText variant="label" tone="warning" level={2}>
          Buy safely
        </KlozText>
      </KlozView>
      <KlozView gap={1} as="list">
        {TIPS.map((tip) => (
          <KlozText key={tip} variant="body-sm" tone="warning">{`•  ${tip}`}</KlozText>
        ))}
      </KlozView>
      {reporting ? (
        <ReportForm listingId={listingId} onDone={() => setReporting(false)} />
      ) : (
        <KlozTap onPress={() => setReporting(true)}>
          <KlozText variant="label" tone="warning">
            Report this listing
          </KlozText>
        </KlozTap>
      )}
    </KlozView>
  );
}
