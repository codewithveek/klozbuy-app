import type { Offer } from '@klozbuy/contracts';
import { KlozButton, KlozPrice, KlozText, KlozView } from '@klozbuy/ui';
import { timeAgo } from '../../lib/format';
import { offerUrl } from '../../lib/links';
import { Panel } from '../../lib/Panel';
import { ShopLine } from '../discovery/ShopLine';

/** One shop's answer: its price and note, and the way to reach it. */
export function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Panel>
      <KlozView row justify="between" align="center" gap={3} wrap>
        <ShopLine shop={offer.shop} hours={null} />
        <KlozPrice amount={offer.priceNgn} />
      </KlozView>
      {offer.message && <KlozText>{offer.message}</KlozText>}
      <KlozText variant="caption" tone="secondary">
        {`Offered ${timeAgo(offer.createdAt, new Date())}`}
      </KlozText>
      <KlozView row gap={2} wrap>
        <KlozButton grow leading="chat" href={offerUrl(offer.id)}>
          WhatsApp the shop
        </KlozButton>
        {offer.listingSlug && (
          <KlozButton grow variant="outline" href={`/l/${offer.listingSlug}`}>
            See the listing
          </KlozButton>
        )}
        <KlozButton grow variant="outline" href={`/s/${offer.shop.slug}`}>
          View shop
        </KlozButton>
      </KlozView>
    </Panel>
  );
}
