import type { GenerateMetadataFunction } from 'expo-server';
import { SellScreen } from '../../features/selling/SellScreen';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Sell on Klozbuy',
  description: 'List what you have in stock and reach buyers within walking distance on WhatsApp.',
});

export default SellScreen;
