import {
  createShopWithLocationInputSchema,
  type CreateShopWithLocationInput,
} from '@klozbuy/contracts';
import { toInternationalPhone } from '../identity/phone';

export interface ShopFormValues {
  name: string;
  categoryId?: string;
  whatsapp: string;
  landmark: string;
  point?: { lat: number; lng: number };
}

export type ShopFormErrors = Partial<Record<keyof ShopFormValues, string>>;

/** Turns the form into the API input, or says which fields need attention, in plain words. */
export function validateShopForm(values: ShopFormValues): {
  input?: CreateShopWithLocationInput;
  errors: ShopFormErrors;
} {
  const errors: ShopFormErrors = {};
  const whatsapp = toInternationalPhone(values.whatsapp);
  if (values.name.trim().length < 2) errors.name = 'Enter the shop name your customers know.';
  if (!values.categoryId) errors.categoryId = 'Choose what you mostly sell.';
  if (!whatsapp) errors.whatsapp = 'Enter a Nigerian WhatsApp number, like 0803 123 4567.';
  if (values.landmark.trim().length < 3)
    errors.landmark = 'Describe how people find you, like "Opposite Yaba bus stop".';
  if (!values.point) errors.point = 'Choose your area or use your location.';
  if (Object.keys(errors).length > 0) return { errors };
  const parsed = createShopWithLocationInputSchema.safeParse({
    name: values.name,
    categoryId: values.categoryId,
    whatsappNumber: whatsapp,
    location: { ...values.point, landmark: values.landmark },
  });
  return parsed.success
    ? { input: parsed.data, errors }
    : { errors: { name: 'Check the details and try again.' } };
}
