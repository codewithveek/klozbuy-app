import { useShopLeads } from '@klozbuy/api-client';
import type { LeadChannel } from '@klozbuy/contracts';
import {
  createStyles,
  KlozIcon,
  KlozSkeleton,
  KlozText,
  KlozView,
  type IconName,
} from '@klozbuy/ui';
import { formatDistance, timeAgo } from '../../../lib/format';
import { Panel } from '../../../lib/Panel';
import { SellerShell } from '../shell/SellerShell';
import { PageTitle } from './PageTitle';

const CHANNEL: Record<LeadChannel, { label: string; icon: IconName }> = {
  whatsapp: { label: 'Started a WhatsApp chat', icon: 'chat' },
  call: { label: 'Called you', icon: 'phone' },
  directions: { label: 'Got directions', icon: 'navigate' },
};

const useStyles = createStyles((t) => ({
  row: {
    paddingVertical: t.spacing[3],
    borderTopWidth: t.stroke.hairline,
    borderTopColor: t.colors.borderDefault,
  },
}));

function Leads({ shopId }: { shopId: string }) {
  const styles = useStyles();
  const leads = useShopLeads(shopId);
  if (leads.isPending) return <KlozSkeleton height={200} />;
  if (!leads.data?.length)
    return (
      <KlozText tone="secondary">
        No leads yet. They appear here when buyers tap WhatsApp, Call or Directions.
      </KlozText>
    );
  const now = new Date();
  return (
    <KlozView as="list">
      {leads.data.map((lead) => (
        <KlozView key={lead.id} row align="center" gap={3} style={styles.row}>
          <KlozIcon name={CHANNEL[lead.channel].icon} tone="brand" />
          <KlozView flex={1}>
            <KlozText variant="body-strong">{CHANNEL[lead.channel].label}</KlozText>
            <KlozText variant="body-sm" tone="secondary">
              {[
                lead.listingTitle ?? 'About a request',
                lead.distanceKm !== null ? `${formatDistance(lead.distanceKm)} away` : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </KlozText>
          </KlozView>
          <KlozText variant="caption" tone="secondary">
            {timeAgo(lead.createdAt, now)}
          </KlozText>
        </KlozView>
      ))}
    </KlozView>
  );
}

/** Every tap on the shop's WhatsApp, call and directions buttons, newest first. */
export function LeadsPage({ shopId }: { shopId: string }) {
  return (
    <SellerShell shopId={shopId} active="leads">
      {() => (
        <>
          <PageTitle
            title="Leads"
            sub="Buyers who contacted you from Klozbuy. The conversation itself is in your WhatsApp."
          />
          <Panel p={5}>
            <Leads shopId={shopId} />
          </Panel>
        </>
      )}
    </SellerShell>
  );
}
