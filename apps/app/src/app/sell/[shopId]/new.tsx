import type { GenerateMetadataFunction } from 'expo-server';
import { useLocalSearchParams } from 'expo-router';
import { NewListingScreen } from '../../../features/selling/NewListingScreen';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Add a listing | Klozbuy',
  robots: { index: false },
});

export default function NewListingRoute() {
  const { shopId = '' } = useLocalSearchParams<{ shopId: string }>();
  return <NewListingScreen shopId={shopId} />;
}
