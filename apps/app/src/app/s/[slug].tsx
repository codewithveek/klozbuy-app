import type { GenerateMetadataFunction, LoaderFunction } from 'expo-server';
import { useLocalSearchParams } from 'expo-router';
import { shopTitle } from '../../features/catalog/seo';
import { ShopScreen } from '../../features/shops/ShopScreen';
import { useRouteData } from '../../lib/route-data';
import { orNull, serverApi } from '../../lib/server-api';

const slugOf = (params: Record<string, string | string[]>) => String(params.slug ?? '');

export const loader: LoaderFunction = async (_request, params) => {
  const [shop, listings] = await Promise.all([
    orNull(() => serverApi.shops.shop(slugOf(params))),
    orNull(() => serverApi.shops.listings(slugOf(params))),
  ]);
  return { shop, listings: listings ?? [] };
};

export const generateMetadata: GenerateMetadataFunction = async (_request, params) => {
  const shop = await orNull(() => serverApi.shops.shop(slugOf(params)));
  if (!shop) return { title: 'Shop not found | Klozbuy', robots: { index: false } };
  const description =
    shop.description ?? `Items and services from ${shop.name}, near you on Klozbuy.`;
  return {
    title: shopTitle(shop),
    description,
    openGraph: { title: shopTitle(shop), description },
  };
};

export default function ShopRoute() {
  const { slug = '' } = useLocalSearchParams<{ slug: string }>();
  const data = useRouteData<Awaited<ReturnType<typeof loader>>>();
  return <ShopScreen slug={slug} initial={data ?? undefined} />;
}
