import { useLoaderData } from 'expo-router';

/** On the web, the route's loader ran on the server and its result is in the page. */
export function useRouteData<T>(): T | undefined {
  return useLoaderData() as T | undefined;
}
