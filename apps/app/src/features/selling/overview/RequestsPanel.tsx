import { useShopRequests } from '@klozbuy/api-client';
import type { RequestSummary } from '@klozbuy/contracts';
import { createStyles, KlozBadge, KlozButton, KlozText, KlozView } from '@klozbuy/ui';
import { useState } from 'react';
import { Panel, SectionHeading } from '../../../lib/Panel';
import { requestMeta } from '../../requests/RequestRow';
import { SendOfferForm } from './SendOfferForm';

const useStyles = createStyles((t) => ({
  row: {
    paddingVertical: t.spacing[3],
    borderTopWidth: t.stroke.hairline,
    borderTopColor: t.colors.borderDefault,
    gap: t.spacing[3],
  },
}));

function RequestItem({ shopId, request }: { shopId: string; request: RequestSummary }) {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  return (
    <KlozView style={styles.row}>
      <KlozView row wrap align="center" justify="between" gap={3}>
        <KlozView flex={1} gap={0.5}>
          <KlozText variant="body-strong">{request.text}</KlozText>
          <KlozText variant="body-sm" tone="secondary">
            {requestMeta(request, new Date())}
          </KlozText>
        </KlozView>
        {request.offered ? (
          <KlozBadge tone="brand" icon="check">
            Offer sent
          </KlozBadge>
        ) : (
          !open && <KlozButton onPress={() => setOpen(true)}>Send offer</KlozButton>
        )}
      </KlozView>
      {open && (
        <SendOfferForm shopId={shopId} requestId={request.id} onDone={() => setOpen(false)} />
      )}
    </KlozView>
  );
}

/** Buyers within 5 km asking for something; the shop answers with a price. */
export function RequestsPanel({ shopId, limit }: { shopId: string; limit?: number }) {
  const requests = useShopRequests(shopId);
  const all = requests.data ?? [];
  const shown = all.slice(0, limit);
  return (
    <Panel p={5} gap={2}>
      <SectionHeading
        title="Buyer requests near your shop"
        sub="Send an offer and the buyer can message you on WhatsApp"
        link={
          limit && all.length > limit
            ? { label: `See all ${all.length}`, href: `/sell/${shopId}/requests` }
            : undefined
        }
      />
      {shown.length === 0 ? (
        <KlozText variant="body-sm" tone="secondary">
          No open requests within 5 km right now.
        </KlozText>
      ) : (
        shown.map((request) => <RequestItem key={request.id} shopId={shopId} request={request} />)
      )}
    </Panel>
  );
}
