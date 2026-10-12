import { createStyles, KlozIcon, KlozTap, KlozText, KlozView } from '@klozbuy/ui';
import { TABS, type BuyerSection, type NavItem } from './nav-items';

const useStyles = createStyles((t) => ({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: t.spacing[1] + 2,
    paddingBottom: t.spacing[3],
    paddingHorizontal: t.spacing[1],
    backgroundColor: t.colors.bgSurface,
    borderTopWidth: t.stroke.hairline,
    borderTopColor: t.colors.borderDefault,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  fab: {
    width: 50,
    height: 50,
    marginTop: -26,
    borderRadius: t.radius.full,
    borderWidth: 4,
    borderColor: t.colors.bgSurface,
    backgroundColor: t.colors.actionPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function Tab({ item, current }: { item: NavItem; current: boolean }) {
  const styles = useStyles();
  const centre = item.key === 'requests';
  const tone = current ? 'brand' : centre ? 'primary' : 'secondary';
  return (
    <KlozTap href={item.href} style={styles.tab} pressed={current}>
      {centre ? (
        <KlozView style={styles.fab}>
          <KlozIcon name={item.icon} tone="on-action" />
        </KlozView>
      ) : (
        <KlozIcon name={item.icon} tone={tone} />
      )}
      <KlozText variant="caption" tone={tone}>
        {item.label}
      </KlozText>
    </KlozTap>
  );
}

/** Phones: the five places a buyer goes, with "Request" in the middle. */
export function BottomTabs({ active }: { active: BuyerSection }) {
  const styles = useStyles();
  return (
    <KlozView as="nav" style={styles.bar}>
      {TABS.map((item) => (
        <Tab key={item.key} item={item} current={item.key === active} />
      ))}
    </KlozView>
  );
}
