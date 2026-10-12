import type { GenerateMetadataFunction } from 'expo-server';
import { useLocalSearchParams } from 'expo-router';
import { RequestsScreen } from '../../features/requests/RequestsScreen';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Post a request: let shops near you make offers | Klozbuy',
  description: 'Say what you need and shops nearby reply with a price. Then chat on WhatsApp.',
});

export default function RequestsRoute() {
  const { text } = useLocalSearchParams<{ text?: string }>();
  return <RequestsScreen initialText={text} />;
}
