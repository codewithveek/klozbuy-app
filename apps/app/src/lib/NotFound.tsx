import { KlozButton, KlozText, KlozView } from '@klozbuy/ui';
import { AppHeader } from './AppHeader';
import { Page } from './Page';

export function NotFound({
  title = 'This page is not here',
  body = 'The link may be old, or the listing may have sold.',
}: {
  title?: string;
  body?: string;
}) {
  return (
    <Page width="narrow" header={<AppHeader />}>
      <KlozView gap={4} py={6}>
        <KlozText variant="title-1" level={1}>
          {title}
        </KlozText>
        <KlozText tone="secondary">{body}</KlozText>
        <KlozButton href="/">See what is near you</KlozButton>
      </KlozView>
    </Page>
  );
}
