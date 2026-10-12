import type { GenerateMetadataFunction } from 'expo-server';
import { ServicesScreen } from '../features/discovery/ServicesScreen';

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Trusted services near you: plumbers, tailors, repairs | Klozbuy',
  description:
    'Plumbers, electricians, tailors and repairers near you, checked in person. Chat on WhatsApp.',
});

export default function ServicesRoute() {
  return <ServicesScreen />;
}
