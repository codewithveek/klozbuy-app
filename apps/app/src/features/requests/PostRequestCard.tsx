import { createStyles, KlozButton, KlozInput, KlozText, KlozView } from '@klozbuy/ui';
import { useState } from 'react';
import { Panel } from '../../lib/Panel';
import { AskedNearYou } from './AskedNearYou';
import { usePostRequest } from './use-post-request';

const useStyles = createStyles((t) => ({
  divider: {
    borderTopWidth: t.stroke.hairline,
    borderTopColor: t.colors.borderDefault,
    paddingTop: t.spacing[3],
  },
}));

/** "Can't find it? Post a request": sellers nearby answer with offers. */
export function PostRequestCard() {
  const styles = useStyles();
  const [text, setText] = useState('');
  const [postedId, setPostedId] = useState<string | null>(null);
  const { post, error, posting } = usePostRequest();
  async function submit() {
    const request = await post(text);
    if (request) {
      setText('');
      setPostedId(request.id);
    }
  }
  return (
    <Panel>
      <KlozView gap={1}>
        <KlozText variant="label" level={2}>
          Can’t find it? Post a request
        </KlozText>
        <KlozText variant="body-sm" tone="secondary">
          Sellers near you reply with offers you can take to WhatsApp.
        </KlozText>
      </KlozView>
      <KlozInput
        id="side-request"
        label="What do you need?"
        placeholder="e.g. PS5 slim under ₦600k"
        value={text}
        onChangeText={setText}
        onSubmitEditing={submit}
        error={error ?? undefined}
      />
      <KlozButton variant="inverse" fullWidth loading={posting} onPress={submit}>
        Post request
      </KlozButton>
      {postedId && (
        <KlozButton variant="ghost" size="sm" href={`/requests/${postedId}`}>
          Posted. See your request
        </KlozButton>
      )}
      <KlozView style={styles.divider}>
        <AskedNearYou />
      </KlozView>
    </Panel>
  );
}
