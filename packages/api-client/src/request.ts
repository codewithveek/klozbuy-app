import type { z } from 'zod';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
}

export type Request = <S extends z.ZodType>(
  schema: S,
  path: string,
  options?: RequestOptions,
) => Promise<z.output<S>>;
