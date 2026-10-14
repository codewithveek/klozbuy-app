import { useNearbyRequests } from '@klozbuy/api-client';
import { KlozTap, KlozText, KlozView } from '@klozbuy/ui';
import { useBuyerLocation } from '../location/LocationProvider';

export const offersLabel = (count: number) =>
  count === 0 ? 'No offers yet' : count === 1 ? '1 offer' : `${count} offers`;

/** What other buyers nearby are looking for, with how many offers each has had. */
export function AskedNearYou({ limit = 3 }: { limit?: number }) {
  const { location, radiusKm } = useBuyerLocation();
  const requests = useNearbyRequests({ lat: location.lat, lng: location.lng, radiusKm });
  const items = requests.data?.slice(0, limit) ?? [];
  if (items.length === 0) return null;
  return (
    <KlozView gap={2}>
      <KlozText variant="overline" tone="secondary">
        Asked near you
      </KlozText>
      {items.map((request) => (
        <KlozTap key={request.id} href={`/requests/${request.id}`}>
          <KlozView row justify="between" gap={2}>
            <KlozView flex={1}>
              <KlozText variant="body-sm" numberOfLines={1}>
                {request.text}
              </KlozText>
            </KlozView>
            <KlozText variant="label" tone="brand">
              {offersLabel(request.offerCount)}
            </KlozText>
          </KlozView>
        </KlozTap>
      ))}
    </KlozView>
  );
}
