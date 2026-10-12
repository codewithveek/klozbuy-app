import type { GenerateMetadataFunction } from 'expo-server';
import { useLocalSearchParams } from 'expo-router';
import { RequestsPage } from '../../../features/selling/pages/SimplePages';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Buyer requests | Klozbuy for sellers',
  robots: { index: false },
});

export default function Route() {
  const { shopId = '' } = useLocalSearchParams<{ shopId: string }>();
  return <RequestsPage shopId={shopId} />;
}
