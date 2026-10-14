import type { GenerateMetadataFunction } from 'expo-server';
import { CodeScreen } from '../../features/identity/CodeScreen';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Enter your code | Klozbuy',
  robots: { index: false },
});

export default CodeScreen;
