import { KlozButton, KlozInput, KlozText, KlozView } from '@klozbuy/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { AppHeader } from '../../lib/AppHeader';
import { Page } from '../../lib/Page';
import { toInternationalPhone } from './phone';
import { useSendCode } from './use-sign-in';

export function PhoneScreen() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const sendCode = useSendCode();

  async function submit() {
    const phone = toInternationalPhone(input);
    if (!phone) {
      sendCode.setError('Enter a Nigerian mobile number, like 0803 123 4567.');
      return;
    }
    if (await sendCode.start(phone)) router.push({ pathname: '/sign-in/code', params: { phone } });
  }

  return (
    <Page width="narrow" header={<AppHeader />}>
      <KlozView gap={6} py={6}>
        <KlozView gap={2}>
          <KlozText variant="title-1" level={1}>
            Sign in with your phone
          </KlozText>
          <KlozText tone="secondary">
            We will send a 6-digit code by SMS. There is no password to remember.
          </KlozText>
        </KlozView>
        <KlozInput
          label="Phone number"
          prefix="+234"
          placeholder="803 123 4567"
          type="tel"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={submit}
          error={sendCode.error}
          autoFocus
          testID="phone-input"
        />
        <KlozView gap={3}>
          <KlozButton
            size="lg"
            fullWidth
            loading={sendCode.pending}
            onPress={submit}
            testID="send-code"
          >
            Send code
          </KlozButton>
          <KlozText variant="caption" tone="secondary" align="center">
            By continuing you agree to how Klozbuy uses your number, as set out in our privacy
            notice.
          </KlozText>
        </KlozView>
      </KlozView>
    </Page>
  );
}
