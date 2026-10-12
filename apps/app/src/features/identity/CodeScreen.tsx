import { meQueryKey } from '@klozbuy/api-client';
import type { Me } from '@klozbuy/contracts';
import { KlozButton, KlozInput, KlozText, KlozView } from '@klozbuy/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { AppHeader } from '../../lib/AppHeader';
import { Page } from '../../lib/Page';
import { safeNext } from '../../lib/format';
import { formatLocalPhone, toInternationalPhone } from './phone';
import { useSendCode, useVerifyCode } from './use-sign-in';

const CODE_LENGTH = 6;

export function CodeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ phone?: string; next?: string }>();
  const next = safeNext(params.next);
  const phone = toInternationalPhone(params.phone ?? '');
  const [code, setCode] = useState('');
  const verify = useVerifyCode();
  const resend = useSendCode();

  async function submit() {
    if (!phone) return;
    if (code.length !== CODE_LENGTH) {
      verify.setError(`Enter all ${CODE_LENGTH} digits from the SMS.`);
      return;
    }
    if (!(await verify.start(phone, code))) return;
    // New accounts have no name yet; ask for one before going home.
    const me = queryClient.getQueryData<Me | null>(meQueryKey);
    router.replace(me?.name ? next : { pathname: '/sign-in/name', params: { next } });
  }

  if (!phone) {
    return (
      <Page width="narrow" header={<AppHeader />}>
        <KlozView gap={4} py={6}>
          <KlozText variant="title-1" level={1}>
            Start again
          </KlozText>
          <KlozText tone="secondary">We need your phone number before we can send a code.</KlozText>
          <KlozButton href="/sign-in">Enter your number</KlozButton>
        </KlozView>
      </Page>
    );
  }

  return (
    <Page width="narrow" header={<AppHeader />}>
      <KlozView gap={6} py={6}>
        <KlozView gap={2}>
          <KlozText variant="title-1" level={1}>
            Enter the code
          </KlozText>
          <KlozText tone="secondary">
            We sent a {CODE_LENGTH}-digit code to {formatLocalPhone(phone)}. It expires in 5
            minutes.
          </KlozText>
        </KlozView>
        <KlozInput
          label="Code"
          type="one-time-code"
          placeholder="123456"
          maxLength={CODE_LENGTH}
          value={code}
          onChangeText={(text) => setCode(text.replace(/\D/g, ''))}
          onSubmitEditing={submit}
          error={verify.error ?? resend.error}
          hint={resend.pending ? 'Sending a new code…' : undefined}
          autoFocus
          testID="code-input"
        />
        <KlozView gap={3}>
          <KlozButton
            size="lg"
            fullWidth
            loading={verify.pending}
            onPress={submit}
            testID="verify-code"
          >
            Verify and continue
          </KlozButton>
          <KlozView row justify="between" wrap>
            <KlozButton variant="ghost" href="/sign-in">
              Use a different number
            </KlozButton>
            <KlozButton
              variant="ghost"
              disabled={resend.pending}
              onPress={() => resend.start(phone)}
            >
              Send a new code
            </KlozButton>
          </KlozView>
        </KlozView>
      </KlozView>
    </Page>
  );
}
