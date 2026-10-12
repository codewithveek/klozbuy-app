import type { ListingDetail } from '@klozbuy/contracts';
import { KlozBadge, KlozButton, KlozIcon, KlozText, KlozView } from '@klozbuy/ui';

/** Who sells it and where: the trust facts, stated plainly. */
export function ShopPanel({ shop }: { shop: ListingDetail['shop'] }) {
  return (
    <KlozView as="section" gap={3} p={4} bg="surface" radius="lg" border>
      <KlozView row align="center" justify="between" gap={2} wrap>
        <KlozText variant="title-3" level={2}>
          {shop.name}
        </KlozText>
        {shop.verified ? (
          <KlozBadge tone="brand" icon="shield-check">
            Checked in person
          </KlozBadge>
        ) : (
          <KlozBadge>Not yet visited</KlozBadge>
        )}
      </KlozView>
      {shop.location && (
        <KlozView row gap={2} align="start">
          <KlozIcon name="pin" size={16} tone="secondary" />
          <KlozView flex={1}>
            <KlozText variant="body-sm" tone="secondary">
              {shop.location.landmark}
            </KlozText>
          </KlozView>
        </KlozView>
      )}
      <KlozButton variant="secondary" href={`/s/${shop.slug}`} trailing="chevron-right">
        See everything in this shop
      </KlozButton>
    </KlozView>
  );
}

export function BuySafely() {
  return (
    <KlozView as="aside" gap={2} p={4} radius="lg" bg="subtle">
      <KlozView row gap={2} align="center">
        <KlozIcon name="alert" size={16} tone="warning" />
        <KlozText variant="label">Buy safely</KlozText>
      </KlozView>
      <KlozText variant="body-sm" tone="secondary">
        See the item and test it in the shop before you pay. Never send money to hold an item for
        you.
      </KlozText>
    </KlozView>
  );
}
