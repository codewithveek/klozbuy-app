import { useMyShops } from '@klozbuy/api-client';
import type { MyShop } from '@klozbuy/contracts';
import {
  avatarTone,
  createStyles,
  KlozAvatar,
  KlozIcon,
  KlozPopover,
  KlozTap,
  KlozText,
  KlozView,
} from '@klozbuy/ui';
import { useState } from 'react';

const useStyles = createStyles((t) => ({
  anchor: { position: 'relative', zIndex: 40 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[2] + 2,
    minHeight: 46,
    paddingLeft: t.spacing[1] + 2,
    paddingRight: t.spacing[3],
    borderRadius: t.radius.full,
    borderWidth: t.stroke.hairline,
    borderColor: t.colors.borderStrong,
    backgroundColor: t.colors.bgSurface,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: t.spacing[2],
    paddingHorizontal: t.spacing[2],
  },
  list: { minWidth: 240 },
}));

/** The current shop, and the seller's other shops when there are any. */
export function ShopSwitcher({ shop }: { shop: MyShop }) {
  const styles = useStyles();
  const shops = useMyShops();
  const [open, setOpen] = useState(false);
  const others = (shops.data ?? []).filter((s) => s.id !== shop.id);
  if (others.length === 0) {
    return (
      <KlozView style={styles.pill}>
        <KlozAvatar name={shop.name} tone={avatarTone(shop.name)} />
        <KlozText variant="label">{shop.name}</KlozText>
      </KlozView>
    );
  }
  return (
    <KlozView style={styles.anchor}>
      <KlozTap
        accessibilityLabel={`Shop: ${shop.name}${others.length ? '. Switch shop' : ''}`}
        onPress={() => setOpen(!open)}
        style={styles.pill}
      >
        <KlozAvatar name={shop.name} tone={avatarTone(shop.name)} />
        <KlozText variant="label">{shop.name}</KlozText>
        {others.length > 0 && <KlozIcon name="chevron-down" size={16} tone="secondary" />}
      </KlozTap>
      {open && (
        <KlozPopover onClose={() => setOpen(false)}>
          <KlozView style={styles.list}>
            {others.map((other) => (
              <KlozTap
                key={other.id}
                href={`/sell/${other.id}`}
                style={styles.option}
                onPress={() => setOpen(false)}
              >
                <KlozAvatar name={other.name} size="sm" tone={avatarTone(other.name)} />
                <KlozText>{other.name}</KlozText>
              </KlozTap>
            ))}
          </KlozView>
        </KlozPopover>
      )}
    </KlozView>
  );
}
