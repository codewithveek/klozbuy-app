import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { createStyles } from './createStyles';
import { createVariants } from './createVariants';
import { ThemeProvider } from './ThemeProvider';
import type { ThemeName } from './themes';

const wrapper =
  (scheme: ThemeName) =>
  ({ children }: { children: ReactNode }) => (
    <ThemeProvider scheme={scheme}>{children}</ThemeProvider>
  );

const useCardStyles = createStyles((t) => ({ card: { backgroundColor: t.colors.bgSurface } }));

const useChipStyles = createVariants((t) => ({
  base: { borderRadius: t.radius.full },
  variants: {
    selected: {
      no: { backgroundColor: t.colors.bgSurface },
      yes: { backgroundColor: t.colors.bgInverse },
    },
  },
  defaults: { selected: 'no' },
}));

describe('createStyles', () => {
  it('builds styles once per theme and reuses them', () => {
    const first = renderHook(useCardStyles, { wrapper: wrapper('light') }).result.current;
    const again = renderHook(useCardStyles, { wrapper: wrapper('light') }).result.current;
    const dark = renderHook(useCardStyles, { wrapper: wrapper('dark') }).result.current;
    expect(again).toBe(first);
    expect(dark).not.toBe(first);
    expect(first.card.backgroundColor).toBe('#ffffff');
    expect(dark.card.backgroundColor).toBe('#171c19');
  });
});

describe('createVariants', () => {
  it('returns the same array for the same selection', () => {
    const { result, rerender } = renderHook(({ selected }) => useChipStyles({ selected }), {
      wrapper: wrapper('light'),
      initialProps: { selected: 'yes' as 'yes' | 'no' },
    });
    const first = result.current;
    rerender({ selected: 'yes' });
    expect(result.current).toBe(first);
    expect(first).toEqual([{ borderRadius: 999 }, { backgroundColor: '#121a15' }]);
  });

  it('falls back to defaults', () => {
    const { result } = renderHook(() => useChipStyles({}), { wrapper: wrapper('light') });
    expect(result.current[1]).toEqual({ backgroundColor: '#ffffff' });
  });
});
