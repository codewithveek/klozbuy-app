import type { ErrorCode } from '@klozbuy/contracts';

/** An error response from the API, or a response the client could not use. */
export class ApiError extends Error {
  override name = 'ApiError';

  constructor(
    readonly code: ErrorCode,
    message: string,
    readonly status: number,
    readonly details?: unknown,
  ) {
    super(message);
  }
}
