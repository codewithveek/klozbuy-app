import type { GenerateMetadataFunction } from 'expo-server';
import { PhoneScreen } from '../../features/identity/PhoneScreen';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Sign in | Klozbuy',
  robots: { index: false },
});

export default PhoneScreen;
