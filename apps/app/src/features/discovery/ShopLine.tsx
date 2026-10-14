import type { ShopHours, ShopSummary } from '@klozbuy/contracts';
import { describeHours } from '@klozbuy/shared';
import { avatarTone, KlozAvatar, KlozIcon, KlozText, KlozView } from '@klozbuy/ui';

/** "★ 4.8 · 126 reviews" when the shop has reviews, otherwise today's hours if known. */
export function shopNote(shop: ShopSummary, hours: ShopHours | null, now: Date): string | null {
  if (shop.ratingAvg !== null && shop.ratingCount > 0) {
    const reviews = shop.ratingCount === 1 ? '1 review' : `${shop.ratingCount} reviews`;
    return `${shop.ratingAvg.toFixed(1)} · ${reviews}`;
  }
  return hours ? describeHours(hours, now) : null;
}

export function VerifiedMark({ verified }: { verified: boolean }) {
  return verified ? (
    <KlozIcon name="shield-check" size={16} tone="brand" label="Verified shop" />
  ) : null;
}

/** Who sells it: initials, name, verified shield and a short note. */
export function ShopLine({
  shop,
  hours,
  avatar = true,
}: {
  shop: ShopSummary;
  hours: ShopHours | null;
  avatar?: boolean;
}) {
  const note = shopNote(shop, hours, new Date());
  const rated = shop.ratingCount > 0;
  return (
    <KlozView row align="center" gap={2}>
      {avatar && (
        <KlozView responsive="show-from-md">
          <KlozAvatar name={shop.name} tone={avatarTone(shop.name)} />
        </KlozView>
      )}
      <KlozView flex={1}>
        <KlozView row align="center" gap={1}>
          <KlozText variant="body-sm" numberOfLines={1}>
            {shop.name}
          </KlozText>
          <VerifiedMark verified={shop.verified} />
        </KlozView>
        {note && (
          <KlozView row align="center" gap={1}>
            {rated && <KlozIcon name="star" size={14} tone="rating" />}
            <KlozText variant="caption" tone="secondary" numberOfLines={1}>
              {note}
            </KlozText>
          </KlozView>
        )}
      </KlozView>
    </KlozView>
  );
}
