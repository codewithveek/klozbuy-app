import type { ErrorCode } from '@klozbuy/contracts';
import { err, ok, type Result } from '@klozbuy/shared';
import type { Actor, Ctx } from './context';

/** Services return errors as values; the API maps each code to an HTTP status in one place. */
export interface DomainError<Code extends ErrorCode = ErrorCode> {
  readonly code: Code;
  readonly message: string;
}

export function domainError<Code extends ErrorCode>(
  code: Code,
  message: string,
): DomainError<Code> {
  return { code, message };
}

export type DomainResult<T, Code extends ErrorCode = ErrorCode> = Result<T, DomainError<Code>>;

export function requireActor(ctx: Ctx): DomainResult<Actor, 'UNAUTHENTICATED'> {
  return ctx.actor ? ok(ctx.actor) : err(domainError('UNAUTHENTICATED', 'Sign in to continue'));
}

export const notFound = <Code extends ErrorCode>(code: Code, what: string) =>
  domainError(code, `${what} was not found`);

export const forbidden = (message = 'You cannot change this') => domainError('FORBIDDEN', message);
