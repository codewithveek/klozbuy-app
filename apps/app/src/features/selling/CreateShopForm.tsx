import { useAreas, useCategories, useCreateShop, useMe } from '@klozbuy/api-client';
import { KlozButton, KlozChip, KlozInput, KlozText, KlozView } from '@klozbuy/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { formatLocalPhone } from '../identity/phone';
import { getDeviceLocation } from '../location/device-location';
import { ChoiceChips } from './ChoiceChips';
import { validateShopForm, type ShopFormErrors, type ShopFormValues } from './shop-form';

function WherePicker({
  values,
  onPick,
  error,
}: {
  values: ShopFormValues;
  onPick: (point: { lat: number; lng: number }, label: string) => void;
  error?: string;
}) {
  const areas = useAreas();
  const [picked, setPicked] = useState<string>();
  const pick = (point: { lat: number; lng: number }, label: string) => (
    setPicked(label),
    onPick(point, label)
  );
  return (
    <KlozView gap={2}>
      <KlozText variant="label">Where is the shop?</KlozText>
      <KlozView row wrap gap={2}>
        <KlozChip
          icon="navigate"
          selected={picked === 'device'}
          onPress={() =>
            getDeviceLocation().then(
              (p) => pick(p, 'device'),
              () => undefined,
            )
          }
        >
          I'm at the shop now
        </KlozChip>
        {areas.data?.map((area) => (
          <KlozChip
            key={area.id}
            selected={picked === area.slug}
            onPress={() => pick(area, area.slug)}
          >
            {area.name}
          </KlozChip>
        ))}
      </KlozView>
      <KlozText variant="caption" tone={error ? 'danger' : 'secondary'} announce={!!error}>
        {error ??
          (values.point
            ? 'Our team confirms the exact spot when they visit.'
            : 'Standing in the shop? Use "I\'m at the shop now" for the exact spot.')}
      </KlozText>
    </KlozView>
  );
}

/** Opening a shop takes one screen: name, what you sell, WhatsApp and where you are. */
export function CreateShopForm() {
  const router = useRouter();
  const me = useMe();
  const categories = useCategories();
  const create = useCreateShop();
  const [values, setValues] = useState<ShopFormValues>({
    name: '',
    whatsapp: me.data?.phoneNumber ? formatLocalPhone(me.data.phoneNumber) : '',
    landmark: '',
  });
  const [errors, setErrors] = useState<ShopFormErrors>({});
  const set = (patch: Partial<ShopFormValues>) =>
    setValues((current) => ({ ...current, ...patch }));

  async function submit() {
    const { input, errors: found } = validateShopForm(values);
    setErrors(found);
    if (!input) return;
    const shop = await create.mutateAsync(input).catch(() => null);
    if (shop) router.replace(`/sell/${shop.id}`);
    else setErrors({ name: "We couldn't open the shop. Check your connection and try again." });
  }

  return (
    <KlozView gap={5}>
      <KlozInput
        label="Shop name"
        placeholder="Tunde Gadgets"
        value={values.name}
        onChangeText={(name) => set({ name })}
        error={errors.name}
        testID="shop-name"
      />
      <ChoiceChips
        label="What do you mostly sell?"
        choices={(categories.data ?? []).map((c) => ({ value: c.id, label: c.name }))}
        value={values.categoryId}
        onChange={(categoryId) => set({ categoryId })}
        error={errors.categoryId}
      />
      <KlozInput
        label="WhatsApp number"
        prefix="+234"
        type="tel"
        placeholder="803 123 4567"
        hint="Buyers message you here. We never show it on the page."
        value={values.whatsapp}
        onChangeText={(whatsapp) => set({ whatsapp })}
        error={errors.whatsapp}
        testID="shop-whatsapp"
      />
      <KlozInput
        label="How do people find you?"
        placeholder="Opposite Yaba bus stop, Tejuosho Market Block C"
        value={values.landmark}
        onChangeText={(landmark) => set({ landmark })}
        error={errors.landmark}
        testID="shop-landmark"
      />
      <WherePicker values={values} onPick={(point) => set({ point })} error={errors.point} />
      <KlozButton
        size="lg"
        fullWidth
        loading={create.isPending}
        onPress={submit}
        testID="open-shop"
      >
        Open my shop
      </KlozButton>
    </KlozView>
  );
}
