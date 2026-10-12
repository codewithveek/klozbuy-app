import { useMe } from '@klozbuy/api-client';
import { KlozButton, KlozView } from '@klozbuy/ui';
import { useSignOut } from './use-sign-in';

/** Header buttons: selling is always one tap away; account actions depend on the session. */
export function HeaderActions() {
  const me = useMe();
  const signOut = useSignOut();
  if (me.isPending) return null;
  if (!me.data) {
    return (
      <KlozView row align="center" gap={1}>
        <KlozButton variant="ghost" size="sm" href="/sell" leading="store">
          Sell
        </KlozButton>
        <KlozButton variant="outline" size="sm" href="/sign-in" leading="user">
          Sign in
        </KlozButton>
      </KlozView>
    );
  }
  return (
    <KlozView row align="center" gap={1}>
      <KlozButton variant="ghost" size="sm" href="/sell" leading="store">
        Your shop
      </KlozButton>
      <KlozButton variant="ghost" size="sm" onPress={signOut}>
        Sign out
      </KlozButton>
    </KlozView>
  );
}
