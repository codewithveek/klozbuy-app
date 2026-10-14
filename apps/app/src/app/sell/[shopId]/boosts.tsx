import type { GenerateMetadataFunction } from 'expo-server';
import { useLocalSearchParams } from 'expo-router';
import { BoostsPage } from '../../../features/selling/pages/SimplePages';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Boosts | Klozbuy for sellers',
  robots: { index: false },
});

export default function Route() {
  const { shopId = '' } = useLocalSearchParams<{ shopId: string }>();
  return <BoostsPage shopId={shopId} />;
}
