import { useState } from 'react';
import { TextInput } from 'react-native';
import { KlozIcon, type IconName } from '../primitives/KlozIcon';
import { KlozText } from '../primitives/KlozText';
import { KlozView } from '../primitives/KlozView';
import { createStyles } from '../theme/createStyles';
import { fontFor } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';
import { INPUT_TYPE_PROPS, type InputType } from './inputTypes';

const useStyles = createStyles((t) => ({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[2],
    minHeight: t.control.md,
    paddingHorizontal: t.spacing[3],
    borderRadius: t.radius.md,
    borderWidth: t.stroke.hairline,
    borderColor: t.colors.borderStrong,
    backgroundColor: t.colors.bgSurface,
  },
  // A 2px edge without moving the text: one pixel more border, one pixel less padding.
  focused: {
    borderWidth: t.stroke.focus,
    paddingHorizontal: t.spacing[3] - 1,
    borderColor: t.colors.focusRing,
  },
  invalid: { borderColor: t.colors.dangerFg, backgroundColor: t.colors.dangerBg },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    fontSize: t.type.body.fontSize,
    ...fontFor(t.type.body.fontWeight),
    color: t.colors.textPrimary,
    // The field draws the focus edge, so the browser's own outline would double it.
    outlineWidth: 0,
  },
}));

export interface KlozInputProps {
  label?: string;
  /** Element ID for the label link. Defaults to one made from the label; set it when a screen shows two fields with the same label. */
  id?: string;
  /** Required when there is no visible label. */
  accessibilityLabel?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  hint?: string;
  /** Shows the field in the error state and replaces the hint. */
  error?: string;
  /** Text before the value, e.g. "+234" or "₦". */
  prefix?: string;
  leading?: IconName;
  type?: InputType;
  maxLength?: number;
  autoFocus?: boolean;
  editable?: boolean;
  onSubmitEditing?: () => void;
  testID?: string;
}

/**
 * A stable ID made from the label. React's useId would differ between the server render and
 * the browser here, because Expo Router's server tree is not identical to the client's.
 */
function fieldId(label: string): string {
  return `field-${label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;
}

function FieldMessage({ hint, error }: Pick<KlozInputProps, 'hint' | 'error'>) {
  if (error !== undefined) {
    return (
      <KlozText variant="caption" tone="danger" announce>
        {error}
      </KlozText>
    );
  }
  return hint === undefined ? null : (
    <KlozText variant="caption" tone="secondary">
      {hint}
    </KlozText>
  );
}

export function KlozInput({
  label,
  id,
  hint,
  error,
  prefix,
  leading,
  type = 'text',
  ...inputProps
}: KlozInputProps) {
  const styles = useStyles();
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const labelId = id ?? (label ? fieldId(label) : undefined);
  return (
    <KlozView gap={1}>
      {label && (
        <KlozText variant="label" nativeID={labelId}>
          {label}
        </KlozText>
      )}
      <KlozView
        style={[styles.field, focused && styles.focused, error !== undefined && styles.invalid]}
      >
        {leading && <KlozIcon name={leading} tone="secondary" />}
        {prefix && <KlozText tone="secondary">{prefix}</KlozText>}
        <TextInput
          {...INPUT_TYPE_PROPS[type]}
          {...inputProps}
          aria-labelledby={label ? labelId : undefined}
          placeholderTextColor={theme.colors.textTertiary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
        />
      </KlozView>
      <FieldMessage hint={hint} error={error} />
    </KlozView>
  );
}
