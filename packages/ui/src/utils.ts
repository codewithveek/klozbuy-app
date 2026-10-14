/** Builds an object with the same keys, mapping each value. */
export function mapValues<K extends string, V, R>(
  record: Record<K, V>,
  map: (value: V, key: K) => R,
): Record<K, R> {
  const result = {} as Record<K, R>;
  for (const key of Object.keys(record) as K[]) {
    result[key] = map(record[key], key);
  }
  return result;
}
