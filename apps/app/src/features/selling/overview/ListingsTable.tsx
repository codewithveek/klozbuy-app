import { useConfirmStock, useSetListingStatus } from '@klozbuy/api-client';
import type { Listing } from '@klozbuy/contracts';
import { formatNaira, toNaira } from '@klozbuy/shared';
import {
  createStyles,
  KlozBadge,
  KlozButton,
  KlozIcon,
  KlozTap,
  KlozText,
  KlozView,
} from '@klozbuy/ui';
import { ScrollView } from 'react-native';
import { CONDITION_LABELS, daysAgo } from '../../../lib/format';

export interface ListingRowData {
  id: string;
  slug: string;
  title: string;
  type: Listing['type'];
  condition: Listing['condition'];
  priceNgn: number;
  stockStatus: Listing['stockStatus'];
  status: Listing['status'];
  views: number;
  whatsapp: number;
  updatedAt: string;
}

const useStyles = createStyles((t) => ({
  table: { minWidth: 760, width: '100%' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: t.spacing[3],
    borderBottomWidth: t.stroke.hairline,
    borderBottomColor: t.colors.borderDefault,
  },
  head: { paddingVertical: t.spacing[2] + 2 },
  item: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[3],
    paddingRight: t.spacing[3],
  },
  cell: { flex: 1, paddingHorizontal: t.spacing[2] },
  num: { flex: 1, paddingHorizontal: t.spacing[2], alignItems: 'flex-end' },
  actions: { flex: 2, flexDirection: 'row', justifyContent: 'flex-end', gap: t.spacing[2] },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function StockBadge({ row }: { row: ListingRowData }) {
  if (row.status === 'sold') return <KlozBadge tone="inverse">Sold</KlozBadge>;
  if (row.status !== 'active') return <KlozBadge>Hidden</KlozBadge>;
  if (row.stockStatus === 'out_of_stock') return <KlozBadge>Sold out</KlozBadge>;
  if (row.stockStatus === 'low') return <KlozBadge tone="warning">Low stock</KlozBadge>;
  return <KlozBadge tone="brand">In stock</KlozBadge>;
}

function RowActions({ row }: { row: ListingRowData }) {
  const confirm = useConfirmStock();
  const setStatus = useSetListingStatus();
  const busy = confirm.isPending || setStatus.isPending;
  if (row.status !== 'active') {
    return (
      <KlozButton
        size="sm"
        variant="brand-outline"
        disabled={busy}
        onPress={() => setStatus.mutate({ id: row.id, status: 'active' })}
      >
        Put back on sale
      </KlozButton>
    );
  }
  return (
    <>
      <KlozButton size="sm" variant="ghost" disabled={busy} onPress={() => confirm.mutate(row.id)}>
        Still in stock
      </KlozButton>
      <KlozButton
        size="sm"
        variant="outline"
        disabled={busy}
        onPress={() => setStatus.mutate({ id: row.id, status: 'sold' })}
      >
        Mark sold
      </KlozButton>
    </>
  );
}

function Row({ row, now }: { row: ListingRowData; now: Date }) {
  const styles = useStyles();
  return (
    <KlozView style={styles.row}>
      <KlozView style={styles.item}>
        <KlozView style={styles.thumb}>
          <KlozIcon name={row.type === 'service' ? 'wrench' : 'tag'} size={16} tone="tertiary" />
        </KlozView>
        <KlozTap href={`/l/${row.slug}`} style={{ flex: 1 }}>
          <KlozText variant="body-strong" numberOfLines={1}>
            {row.title}
          </KlozText>
          {row.condition && (
            <KlozText variant="caption" tone="secondary">
              {CONDITION_LABELS[row.condition]}
            </KlozText>
          )}
        </KlozTap>
      </KlozView>
      <KlozView style={styles.cell}>
        <KlozText variant="body-sm">{formatNaira(toNaira(row.priceNgn))}</KlozText>
      </KlozView>
      <KlozView style={styles.cell}>
        <StockBadge row={row} />
      </KlozView>
      <KlozView style={styles.num}>
        <KlozText variant="body-sm">{String(row.views)}</KlozText>
      </KlozView>
      <KlozView style={styles.num}>
        <KlozText variant="label">{String(row.whatsapp)}</KlozText>
      </KlozView>
      <KlozView style={styles.cell}>
        <KlozText variant="body-sm" tone="secondary">
          {daysAgo(row.updatedAt, now).replace(/^./, (c) => c.toUpperCase())}
        </KlozText>
      </KlozView>
      <KlozView style={styles.actions}>
        <RowActions row={row} />
      </KlozView>
    </KlozView>
  );
}

const HEAD: [string, 'item' | 'cell' | 'num' | 'actions'][] = [
  ['Item', 'item'],
  ['Price', 'cell'],
  ['Stock', 'cell'],
  ['Views', 'num'],
  ['WhatsApp chats', 'num'],
  ['Updated', 'cell'],
  ['', 'actions'],
];

/** Listings with their figures and the everyday actions; scrolls sideways on phones. */
export function ListingsTable({ rows }: { rows: ListingRowData[] }) {
  const styles = useStyles();
  const now = new Date();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <KlozView style={styles.table} as="list">
        <KlozView style={[styles.row, styles.head]}>
          {HEAD.map(([label, kind]) => (
            <KlozView key={kind + label} style={styles[kind]}>
              <KlozText variant="caption" tone="secondary">
                {label}
              </KlozText>
            </KlozView>
          ))}
        </KlozView>
        {rows.map((row) => (
          <Row key={row.id} row={row} now={now} />
        ))}
      </KlozView>
    </ScrollView>
  );
}
