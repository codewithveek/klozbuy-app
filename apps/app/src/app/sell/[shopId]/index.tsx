import type { GenerateMetadataFunction } from 'expo-server';
import { useLocalSearchParams } from 'expo-router';
import { OverviewScreen } from '../../../features/selling/overview/OverviewScreen';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Your shop | Klozbuy for sellers',
  robots: { index: false },
});

export default function Route() {
  const { shopId = '' } = useLocalSearchParams<{ shopId: string }>();
  return <OverviewScreen shopId={shopId} />;
}
