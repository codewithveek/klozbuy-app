import type { GenerateMetadataFunction } from 'expo-server';
import { MarketsScreen } from '../features/places/MarketsScreen';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Markets in Lagos: Yaba, Tejuosho, Computer Village and more | Klozbuy',
  description: 'See what shops in the big Lagos markets have in stock, nearest first.',
});

export default function MarketsRoute() {
  return <MarketsScreen />;
}
