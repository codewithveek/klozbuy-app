import type { GenerateMetadataFunction } from 'expo-server';
import { SavedScreen } from '../features/saved/SavedScreen';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Saved | Klozbuy',
  robots: { index: false },
});

export default function Route() {
  return <SavedScreen />;
}
