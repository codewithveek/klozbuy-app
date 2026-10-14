import type { MyShop, UpdateShopInput } from '@klozbuy/contracts';
import { HOURS_PATTERN } from '@klozbuy/shared';
import { formatLocalPhone, toInternationalPhone } from '../identity/phone';

export interface ProfileValues {
  name: string;
  description: string;
  whatsapp: string;
  opensAt: string;
  closesAt: string;
  openDays: number[];
}

export type ProfileErrors = Partial<Record<keyof ProfileValues, string>>;

export function profileValues(shop: MyShop): ProfileValues {
  return {
    name: shop.name,
    description: shop.description ?? '',
    whatsapp: formatLocalPhone(shop.whatsappNumber),
    opensAt: shop.hours.opensAt ?? '',
    closesAt: shop.hours.closesAt ?? '',
    openDays: shop.hours.openDays,
  };
}

function hoursErrors(values: ProfileValues): ProfileErrors {
  const errors: ProfileErrors = {};
  const both = values.opensAt || values.closesAt;
  if (both && !HOURS_PATTERN.test(values.opensAt)) errors.opensAt = 'Use 24-hour time, like 08:00.';
  if (both && !HOURS_PATTERN.test(values.closesAt))
    errors.closesAt = 'Use 24-hour time, like 19:00.';
  if (both && values.openDays.length === 0) errors.openDays = 'Choose the days you open.';
  return errors;
}

/** The changes as API input, or plain-words errors for the fields that need attention. */
export function validateProfile(values: ProfileValues): {
  input?: UpdateShopInput;
  errors: ProfileErrors;
} {
  const whatsapp = toInternationalPhone(values.whatsapp);
  const errors: ProfileErrors = { ...hoursErrors(values) };
  if (values.name.trim().length < 2) errors.name = 'Enter the shop name your customers know.';
  if (!whatsapp) errors.whatsapp = 'Enter a Nigerian WhatsApp number, like 0803 123 4567.';
  if (Object.keys(errors).length > 0 || !whatsapp) return { errors };
  const hasHours = !!values.opensAt;
  return {
    errors,
    input: {
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      whatsappNumber: whatsapp,
      hours: hasHours
        ? {
            opensAt: values.opensAt,
            closesAt: values.closesAt,
            openDays: [...values.openDays].sort(),
          }
        : { opensAt: null, closesAt: null, openDays: [] },
    },
  };
}
