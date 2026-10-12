import type { GenerateMetadataFunction } from 'expo-server';
import { SearchScreen } from '../features/discovery/SearchScreen';

export const generateMetadata: GenerateMetadataFunction = (request) => {
  const q = new URL(request.url).searchParams.get('q') ?? '';
  return { title: q ? `${q} near you | Klozbuy` : 'Search | Klozbuy', robots: { index: false } };
};

export default SearchScreen;
