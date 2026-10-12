import { useCategories } from '@klozbuy/api-client';
import type { Listing } from '@klozbuy/contracts';
import { KlozChip, KlozMenu, KlozView } from '@klozbuy/ui';
import { ScrollView } from 'react-native';

interface Props {
  type: Listing['type'];
  value?: string;
  onChange: (categoryId: string | undefined) => void;
}

/** How many categories show as chips on wide screens; the rest go in "More". */
const VISIBLE = 6;

function MoreMenu({ type, value, onChange }: Props) {
  const categories = useCategories();
  const rest = (categories.data?.filter((c) => c.type === type) ?? []).slice(VISIBLE);
  if (rest.length === 0) return null;
  const current = rest.find((c) => c.id === value);
  return (
    <KlozMenu
      title="More categories"
      label={current ? current.name : 'More'}
      value={value ?? ''}
      options={rest.map((c) => ({ value: c.id, label: c.name }))}
      onChange={(id) => onChange(id)}
    />
  );
}

function Chips({ type, value, onChange, limit }: Props & { limit?: number }) {
  const categories = useCategories();
  const ofType = (categories.data?.filter((category) => category.type === type) ?? []).slice(
    0,
    limit,
  );
  return (
    <>
      <KlozChip selected={!value} onPress={() => onChange(undefined)}>
        All
      </KlozChip>
      {ofType.map((category) => (
        <KlozChip
          key={category.id}
          selected={value === category.id}
          onPress={() => onChange(category.id)}
        >
          {category.name}
        </KlozChip>
      ))}
    </>
  );
}

/** Categories as chips: wrapping on wide screens, one swipeable row on phones. */
export function CategoryChips(props: Props) {
  return (
    <>
      <KlozView row wrap align="center" gap={2} responsive="show-from-md" style={{ zIndex: 25 }}>
        <Chips {...props} limit={VISIBLE} />
        <MoreMenu {...props} />
      </KlozView>
      <KlozView responsive="show-below-md">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <KlozView row gap={2}>
            <Chips {...props} />
          </KlozView>
        </ScrollView>
      </KlozView>
    </>
  );
}
