import {
  createListingInputSchema,
  type CreateListingInput,
  type Listing,
} from '@klozbuy/contracts';

export interface ListingFormValues {
  type: Listing['type'];
  title: string;
  price: string;
  negotiable: boolean;
  condition?: NonNullable<Listing['condition']>;
  categoryId?: string;
  description: string;
}

export type ListingFormErrors = Partial<Record<keyof ListingFormValues, string>>;

/** Price as typed ("520,000" or "₦520000") to whole naira, or null. */
export function parsePrice(text: string): number | null {
  const digits = text.replace(/[^\d]/g, '');
  return digits ? Number(digits) : null;
}

function listingErrors(values: ListingFormValues, price: number | null): ListingFormErrors {
  const errors: ListingFormErrors = {};
  if (values.title.trim().length < 3) errors.title = 'Say what it is, like "iPhone 13, 128 GB".';
  if (price === null || price <= 0) errors.price = 'Enter the price in naira.';
  if (!values.categoryId) errors.categoryId = 'Choose a category.';
  if (values.type === 'product' && !values.condition) errors.condition = 'Choose the condition.';
  return errors;
}

export function validateListingForm(
  shopId: string,
  values: ListingFormValues,
): { input?: CreateListingInput; errors: ListingFormErrors } {
  const price = parsePrice(values.price);
  const errors = listingErrors(values, price);
  if (Object.keys(errors).length > 0) return { errors };
  const parsed = createListingInputSchema.safeParse({
    shopId,
    type: values.type,
    title: values.title,
    priceNgn: price,
    negotiable: values.negotiable,
    condition: values.type === 'product' ? values.condition : undefined,
    categoryId: values.categoryId,
    description: values.description.trim() || undefined,
  });
  return parsed.success
    ? { input: parsed.data, errors }
    : { errors: { title: 'Check the details and try again.' } };
}
