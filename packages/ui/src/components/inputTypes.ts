import type { TextInputProps } from 'react-native';

export type InputType = 'text' | 'name' | 'tel' | 'number' | 'email' | 'search' | 'one-time-code';

/** Keyboard, autofill and capitalisation for each kind of field, on every platform. */
export const INPUT_TYPE_PROPS: Record<InputType, TextInputProps> = {
  text: {},
  name: { autoComplete: 'name', textContentType: 'name', autoCapitalize: 'words' },
  tel: { inputMode: 'tel', autoComplete: 'tel', textContentType: 'telephoneNumber' },
  number: { inputMode: 'numeric' },
  email: {
    inputMode: 'email',
    autoComplete: 'email',
    textContentType: 'emailAddress',
    autoCapitalize: 'none',
  },
  search: { inputMode: 'search', enterKeyHint: 'search' },
  'one-time-code': {
    inputMode: 'numeric',
    autoComplete: 'one-time-code',
    textContentType: 'oneTimeCode',
  },
};
