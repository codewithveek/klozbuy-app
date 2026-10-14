import type { GenerateMetadataFunction } from 'expo-server';
import { NearMeScreen } from '../features/discovery/NearMeScreen';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Klozbuy: trusted shops and services near you',
  description:
    'Find what is in stock nearby, from shops checked in person, and chat with the seller on WhatsApp.',
});

export default function NearMeRoute() {
  return <NearMeScreen />;
}
