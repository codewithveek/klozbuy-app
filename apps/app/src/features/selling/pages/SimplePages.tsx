import { KlozBadge, KlozText } from '@klozbuy/ui';
import { verifiedLine } from '../../../lib/format';
import { Panel, SectionHeading } from '../../../lib/Panel';
import { RequestsPanel } from '../overview/RequestsPanel';
import { ShopChecklist } from '../overview/ShopChecklist';
import { SellerShell } from '../shell/SellerShell';
import { PageTitle } from './PageTitle';

export function RequestsPage({ shopId }: { shopId: string }) {
  return (
    <SellerShell shopId={shopId} active="requests">
      {() => (
        <>
          <PageTitle
            title="Buyer requests"
            sub="Open requests from buyers within 5 km of your shop"
          />
          <RequestsPanel shopId={shopId} />
        </>
      )}
    </SellerShell>
  );
}

export function ReviewsPage({ shopId }: { shopId: string }) {
  return (
    <SellerShell shopId={shopId} active="reviews">
      {() => (
        <>
          <PageTitle title="Reviews" />
          <Panel p={5}>
            <SectionHeading
              title="No reviews yet"
              sub="Reviews will open to buyers who confirm they bought from you. You’ll be able to reply to each one."
            />
            <KlozBadge icon="clock">Coming soon</KlozBadge>
          </Panel>
        </>
      )}
    </SellerShell>
  );
}

export function BoostsPage({ shopId }: { shopId: string }) {
  return (
    <SellerShell shopId={shopId} active="boosts">
      {() => (
        <>
          <PageTitle title="Boosts" />
          <Panel p={5}>
            <SectionHeading
              title="Boosts are coming soon"
              sub="A boost will put one listing at the top of its category for buyers up to 5 km away, for 7 days. Nothing to pay today."
            />
            <KlozBadge icon="clock">Coming soon</KlozBadge>
          </Panel>
        </>
      )}
    </SellerShell>
  );
}

export function VerificationPage({ shopId }: { shopId: string }) {
  return (
    <SellerShell shopId={shopId} active="verification">
      {(shop) => (
        <>
          <PageTitle
            title="Verification"
            sub="Verified shops show to buyers who filter for checked shops, which is the default."
          />
          <Panel p={5}>
            {shop.verified ? (
              <KlozBadge tone="brand" icon="shield-check">
                {verifiedLine(shop.verifiedAt)}
              </KlozBadge>
            ) : (
              <>
                <KlozBadge tone="warning" icon="clock">
                  Waiting for a visit
                </KlozBadge>
                <KlozText>
                  A Klozbuy agent will visit your shop at the location you gave to check it’s there
                  and matches your listings. Keep your opening hours up to date so they find you
                  open.
                </KlozText>
              </>
            )}
          </Panel>
          <ShopChecklist shop={shop} />
        </>
      )}
    </SellerShell>
  );
}
