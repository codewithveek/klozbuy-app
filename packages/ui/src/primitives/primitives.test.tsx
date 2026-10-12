import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { KlozTap } from './KlozTap';
import { KlozText } from './KlozText';
import { KlozView } from './KlozView';

describe('KlozText', () => {
  it('renders a heading of the given level for crawlers and screen readers', () => {
    render(
      <KlozText level={1} variant="title-1">
        In stock near you
      </KlozText>,
    );
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.tagName).toBe('H1');
    expect(heading.textContent).toBe('In stock near you');
  });

  it('is plain text without a level', () => {
    render(<KlozText>Tunde Gadgets</KlozText>);
    expect(screen.queryByRole('heading')).toBeNull();
  });
});

describe('KlozView', () => {
  it('renders landmarks as their HTML elements', () => {
    const { container } = render(
      <KlozView as="main">
        <KlozView as="nav" />
      </KlozView>,
    );
    expect(container.querySelector('main nav')).not.toBeNull();
  });
});

describe('KlozTap', () => {
  it('renders a real link when given an href', () => {
    render(<KlozTap href="/shops/tunde-gadgets">Tunde Gadgets</KlozTap>);
    expect(screen.getByRole('link').getAttribute('href')).toBe('/shops/tunde-gadgets');
  });

  it('calls onPress, and not when disabled', () => {
    const onPress = vi.fn();
    const { rerender } = render(<KlozTap onPress={onPress}>Save</KlozTap>);
    fireEvent.click(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledOnce();

    rerender(
      <KlozTap onPress={onPress} disabled>
        Save
      </KlozTap>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledOnce();
    expect(screen.getByRole('button').getAttribute('aria-disabled')).toBe('true');
  });
});
