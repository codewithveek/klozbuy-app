import { KlozButton, KlozText, KlozView } from '@klozbuy/ui';
import type { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { Page } from './Page';

export function NotFound({
  title = 'This page is not here',
  body = 'The link may be old, or the listing may have sold.',
  children,
}: {
  title?: string;
  body?: string;
  /** The way forward; defaults to the near-me feed. */
  children?: ReactNode;
}) {
  return (
    <Page width="narrow" header={<AppHeader />}>
      <KlozView gap={4} py={6}>
        <KlozText variant="title-1" level={1}>
          {title}
        </KlozText>
        <KlozText tone="secondary">{body}</KlozText>
        {children ?? <KlozButton href="/">See what is near you</KlozButton>}
      </KlozView>
    </Page>
  );
}
