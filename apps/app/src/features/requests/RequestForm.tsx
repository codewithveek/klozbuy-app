import { KlozButton, KlozInput, KlozText, KlozView } from '@klozbuy/ui';
import { router } from 'expo-router';
import { useState } from 'react';
import { Panel } from '../../lib/Panel';
import { useBuyerLocation } from '../location/LocationProvider';
import { usePostRequest } from './use-post-request';

/** Digits only: "600,000" → 600000; empty → undefined. */
const toBudget = (text: string) => {
  const digits = text.replace(/\D/g, '');
  return digits ? Number(digits) : undefined;
};

/** The full request form: what you need and, if you like, your budget. */
export function RequestForm({ initialText = '' }: { initialText?: string }) {
  const { location } = useBuyerLocation();
  const [text, setText] = useState(initialText);
  const [budget, setBudget] = useState('');
  const { post, error, posting } = usePostRequest();
  async function submit() {
    const request = await post(text, toBudget(budget));
    if (request) router.push(`/requests/${request.id}`);
  }
  const where = location.source === 'device' ? 'you' : location.label;
  return (
    <Panel p={5} gap={4}>
      <KlozView gap={1}>
        <KlozText variant="title-3" level={2}>
          Can’t find it? Post a request
        </KlozText>
        <KlozText variant="body-sm" tone="secondary">
          {`Shops near ${where} see it and reply with a price. You choose who to WhatsApp. Requests close after 7 days.`}
        </KlozText>
      </KlozView>
      <KlozInput
        label="What do you need?"
        placeholder="e.g. PS5 slim under ₦600k"
        value={text}
        onChangeText={setText}
        error={error ?? undefined}
        maxLength={300}
      />
      <KlozInput
        label="Budget (optional)"
        prefix="₦"
        type="number"
        placeholder="600,000"
        value={budget}
        onChangeText={setBudget}
      />
      <KlozButton variant="inverse" loading={posting} onPress={submit}>
        Post request
      </KlozButton>
    </Panel>
  );
}
