import { createStyles, KlozButton, KlozIcon, KlozView, useTheme } from '@klozbuy/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { TextInput } from 'react-native';

const useStyles = createStyles((t) => ({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[2] + 2,
    minHeight: 48,
    paddingLeft: t.spacing[4],
    paddingRight: t.spacing[1] + 2,
    borderRadius: t.radius.full,
    borderWidth: t.stroke.hairline,
    borderColor: t.colors.borderStrong,
    backgroundColor: t.colors.bgSubtle,
  },
  compact: { minHeight: 46, paddingRight: t.spacing[4] },
  input: {
    flex: 1,
    minWidth: 0,
    alignSelf: 'stretch',
    fontSize: 14,
    color: t.colors.textPrimary,
    outlineWidth: 0,
  },
}));

/** Search near the buyer. Enter or the Search button opens the results page. */
export function SearchForm({ compact = false }: { compact?: boolean }) {
  const styles = useStyles();
  const theme = useTheme();
  const params = useLocalSearchParams<{ q?: string }>();
  const [q, setQ] = useState(params.q ?? '');
  const submit = () => {
    const words = q.trim();
    if (words.length >= 2) router.push(`/search?q=${encodeURIComponent(words)}`);
  };
  return (
    <KlozView style={[styles.field, compact && styles.compact]}>
      <KlozIcon name="search" tone="secondary" />
      <TextInput
        value={q}
        onChangeText={setQ}
        onSubmitEditing={submit}
        accessibilityLabel="Search near you"
        placeholder={
          compact
            ? 'Search phones, tailors, food…'
            : 'Search phones, tailors, plumbers, food near you'
        }
        placeholderTextColor={theme.colors.textTertiary}
        returnKeyType="search"
        inputMode="search"
        style={styles.input}
      />
      {!compact && (
        <KlozButton size="sm" shape="pill" onPress={submit}>
          Search
        </KlozButton>
      )}
    </KlozView>
  );
}
