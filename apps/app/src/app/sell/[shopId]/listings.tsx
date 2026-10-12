import type { GenerateMetadataFunction } from 'expo-server';
import { useLocalSearchParams } from 'expo-router';
import { ListingsPage } from '../../../features/selling/pages/ListingsPage';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Your listings | Klozbuy for sellers',
  robots: { index: false },
});

export default function Route() {
  const { shopId = '' } = useLocalSearchParams<{ shopId: string }>();
  return <ListingsPage shopId={shopId} />;
}
