import { useCategories, useCreateListing } from '@klozbuy/api-client';
import { KlozButton, KlozChip, KlozInput, KlozText, KlozView } from '@klozbuy/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { AppHeader } from '../../lib/AppHeader';
import { CONDITION_LABELS } from '../../lib/format';
import { Page } from '../../lib/Page';
import { HeaderActions } from '../identity/HeaderActions';
import { ChoiceChips } from './ChoiceChips';
import {
  validateListingForm,
  type ListingFormErrors,
  type ListingFormValues,
} from './listing-form';

const CONDITIONS = (Object.keys(CONDITION_LABELS) as (keyof typeof CONDITION_LABELS)[]).map(
  (value) => ({ value, label: CONDITION_LABELS[value] }),
);
const TYPES = [
  { value: 'product' as const, label: 'An item' },
  { value: 'service' as const, label: 'A service' },
];

export function NewListingScreen({ shopId }: { shopId: string }) {
  const router = useRouter();
  const categories = useCategories();
  const create = useCreateListing();
  const [values, setValues] = useState<ListingFormValues>({
    type: 'product',
    title: '',
    price: '',
    negotiable: false,
    description: '',
  });
  const [errors, setErrors] = useState<ListingFormErrors>({});
  const set = (patch: Partial<ListingFormValues>) =>
    setValues((current) => ({ ...current, ...patch }));
  const categoryChoices = (categories.data ?? [])
    .filter((c) => c.type === values.type)
    .map((c) => ({ value: c.id, label: c.name }));

  async function submit() {
    const { input, errors: found } = validateListingForm(shopId, values);
    setErrors(found);
    if (!input) return;
    const listing = await create.mutateAsync(input).catch(() => null);
    if (listing) router.replace(`/sell/${shopId}`);
    else setErrors({ title: "We couldn't save the listing. Check your connection and try again." });
  }

  return (
    <Page width="narrow" header={<AppHeader actions={<HeaderActions />} />}>
      <KlozView gap={5} py={4}>
        <KlozText variant="title-1" level={1}>
          Add a listing
        </KlozText>
        <ChoiceChips
          label="What are you listing?"
          choices={TYPES}
          value={values.type}
          onChange={(type) => set({ type, categoryId: undefined })}
        />
        <KlozInput
          label="Title"
          placeholder={
            values.type === 'product' ? 'iPhone 13, 128 GB, UK used' : 'Phone screen replacement'
          }
          value={values.title}
          onChangeText={(title) => set({ title })}
          error={errors.title}
          testID="listing-title"
        />
        <KlozView gap={2}>
          <KlozInput
            label="Price"
            prefix="₦"
            type="number"
            placeholder="520,000"
            value={values.price}
            onChangeText={(price) => set({ price })}
            error={errors.price}
            testID="listing-price"
          />
          <KlozView row>
            <KlozChip
              selected={values.negotiable}
              icon="tag"
              onPress={() => set({ negotiable: !values.negotiable })}
            >
              Price is negotiable
            </KlozChip>
          </KlozView>
        </KlozView>
        {values.type === 'product' && (
          <ChoiceChips
            label="Condition"
            choices={CONDITIONS}
            value={values.condition}
            onChange={(condition) => set({ condition })}
            error={errors.condition}
          />
        )}
        <ChoiceChips
          label="Category"
          choices={categoryChoices}
          value={values.categoryId}
          onChange={(categoryId) => set({ categoryId })}
          error={errors.categoryId}
        />
        <KlozInput
          label="Description (optional)"
          multiline
          placeholder="What buyers should know: storage, colour, warranty, what is included."
          value={values.description}
          onChangeText={(description) => set({ description })}
        />
        <KlozButton
          size="lg"
          fullWidth
          loading={create.isPending}
          onPress={submit}
          testID="save-listing"
        >
          Put it on sale
        </KlozButton>
      </KlozView>
    </Page>
  );
}
