import { KlozButton, KlozText, KlozView } from '@klozbuy/ui';
import { AppHeader } from '../lib/AppHeader';
import { Page } from '../lib/Page';

export default function NotFound() {
  return (
    <Page width="narrow" header={<AppHeader />}>
      <KlozView gap={4} py={6}>
        <KlozText variant="title-1" level={1}>
          This page is not here
        </KlozText>
        <KlozText tone="secondary">The link may be old, or the listing may have sold.</KlozText>
        <KlozButton href="/">Go to the home page</KlozButton>
      </KlozView>
    </Page>
  );
}
