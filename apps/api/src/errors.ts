import type { ErrorCode, ErrorResponse } from '@klozbuy/contracts';
import type { DomainError, DomainResult } from '@klozbuy/domain';
import type { Context, ErrorHandler, NotFoundHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

/** The one place error codes become HTTP statuses. Adding a code without a status fails to compile. */
export const ERROR_STATUS = {
  VALIDATION_FAILED: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INTERNAL: 500,
  SHOP_NOT_FOUND: 404,
  NOT_SHOP_OWNER: 403,
  LISTING_NOT_FOUND: 404,
  CATEGORY_NOT_FOUND: 400,
  REQUEST_NOT_FOUND: 404,
} as const satisfies Record<ErrorCode, ContentfulStatusCode>;

export function errorBody(code: ErrorCode, message: string, details?: unknown): ErrorResponse {
  return { error: details === undefined ? { code, message } : { code, message, details } };
}

export function sendError(c: Context, error: DomainError, details?: unknown) {
  return c.json(errorBody(error.code, error.message, details), ERROR_STATUS[error.code]);
}

/** Sends a service result: the value on success, the error shape and its status otherwise. */
export function sendResult<T>(c: Context, result: DomainResult<T>) {
  return result.ok ? c.json(result.value, 200) : sendError(c, result.error);
}

function codeForStatus(status: number): ErrorCode {
  const byStatus: Partial<Record<number, ErrorCode>> = {
    401: 'UNAUTHENTICATED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    429: 'RATE_LIMITED',
  };
  return byStatus[status] ?? (status < 500 ? 'VALIDATION_FAILED' : 'INTERNAL');
}

export const handleError: ErrorHandler = (error, c) => {
  if (error instanceof HTTPException && error.status < 500) {
    return c.json(errorBody(codeForStatus(error.status), error.message), error.status);
  }
  console.error(
    JSON.stringify({
      level: 'error',
      requestId: c.get('requestId'),
      name: error.name,
      message: error.message,
      stack: error.stack,
    }),
  );
  return c.json(errorBody('INTERNAL', 'Something went wrong. Please try again.'), 500);
};

export const handleNotFound: NotFoundHandler = (c) =>
  c.json(errorBody('NOT_FOUND', `No route for ${c.req.method} ${c.req.path}`), 404);
