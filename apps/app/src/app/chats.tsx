import type { GenerateMetadataFunction } from 'expo-server';
import { ChatsScreen } from '../features/chats/ChatsScreen';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Chats | Klozbuy',
  robots: { index: false },
});

export default function Route() {
  return <ChatsScreen />;
}
