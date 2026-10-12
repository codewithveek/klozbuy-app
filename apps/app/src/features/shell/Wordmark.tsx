import { createStyles, KlozIcon, KlozTap, KlozText, KlozView } from '@klozbuy/ui';

const useStyles = createStyles((t) => ({
  mark: {
    width: 36,
    height: 36,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.actionPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: {
    paddingHorizontal: t.spacing[2] + 2,
    paddingVertical: 3,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.bgInverse,
  },
}));

/** Until there is a logo file: "Klozbuy" beside the map pin in a green square. */
export function Wordmark({ sellers = false }: { sellers?: boolean }) {
  const styles = useStyles();
  return (
    <KlozTap href="/" accessibilityLabel="Klozbuy home">
      <KlozView row align="center" gap={2}>
        <KlozView style={styles.mark}>
          <KlozIcon name="pin" tone="on-action" />
        </KlozView>
        <KlozText variant="title-2">Klozbuy</KlozText>
        {sellers && (
          <KlozView style={styles.tag} responsive="show-from-md">
            <KlozText variant="caption" tone="inverse">
              for sellers
            </KlozText>
          </KlozView>
        )}
      </KlozView>
    </KlozTap>
  );
}
