/**
 * What modules announce when they change something. Other modules react through the
 * handler the composition root wires up (see wiring.ts), never by importing each other.
 */
export type DomainEvent =
  { type: 'ShopChanged'; shopId: string } | { type: 'ListingChanged'; listingId: string };

export type EventSink = (events: DomainEvent[]) => Promise<void>;

/** Drops events. For contexts that only read. */
export const ignoreEvents: EventSink = async () => {};
