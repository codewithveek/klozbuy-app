import { KlozInput } from '@klozbuy/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';

/** Search near the buyer. Submitting opens /search?q=… */
export function SearchBar({ initial = '' }: { initial?: string }) {
  const router = useRouter();
  const [text, setText] = useState(initial);
  const submit = () => {
    const q = text.trim();
    if (q.length >= 2) router.push({ pathname: '/search', params: { q } });
  };
  return (
    <KlozInput
      accessibilityLabel="Search near you"
      placeholder="Search for an item or service, like iPhone 13 or tailor"
      type="search"
      leading="search"
      value={text}
      onChangeText={setText}
      onSubmitEditing={submit}
      testID="search-input"
    />
  );
}
