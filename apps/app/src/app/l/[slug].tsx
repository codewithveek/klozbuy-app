import type { GenerateMetadataFunction, LoaderFunction } from 'expo-server';
import { useLocalSearchParams } from 'expo-router';
import { listingDescription, listingTitle } from '../../features/catalog/seo';
import { ListingScreen } from '../../features/catalog/ListingScreen';
import { useRouteData } from '../../lib/route-data';
import { orNull, serverApi } from '../../lib/server-api';

const slugOf = (params: Record<string, string | string[]>) => String(params.slug ?? '');

export const loader: LoaderFunction = async (_request, params) => ({
  listing: await orNull(() => serverApi.catalog.listing(slugOf(params))),
});

export const generateMetadata: GenerateMetadataFunction = async (_request, params) => {
  const listing = await orNull(() => serverApi.catalog.listing(slugOf(params)));
  if (!listing) return { title: 'Listing not found | Klozbuy', robots: { index: false } };
  const title = listingTitle(listing);
  const description = listingDescription(listing);
  return { title, description, openGraph: { title, description, type: 'website' } };
};

export default function ListingRoute() {
  const { slug = '' } = useLocalSearchParams<{ slug: string }>();
  const data = useRouteData<Awaited<ReturnType<typeof loader>>>();
  return <ListingScreen slug={slug} initial={data?.listing ?? undefined} />;
}
