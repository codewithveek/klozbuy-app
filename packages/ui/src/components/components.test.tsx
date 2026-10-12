import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { KlozButton } from './KlozButton';
import { KlozInput } from './KlozInput';

describe('KlozButton', () => {
  it('ignores presses while loading and says it is busy', () => {
    const onPress = vi.fn();
    render(
      <KlozButton onPress={onPress} loading>
        Send code
      </KlozButton>,
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button.getAttribute('aria-busy')).toBe('true');
    // The label stays in place (hidden) so the button keeps its width.
    expect(button.textContent).toContain('Send code');
  });
});

describe('KlozInput', () => {
  it('is labelled by its visible label', () => {
    render(<KlozInput label="Phone number" prefix="+234" type="tel" />);
    const input = screen.getByLabelText('Phone number');
    expect(input.getAttribute('inputmode')).toBe('tel');
    expect(screen.getByText('+234')).toBeTruthy();
  });

  it('shows the error in place of the hint', () => {
    render(
      <KlozInput
        label="Code"
        hint="Sent by SMS"
        error="That code is wrong. Check it and try again."
      />,
    );
    expect(screen.queryByText('Sent by SMS')).toBeNull();
    expect(screen.getByText('That code is wrong. Check it and try again.')).toBeTruthy();
  });

  it('reports typed text', () => {
    const onChangeText = vi.fn();
    render(<KlozInput accessibilityLabel="Your name" onChangeText={onChangeText} />);
    fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Ọlá' } });
    expect(onChangeText).toHaveBeenCalledWith('Ọlá');
  });
});
