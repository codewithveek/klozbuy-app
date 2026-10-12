import type { MyShop } from '@klozbuy/contracts';
import { KlozBadge, KlozIcon, KlozTap, KlozText, KlozView } from '@klozbuy/ui';
import { verifiedLine } from '../../../lib/format';
import { Panel, SectionHeading } from '../../../lib/Panel';

interface Step {
  label: string;
  done: boolean;
  /** Where to fix it, when the seller can. */
  href?: string;
}

export function checklist(shop: MyShop): Step[] {
  const profile = `/sell/${shop.id}/profile`;
  return [
    {
      label: shop.verified ? verifiedLine(shop.verifiedAt) : 'Checked in person by Klozbuy',
      done: shop.verified,
    },
    { label: 'Shop location set', done: !!shop.location, href: profile },
    { label: 'Opening hours added', done: !!shop.hours.opensAt, href: profile },
    { label: 'Shop description added', done: !!shop.description, href: profile },
  ];
}

/** What makes buyers trust the shop, and what's left to do. */
export function ShopChecklist({ shop }: { shop: MyShop }) {
  const steps = checklist(shop);
  const done = steps.filter((s) => s.done).length;
  return (
    <Panel p={5}>
      <KlozView row justify="between" align="center">
        <SectionHeading title="Shop verification" />
        <KlozText variant="body-sm" tone="secondary">{`${done} of ${steps.length} done`}</KlozText>
      </KlozView>
      {steps.map((step) => (
        <KlozView key={step.label} row align="center" gap={2}>
          <KlozIcon
            name={step.done ? 'check-circle' : 'circle'}
            tone={step.done ? 'brand' : 'tertiary'}
          />
          <KlozView flex={1}>
            <KlozText variant="body-sm" tone={step.done ? 'primary' : 'secondary'}>
              {step.label}
            </KlozText>
          </KlozView>
          {!step.done && step.href && (
            <KlozTap href={step.href}>
              <KlozText variant="label" tone="brand">
                Add
              </KlozText>
            </KlozTap>
          )}
          {!step.done && !step.href && <KlozBadge tone="warning">Waiting for a visit</KlozBadge>}
        </KlozView>
      ))}
    </Panel>
  );
}

/** Boosts aren't on sale yet; the card says what they will do, without a buy button. */
export function BoostCard() {
  return (
    <Panel p={5}>
      <SectionHeading title="Boost a listing" />
      <KlozText variant="body-sm" tone="secondary">
        Soon you’ll be able to show a listing at the top of its category for buyers up to 5 km away,
        for 7 days.
      </KlozText>
      <KlozBadge icon="clock">Coming soon</KlozBadge>
    </Panel>
  );
}
