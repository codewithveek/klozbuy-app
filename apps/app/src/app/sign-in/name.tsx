import type { GenerateMetadataFunction } from 'expo-server';
import { NameScreen } from '../../features/identity/NameScreen';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Your name | Klozbuy',
  robots: { index: false },
});

export default NameScreen;
