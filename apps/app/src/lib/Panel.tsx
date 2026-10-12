import { createStyles, KlozText, KlozTap, KlozView, type SpaceKey } from '@klozbuy/ui';
import type { ReactNode } from 'react';

const useStyles = createStyles((t) => ({
  panel: {
    backgroundColor: t.colors.bgSurface,
    borderWidth: t.stroke.hairline,
    borderColor: t.colors.borderDefault,
    borderRadius: t.radius.lg,
  },
  flush: { overflow: 'hidden' },
}));

/** A white card with a hairline edge: the container for every section in the mockups. */
export function Panel({
  p = 4,
  gap = 3,
  flush,
  children,
}: {
  p?: SpaceKey;
  gap?: SpaceKey;
  /** No padding, clipped corners: for a map or photo that fills the card. */
  flush?: boolean;
  children: ReactNode;
}) {
  const styles = useStyles();
  return (
    <KlozView
      as="section"
      p={flush ? 0 : p}
      gap={flush ? 0 : gap}
      style={[styles.panel, flush && styles.flush]}
    >
      {children}
    </KlozView>
  );
}

/** A section heading with an optional link on the right: "Trusted services nearby · See all". */
export function SectionHeading({
  title,
  level = 2,
  size = 'title-3',
  sub,
  link,
}: {
  title: string;
  level?: 1 | 2 | 3;
  size?: 'title-1' | 'title-2' | 'title-3' | 'label';
  sub?: string;
  link?: { label: string; href?: string; onPress?: () => void };
}) {
  return (
    <KlozView row wrap justify="between" align="end" gap={2}>
      <KlozView gap={0.5}>
        <KlozText variant={size} level={level}>
          {title}
        </KlozText>
        {sub && (
          <KlozText variant="body-sm" tone="secondary">
            {sub}
          </KlozText>
        )}
      </KlozView>
      {link && (
        <KlozTap href={link.href} onPress={link.onPress}>
          <KlozText variant="label" tone="brand">
            {link.label}
          </KlozText>
        </KlozTap>
      )}
    </KlozView>
  );
}
