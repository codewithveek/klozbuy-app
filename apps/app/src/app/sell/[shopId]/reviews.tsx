import type { GenerateMetadataFunction } from 'expo-server';
import { useLocalSearchParams } from 'expo-router';
import { ReviewsPage } from '../../../features/selling/pages/SimplePages';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Reviews | Klozbuy for sellers',
  robots: { index: false },
});

export default function Route() {
  const { shopId = '' } = useLocalSearchParams<{ shopId: string }>();
  return <ReviewsPage shopId={shopId} />;
}
