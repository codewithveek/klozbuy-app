import { KlozText, KlozView } from '@klozbuy/ui';

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <KlozView gap={0.5}>
      <KlozText variant="title-1" level={1}>
        {title}
      </KlozText>
      {sub && (
        <KlozText variant="body-sm" tone="secondary">
          {sub}
        </KlozText>
      )}
    </KlozView>
  );
}
