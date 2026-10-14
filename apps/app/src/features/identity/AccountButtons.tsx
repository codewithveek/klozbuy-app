import { useMe, useMyRequests } from '@klozbuy/api-client';
import { avatarTone, initials, KlozAvatar, KlozIconButton, KlozTap, KlozView } from '@klozbuy/ui';

/** True when one of the buyer's open requests has offers to look at. */
function useHasNewOffers(signedIn: boolean): boolean {
  const requests = useMyRequests(signedIn);
  return !!requests.data?.some((r) => r.status === 'open' && r.offerCount > 0);
}

/** The bell (offers on your requests) and your avatar, or a sign-in icon when signed out. */
export function AccountButtons({ bell = true }: { bell?: boolean }) {
  const me = useMe();
  const signedIn = !!me.data;
  const hasOffers = useHasNewOffers(signedIn);
  const name = me.data?.name?.trim() || 'You';
  return (
    <KlozView row align="center" gap={2}>
      {bell && (
        <KlozIconButton
          icon="bell"
          label={hasOffers ? 'Offers on your requests' : 'Your requests'}
          variant="subtle"
          shape="circle"
          dot={hasOffers}
          href="/requests"
        />
      )}
      {signedIn ? (
        <KlozTap href="/account" accessibilityLabel={`Your profile, ${initials(name)}`}>
          <KlozAvatar name={name} size="lg" tone={avatarTone(name)} />
        </KlozTap>
      ) : (
        <KlozIconButton
          icon="user"
          label="Sign in"
          variant="subtle"
          shape="circle"
          href="/sign-in"
        />
      )}
    </KlozView>
  );
}
