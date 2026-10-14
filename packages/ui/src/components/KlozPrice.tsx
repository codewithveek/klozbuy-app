import { formatNaira, toNaira } from '@klozbuy/shared';
import { KlozText } from '../primitives/KlozText';

export interface KlozPriceProps {
  /** Whole naira. */
  amount: number;
  size?: 'md' | 'lg';
}

/** Naira with thousands separators and tabular figures: ₦520,000. */
export function KlozPrice({ amount, size = 'md' }: KlozPriceProps) {
  return (
    <KlozText variant={size === 'lg' ? 'price-lg' : 'price'}>
      {formatNaira(toNaira(amount))}
    </KlozText>
  );
}
