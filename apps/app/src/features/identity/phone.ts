import { nigerianPhoneSchema } from '@klozbuy/contracts';

/**
 * Turns what people type into +234 form: "0803 123 4567", "803 123 4567",
 * "2348031234567" and "+234 803 123 4567" all work. Null when it is not a Nigerian mobile.
 */
export function toInternationalPhone(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  const national = digits.startsWith('234') ? digits.slice(3) : digits.replace(/^0/, '');
  const phone = `+234${national}`;
  return nigerianPhoneSchema.safeParse(phone).success ? phone : null;
}

/** +2348031234567 → 0803 123 4567, the way people write their own number. */
export function formatLocalPhone(phone: string): string {
  const national = `0${phone.replace(/^\+234/, '')}`;
  return `${national.slice(0, 4)} ${national.slice(4, 7)} ${national.slice(7)}`;
}
