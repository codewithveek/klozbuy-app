import type { GenerateMetadataFunction } from 'expo-server';
import { useLocalSearchParams } from 'expo-router';
import { RequestScreen } from '../../features/requests/RequestScreen';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Buyer request | Klozbuy',
  robots: { index: false },
});

export default function RequestRoute() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  return <RequestScreen id={id} />;
}
