import type { GenerateMetadataFunction } from 'expo-server';
import { useLocalSearchParams } from 'expo-router';
import { LeadsPage } from '../../../features/selling/pages/LeadsPage';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Leads | Klozbuy for sellers',
  robots: { index: false },
});

export default function Route() {
  const { shopId = '' } = useLocalSearchParams<{ shopId: string }>();
  return <LeadsPage shopId={shopId} />;
}
