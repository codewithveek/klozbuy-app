import { ApiError, useUpdateShop } from '@klozbuy/api-client';
import type { MyShop } from '@klozbuy/contracts';
import { KlozButton, KlozChip, KlozInput, KlozText, KlozView } from '@klozbuy/ui';
import { useState } from 'react';
import { Panel, SectionHeading } from '../../../lib/Panel';
import {
  profileValues,
  validateProfile,
  type ProfileErrors,
  type ProfileValues,
} from '../profile-form';
import { SellerShell } from '../shell/SellerShell';
import { PageTitle } from './PageTitle';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Hours({
  values,
  errors,
  set,
}: {
  values: ProfileValues;
  errors: ProfileErrors;
  set: (p: Partial<ProfileValues>) => void;
}) {
  const toggle = (day: number) =>
    set({
      openDays: values.openDays.includes(day)
        ? values.openDays.filter((d) => d !== day)
        : [...values.openDays, day],
    });
  return (
    <Panel p={5}>
      <SectionHeading
        title="Opening hours"
        sub="Lagos time. Buyers see “Open now” or when you open next."
      />
      <KlozView row wrap gap={3}>
        <KlozView flex={1}>
          <KlozInput
            label="Opens"
            placeholder="08:00"
            value={values.opensAt}
            onChangeText={(opensAt) => set({ opensAt })}
            error={errors.opensAt}
            maxLength={5}
          />
        </KlozView>
        <KlozView flex={1}>
          <KlozInput
            label="Closes"
            placeholder="19:00"
            value={values.closesAt}
            onChangeText={(closesAt) => set({ closesAt })}
            error={errors.closesAt}
            maxLength={5}
          />
        </KlozView>
      </KlozView>
      <KlozView row wrap gap={2}>
        {DAYS.map((label, i) => (
          <KlozChip
            key={label}
            selected={values.openDays.includes(i + 1)}
            onPress={() => toggle(i + 1)}
          >
            {label}
          </KlozChip>
        ))}
      </KlozView>
      {errors.openDays && (
        <KlozText variant="caption" tone="danger" announce>
          {errors.openDays}
        </KlozText>
      )}
    </Panel>
  );
}

function ProfileForm({ shop }: { shop: MyShop }) {
  const update = useUpdateShop(shop.id);
  const [values, setValues] = useState(() => profileValues(shop));
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saved, setSaved] = useState(false);
  const set = (patch: Partial<ProfileValues>) => {
    setSaved(false);
    setValues((v) => ({ ...v, ...patch }));
  };
  async function save() {
    const { input, errors: found } = validateProfile(values);
    setErrors(found);
    if (!input) return;
    try {
      await update.mutateAsync(input);
      setSaved(true);
    } catch (cause) {
      setErrors({ name: cause instanceof ApiError ? cause.message : 'Could not save. Try again.' });
    }
  }
  return (
    <>
      <Panel p={5}>
        <SectionHeading title="About the shop" />
        <KlozInput
          label="Shop name"
          value={values.name}
          onChangeText={(name) => set({ name })}
          error={errors.name}
        />
        <KlozInput
          label="Description"
          multiline
          placeholder="What you sell and why buyers come to you"
          value={values.description}
          onChangeText={(description) => set({ description })}
          maxLength={500}
        />
        <KlozInput
          label="WhatsApp number"
          type="tel"
          value={values.whatsapp}
          onChangeText={(whatsapp) => set({ whatsapp })}
          error={errors.whatsapp}
          hint="Buyers never see it; Klozbuy opens WhatsApp for them."
        />
      </Panel>
      <Hours values={values} errors={errors} set={set} />
      <KlozView row align="center" gap={3}>
        <KlozButton loading={update.isPending} onPress={save}>
          Save changes
        </KlozButton>
        {saved && (
          <KlozText variant="body-sm" tone="brand" announce>
            Saved
          </KlozText>
        )}
      </KlozView>
    </>
  );
}

export function ProfilePage({ shopId }: { shopId: string }) {
  return (
    <SellerShell shopId={shopId} active="profile">
      {(shop) => (
        <>
          <PageTitle title="Shop profile" sub="What buyers see on your shop page and listings" />
          <ProfileForm shop={shop} />
        </>
      )}
    </SellerShell>
  );
}
