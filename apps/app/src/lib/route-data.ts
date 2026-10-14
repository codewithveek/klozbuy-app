/** Native apps have no server loader; screens fetch their own data. See route-data.web.ts. */
export function useRouteData<T>(): T | undefined {
  return undefined;
}
