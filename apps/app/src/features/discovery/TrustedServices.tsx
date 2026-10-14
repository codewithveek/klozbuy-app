import { KlozGrid, KlozView } from '@klozbuy/ui';
import { SectionHeading } from '../../lib/Panel';
import { DEFAULT_FILTERS } from './feed-filters';
import { ServiceCard } from './ServiceCard';
import { useFeed } from './use-feed';

/** "Trusted services nearby": the three closest checked service providers. */
export function TrustedServices() {
  const feed = useFeed({ ...DEFAULT_FILTERS, verifiedOnly: true }, { type: 'service', limit: 3 });
  if (feed.items.length === 0) return null;
  return (
    <KlozView as="section" gap={3}>
      <SectionHeading
        title="Trusted services nearby"
        size="title-2"
        link={{ label: 'See all services', href: '/services' }}
      />
      <KlozGrid min={220}>
        {feed.items.map((item) => (
          <ServiceCard key={item.listingId} item={item} />
        ))}
      </KlozGrid>
    </KlozView>
  );
}
