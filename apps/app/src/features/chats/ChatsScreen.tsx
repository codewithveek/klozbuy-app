import { useChats, useMe } from '@klozbuy/api-client';
import type { LeadChannel } from '@klozbuy/contracts';
import { formatNaira, toNaira } from '@klozbuy/shared';
import {
  avatarTone,
  KlozAvatar,
  KlozButton,
  KlozSkeleton,
  KlozTap,
  KlozText,
  KlozView,
} from '@klozbuy/ui';
import { timeAgo } from '../../lib/format';
import { Panel, SectionHeading } from '../../lib/Panel';
import { BuyerShell } from '../shell/BuyerShell';

const CHANNEL: Record<LeadChannel, string> = {
  whatsapp: 'WhatsApp chat',
  call: 'Call',
  directions: 'Directions',
};

function SignedOut() {
  return (
    <Panel p={5}>
      <SectionHeading
        title="Sign in to see your chats"
        sub="We keep a list of the shops you contacted, so you can find them again."
      />
      <KlozButton variant="outline" href="/sign-in?next=/chats">
        Sign in
      </KlozButton>
    </Panel>
  );
}

function ChatList() {
  const chats = useChats();
  if (chats.isPending) return <KlozSkeleton height={160} />;
  if (!chats.data?.length) {
    return (
      <Panel p={5}>
        <SectionHeading
          title="No chats yet"
          sub="When you WhatsApp, call or get directions to a shop, it shows up here."
        />
      </Panel>
    );
  }
  const now = new Date();
  return (
    <Panel p={5} gap={4}>
      {chats.data.map((chat) => (
        <KlozTap
          key={chat.id}
          href={chat.listing ? `/l/${chat.listing.slug}` : `/s/${chat.shop.slug}`}
        >
          <KlozView row align="center" gap={3}>
            <KlozAvatar name={chat.shop.name} tone={avatarTone(chat.shop.name)} size="lg" />
            <KlozView flex={1}>
              <KlozText variant="body-strong">{chat.shop.name}</KlozText>
              <KlozText variant="body-sm" tone="secondary" numberOfLines={1}>
                {chat.listing
                  ? `${chat.listing.title} · ${formatNaira(toNaira(chat.listing.priceNgn))}`
                  : 'About your request'}
              </KlozText>
            </KlozView>
            <KlozText variant="caption" tone="secondary">
              {`${CHANNEL[chat.channel]} · ${timeAgo(chat.createdAt, now)}`}
            </KlozText>
          </KlozView>
        </KlozTap>
      ))}
    </Panel>
  );
}

/** The shops the buyer contacted from Klozbuy, newest first. The chats themselves live in WhatsApp. */
export function ChatsScreen() {
  const me = useMe();
  return (
    <BuyerShell active="chats">
      <KlozView gap={1}>
        <KlozText variant="title-1" level={1}>
          Chats
        </KlozText>
        <KlozText variant="body-sm" tone="secondary">
          Shops you contacted. Your messages stay in WhatsApp.
        </KlozText>
      </KlozView>
      {me.isPending ? <KlozSkeleton height={120} /> : me.data ? <ChatList /> : <SignedOut />}
    </BuyerShell>
  );
}
