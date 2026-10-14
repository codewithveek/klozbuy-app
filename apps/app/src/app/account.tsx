import type { GenerateMetadataFunction } from 'expo-server';
import { AccountScreen } from '../features/identity/AccountScreen';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Profile | Klozbuy',
  robots: { index: false },
});

export default function Route() {
  return <AccountScreen />;
}
