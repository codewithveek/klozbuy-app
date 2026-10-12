import { useMe } from '@klozbuy/api-client';
import { avatarTone, KlozAvatar, KlozButton, KlozSkeleton, KlozText, KlozView } from '@klozbuy/ui';
import { Panel, SectionHeading } from '../../lib/Panel';
import { BuyerShell } from '../shell/BuyerShell';
import { useSignOut } from './use-sign-in';

const LINKS = [
  { label: 'Your requests', href: '/requests' },
  { label: 'Chats', href: '/chats' },
  { label: 'Saved', href: '/saved' },
  { label: 'Markets', href: '/markets' },
  { label: 'Seller dashboard', href: '/sell' },
];

/** Profile: who you are, your places in the app, and signing out. */
export function AccountScreen() {
  const me = useMe();
  const signOut = useSignOut();
  return (
    <BuyerShell active="account">
      <KlozText variant="title-1" level={1}>
        Profile
      </KlozText>
      {me.isPending && <KlozSkeleton height={120} />}
      {!me.isPending && !me.data && (
        <Panel p={5}>
          <SectionHeading
            title="Sign in with your phone"
            sub="To post requests, see offers and keep a list of shops you contacted."
          />
          <KlozButton href="/sign-in?next=/account">Sign in</KlozButton>
        </Panel>
      )}
      {me.data && (
        <Panel p={5}>
          <KlozView row align="center" gap={3}>
            <KlozAvatar name={me.data.name || 'You'} size="xl" tone={avatarTone(me.data.name)} />
            <KlozView>
              <KlozText variant="title-3">{me.data.name || 'Your account'}</KlozText>
              <KlozText variant="body-sm" tone="secondary">
                {me.data.phoneNumber ?? ''}
              </KlozText>
            </KlozView>
          </KlozView>
          <KlozButton variant="outline" leading="logout" onPress={signOut}>
            Sign out
          </KlozButton>
        </Panel>
      )}
      <Panel p={5} gap={1}>
        {LINKS.map((link) => (
          <KlozButton key={link.href} variant="ghost" href={link.href} trailing="chevron-right">
            {link.label}
          </KlozButton>
        ))}
      </Panel>
    </BuyerShell>
  );
}
