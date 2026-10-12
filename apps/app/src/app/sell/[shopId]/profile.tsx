import type { GenerateMetadataFunction } from 'expo-server';
import { useLocalSearchParams } from 'expo-router';
import { ProfilePage } from '../../../features/selling/pages/ProfilePage';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Shop profile | Klozbuy for sellers',
  robots: { index: false },
});

export default function Route() {
  const { shopId = '' } = useLocalSearchParams<{ shopId: string }>();
  return <ProfilePage shopId={shopId} />;
}
