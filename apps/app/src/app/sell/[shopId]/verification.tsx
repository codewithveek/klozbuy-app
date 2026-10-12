import type { GenerateMetadataFunction } from 'expo-server';
import { useLocalSearchParams } from 'expo-router';
import { VerificationPage } from '../../../features/selling/pages/SimplePages';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Verification | Klozbuy for sellers',
  robots: { index: false },
});

export default function Route() {
  const { shopId = '' } = useLocalSearchParams<{ shopId: string }>();
  return <VerificationPage shopId={shopId} />;
}
