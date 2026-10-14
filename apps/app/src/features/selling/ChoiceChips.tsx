import { KlozChip, KlozText, KlozView } from '@klozbuy/ui';

export interface Choice<T extends string> {
  value: T;
  label: string;
}

/** A labelled group of chips where one can be chosen, like a radio group. */
export function ChoiceChips<T extends string>({
  label,
  choices,
  value,
  onChange,
  error,
}: {
  label: string;
  choices: Choice<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  error?: string;
}) {
  return (
    <KlozView gap={2}>
      <KlozText variant="label">{label}</KlozText>
      <KlozView row wrap gap={2}>
        {choices.map((choice) => (
          <KlozChip
            key={choice.value}
            selected={value === choice.value}
            onPress={() => onChange(choice.value)}
          >
            {choice.label}
          </KlozChip>
        ))}
      </KlozView>
      {error && (
        <KlozText variant="caption" tone="danger" announce>
          {error}
        </KlozText>
      )}
    </KlozView>
  );
}
