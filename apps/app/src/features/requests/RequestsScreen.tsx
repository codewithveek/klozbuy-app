import { useMe, useMyRequests, useNearbyRequests } from '@klozbuy/api-client';
import type { RequestSummary } from '@klozbuy/contracts';
import { KlozButton, KlozText, KlozView } from '@klozbuy/ui';
import { Panel, SectionHeading } from '../../lib/Panel';
import { useBuyerLocation } from '../location/LocationProvider';
import { SaferCard } from '../discovery/SaferCard';
import { BuyerShell } from '../shell/BuyerShell';
import { RequestForm } from './RequestForm';
import { RequestRow } from './RequestRow';

function RequestList({
  title,
  sub,
  items,
  empty,
  showStatus,
}: {
  title: string;
  sub: string;
  items: RequestSummary[];
  empty: string;
  showStatus?: boolean;
}) {
  return (
    <Panel p={5} gap={2}>
      <SectionHeading title={title} sub={sub} />
      {items.length === 0 ? (
        <KlozText variant="body-sm" tone="secondary">
          {empty}
        </KlozText>
      ) : (
        <KlozView as="list">
          {items.map((request) => (
            <RequestRow key={request.id} request={request} showStatus={showStatus} />
          ))}
        </KlozView>
      )}
    </Panel>
  );
}

function MyRequests() {
  const me = useMe();
  const mine = useMyRequests(!!me.data);
  if (!me.data) {
    return (
      <Panel p={5}>
        <SectionHeading title="Your requests" sub="Sign in to see offers on what you asked for." />
        <KlozButton variant="outline" href="/sign-in?next=/requests">
          Sign in
        </KlozButton>
      </Panel>
    );
  }
  return (
    <RequestList
      title="Your requests"
      sub="Open one to see the offers and WhatsApp the shop."
      items={mine.data ?? []}
      empty="You haven’t asked for anything yet."
      showStatus
    />
  );
}

/** Post a request, follow your own, and see what others nearby are asking for. */
export function RequestsScreen({ initialText }: { initialText?: string }) {
  const { location, radiusKm } = useBuyerLocation();
  const nearby = useNearbyRequests({ lat: location.lat, lng: location.lng, radiusKm });
  return (
    <BuyerShell active="requests" aside={<SaferCard />}>
      <KlozText variant="title-1" level={1}>
        Requests
      </KlozText>
      <RequestForm initialText={initialText} />
      <MyRequests />
      <RequestList
        title="Asked near you"
        sub={`Open requests within ${radiusKm} km`}
        items={nearby.data ?? []}
        empty="Nobody nearby has asked for anything yet."
      />
    </BuyerShell>
  );
}
