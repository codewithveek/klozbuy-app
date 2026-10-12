import { useMe } from '@klozbuy/api-client';
import type { IconName } from '@klozbuy/ui';
import { createStyles, KlozButton, KlozIcon, KlozText, KlozView } from '@klozbuy/ui';
import { AppHeader } from '../../lib/AppHeader';
import { Page } from '../../lib/Page';
import { useSignOut } from '../identity/use-sign-in';

const PROMISES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'shield-check',
    title: 'Checked in person',
    body: 'Our team visits every verified shop and confirms it is where it says it is.',
  },
  {
    icon: 'pin',
    title: 'Sorted by distance',
    body: 'See what is in stock within walking distance before you leave home.',
  },
  {
    icon: 'chat',
    title: 'Chat on WhatsApp',
    body: 'Ask the seller about price and stock in the app you already use.',
  },
];

function HeaderActions() {
  const me = useMe();
  const signOut = useSignOut();
  if (me.isPending) return null;
  if (!me.data) {
    return (
      <KlozButton variant="outline" href="/sign-in" leading="user">
        Sign in
      </KlozButton>
    );
  }
  return (
    <KlozView row align="center" gap={2}>
      <KlozText variant="body-strong">{me.data.name || 'Your account'}</KlozText>
      <KlozButton variant="ghost" onPress={signOut}>
        Sign out
      </KlozButton>
    </KlozView>
  );
}

/**
 * Cards wrap: three across on wide screens, stacked on phones. Done with flex-basis rather
 * than the window width, so the server-rendered HTML matches the browser's first render.
 */
const useCardStyles = createStyles(() => ({ card: { flexGrow: 1, flexBasis: 280 } }));

function PromiseCard({ icon, title, body }: (typeof PROMISES)[number]) {
  const styles = useCardStyles();
  return (
    <KlozView
      as="listitem"
      row
      align="start"
      gap={3}
      p={4}
      bg="surface"
      radius="lg"
      border
      style={styles.card}
    >
      <KlozView bg="brand-subtle" radius="md" p={2} align="center" justify="center">
        <KlozIcon name={icon} tone="brand" />
      </KlozView>
      <KlozView gap={1} flex={1}>
        <KlozText variant="title-3" level={2}>
          {title}
        </KlozText>
        <KlozText variant="body-sm" tone="secondary">
          {body}
        </KlozText>
      </KlozView>
    </KlozView>
  );
}

export function HomeScreen() {
  const me = useMe();
  return (
    <Page header={<AppHeader actions={<HeaderActions />} />}>
      <KlozView gap={8} py={6}>
        <KlozView gap={3}>
          <KlozText variant="overline" tone="brand">
            Opening soon in Yaba
          </KlozText>
          <KlozText variant="display" level={1}>
            Trusted shops near you
          </KlozText>
          <KlozText tone="secondary">
            Find what is in stock nearby, from shops our team has checked in person, and talk to the
            seller on WhatsApp.
          </KlozText>
          {me.data === null && (
            <KlozButton size="lg" href="/sign-in" trailing="chevron-right">
              Sign in with your phone
            </KlozButton>
          )}
        </KlozView>
        <KlozView as="list" row wrap gap={4}>
          {PROMISES.map((promise) => (
            <PromiseCard key={promise.title} {...promise} />
          ))}
        </KlozView>
      </KlozView>
    </Page>
  );
}
