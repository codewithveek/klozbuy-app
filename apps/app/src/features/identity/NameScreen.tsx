import { useMe, useUpdateProfile } from '@klozbuy/api-client';
import { updateProfileInputSchema } from '@klozbuy/contracts';
import { KlozButton, KlozInput, KlozText, KlozView } from '@klozbuy/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { AppHeader } from '../../lib/AppHeader';
import { Page } from '../../lib/Page';

export function NameScreen() {
  const router = useRouter();
  const me = useMe();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | undefined>();
  const update = useUpdateProfile();

  async function submit() {
    const parsed = updateProfileInputSchema.safeParse({ name });
    if (!parsed.success) {
      setError('Enter your name, at least 2 letters.');
      return;
    }
    setError(undefined);
    await update.mutateAsync(parsed.data).then(
      () => router.replace('/'),
      () => setError("We couldn't save your name. Try again."),
    );
  }

  return (
    <Page width="narrow" header={<AppHeader />}>
      <KlozView gap={6} py={6}>
        <KlozView gap={2}>
          <KlozText variant="title-1" level={1}>
            {me.data?.name ? `Welcome back, ${me.data.name}` : 'What should sellers call you?'}
          </KlozText>
          <KlozText tone="secondary">
            Sellers see this name when you message them, so use the one you go by.
          </KlozText>
        </KlozView>
        <KlozInput
          label="Your name"
          type="name"
          placeholder="Ọlá Adébáyọ̀"
          value={name}
          onChangeText={setName}
          onSubmitEditing={submit}
          error={error}
          autoFocus
          testID="name-input"
        />
        <KlozView gap={3}>
          <KlozButton
            size="lg"
            fullWidth
            loading={update.isPending}
            onPress={submit}
            testID="save-name"
          >
            Save and continue
          </KlozButton>
          {me.data?.name ? (
            <KlozButton variant="ghost" href="/" fullWidth>
              Keep {me.data.name}
            </KlozButton>
          ) : null}
        </KlozView>
      </KlozView>
    </Page>
  );
}
