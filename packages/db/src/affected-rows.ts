/**
 * TiDB's HTTP driver reports a write as { rows: [], rowsAffected: 1, rowCount: 0 }, where
 * rowCount is how many rows came back (none, for a write), not how many changed. Better Auth
 * reads rowCount first (it is the Postgres field), so it decides that deleting a sign-in code
 * changed nothing: the code is rejected and, because the delete did happen, lost. The MySQL
 * driver used in tests has no rowCount, which is why only the deployed worker was affected.
 *
 * Dropping rowCount from write results leaves rowsAffected, the field MySQL drivers use too.
 */
export function withoutWriteRowCount(result: unknown): unknown {
  if (!result || typeof result !== 'object' || Array.isArray(result)) return result;
  if (!('rowsAffected' in result) || !('rowCount' in result)) return result;
  const { rowCount: _returnedRows, ...rest } = result as Record<string, unknown>;
  return rest;
}

/**
 * Wraps a TiDB serverless connection (and the transactions it begins) so every result goes
 * through withoutWriteRowCount. Everything else is passed through untouched.
 */
export function withMysqlAffectedRows<T extends object>(target: T): T {
  return new Proxy(target, {
    get(object, key) {
      const value: unknown = Reflect.get(object, key, object);
      if (typeof value !== 'function') return value;
      const method = value as (...args: unknown[]) => unknown;
      if (key === 'execute') {
        return async (...args: unknown[]) => withoutWriteRowCount(await method.apply(object, args));
      }
      if (key === 'begin') {
        return async (...args: unknown[]) =>
          withMysqlAffectedRows((await method.apply(object, args)) as object);
      }
      return method.bind(object);
    },
  });
}
