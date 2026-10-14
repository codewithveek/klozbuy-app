import type { UserRole } from '@klozbuy/contracts';
import type { Db } from '@klozbuy/db';
import type { Id } from '@klozbuy/shared';
import type { EventSink } from './events';

export type UserId = Id<'User'>;

export interface Clock {
  now(): Date;
}

export const systemClock: Clock = { now: () => new Date() };

/** Who is making the request. Services make permission decisions from this, routes do not. */
export interface Actor {
  userId: UserId;
  role: UserRole;
}

/**
 * Everything a service needs, passed in on every call. Services never reach for globals,
 * so tests can hand them a test database, a fixed clock or a fake actor.
 */
export interface Ctx {
  db: Db;
  clock: Clock;
  actor: Actor | null;
  /** Announces changes; discovery keeps the feed current from these. */
  publish: EventSink;
}
