import type { GenerateMetadataFunction } from 'expo-server';
import { useLocalSearchParams } from 'expo-router';
import { DashboardScreen } from '../../../features/selling/DashboardScreen';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Your shop | Klozbuy',
  robots: { index: false },
});

export default function DashboardRoute() {
  const { shopId = '' } = useLocalSearchParams<{ shopId: string }>();
  return <DashboardScreen shopId={shopId} />;
}
