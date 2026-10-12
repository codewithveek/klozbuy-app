import type { Db } from '@klozbuy/db';
import { handleEvents } from './discovery';
import type { EventSink } from './events';

/**
 * Who reacts to domain events. Today discovery updates the feed straight after the write;
 * moving this onto the outbox and a queue later changes only this function.
 */
export function createEventSink(db: Db): EventSink {
  return (events) => handleEvents(db, events);
}
