import { useCloseRequest, useRequest } from '@klozbuy/api-client';
import type { RequestDetail } from '@klozbuy/contracts';
import { formatNaira, toNaira } from '@klozbuy/shared';
import { KlozBadge, KlozButton, KlozSkeleton, KlozText, KlozView } from '@klozbuy/ui';
import { timeAgo } from '../../lib/format';
import { NotFound } from '../../lib/NotFound';
import { Panel, SectionHeading } from '../../lib/Panel';
import { SaferCard } from '../discovery/SaferCard';
import { BuyerShell } from '../shell/BuyerShell';
import { offersLabel } from './AskedNearYou';
import { OfferCard } from './OfferCard';

function Summary({ request }: { request: RequestDetail }) {
  const close = useCloseRequest();
  const open = request.status === 'open';
  return (
    <Panel p={5}>
      <KlozView row gap={2} wrap>
        <KlozBadge tone={open ? 'brand' : 'neutral'}>{open ? 'Open' : 'Closed'}</KlozBadge>
        <KlozBadge>{offersLabel(request.offerCount)}</KlozBadge>
      </KlozView>
      <KlozText variant="title-1" level={1}>
        {request.text}
      </KlozText>
      <KlozText variant="body-sm" tone="secondary">
        {[
          request.budgetNgn ? `Budget ${formatNaira(toNaira(request.budgetNgn))}` : null,
          `Posted ${timeAgo(request.createdAt, new Date())}`,
        ]
          .filter(Boolean)
          .join(' · ')}
      </KlozText>
      {request.mine && open && (
        <KlozButton
          variant="outline"
          loading={close.isPending}
          onPress={() => close.mutate(request.id)}
        >
          I found it: close this request
        </KlozButton>
      )}
    </Panel>
  );
}

function Offers({ request }: { request: RequestDetail }) {
  if (!request.mine) {
    return (
      <Panel>
        <SectionHeading
          title="Have this in your shop?"
          sub="Sellers send offers from their dashboard. Only the buyer sees the offers."
        />
        <KlozButton variant="outline" href="/sell">
          Open your seller dashboard
        </KlozButton>
      </Panel>
    );
  }
  return (
    <KlozView gap={3}>
      <SectionHeading
        title="Offers"
        size="title-2"
        sub="Cheapest first. Tap WhatsApp to message the shop with your request."
      />
      {request.offers.length === 0 ? (
        <Panel>
          <KlozText tone="secondary">
            No offers yet. Shops nearby are notified when they open their dashboard.
          </KlozText>
        </Panel>
      ) : (
        request.offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)
      )}
    </KlozView>
  );
}

export function RequestScreen({ id }: { id: string }) {
  const request = useRequest(id);
  if (request.isError)
    return <NotFound title="This request is not here" body="It may have been removed." />;
  return (
    <BuyerShell active="requests" aside={<SaferCard />}>
      {request.data ? (
        <>
          <Summary request={request.data} />
          <Offers request={request.data} />
        </>
      ) : (
        <KlozSkeleton height={200} />
      )}
    </BuyerShell>
  );
}
