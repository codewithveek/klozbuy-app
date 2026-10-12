import type { ListingDetail } from '@klozbuy/contracts';
import { KlozButton, KlozView } from '@klozbuy/ui';
import { goUrl } from '../../lib/links';

/** WhatsApp is the main action. Each link records a lead before it redirects. */
export function ListingActions({ listing }: { listing: ListingDetail }) {
  return (
    <KlozView gap={2}>
      <KlozButton
        size="lg"
        fullWidth
        leading="chat"
        href={goUrl('whatsapp', listing.id)}
        testID="chat-whatsapp"
      >
        Chat on WhatsApp
      </KlozButton>
      <KlozView row gap={2}>
        <KlozView flex={1}>
          <KlozButton variant="outline" fullWidth leading="phone" href={goUrl('call', listing.id)}>
            Call
          </KlozButton>
        </KlozView>
        {listing.shop.location && (
          <KlozView flex={1}>
            <KlozButton
              variant="outline"
              fullWidth
              leading="navigate"
              href={goUrl('directions', listing.id)}
            >
              Directions
            </KlozButton>
          </KlozView>
        )}
      </KlozView>
    </KlozView>
  );
}
