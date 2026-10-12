import { ApiError, useMyListings, useSendOffer } from '@klozbuy/api-client';
import { KlozButton, KlozChip, KlozInput, KlozText, KlozView } from '@klozbuy/ui';
import { useState } from 'react';

/** Price, a short note and, optionally, which of the shop's listings it is. */
export function SendOfferForm({
  shopId,
  requestId,
  onDone,
}: {
  shopId: string;
  requestId: string;
  onDone: () => void;
}) {
  const send = useSendOffer(shopId);
  const listings = useMyListings(shopId);
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [listingId, setListingId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const active = (listings.data ?? []).filter((l) => l.status === 'active').slice(0, 6);
  async function submit() {
    const priceNgn = Number(price.replace(/\D/g, ''));
    if (!priceNgn) return setError('Enter your price in naira');
    try {
      await send.mutateAsync({
        requestId,
        priceNgn,
        message: message.trim() || undefined,
        listingId,
      });
      onDone();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Could not send the offer. Try again.');
    }
  }
  return (
    <KlozView gap={3} p={4} bg="subtle" radius="md">
      <KlozInput
        id={`price-${requestId}`}
        label="Your price"
        prefix="₦"
        type="number"
        value={price}
        onChangeText={setPrice}
        error={error ?? undefined}
      />
      <KlozInput
        id={`note-${requestId}`}
        label="Note to the buyer (optional)"
        placeholder="Sealed, 6-month warranty. Come and test it."
        value={message}
        onChangeText={setMessage}
        maxLength={500}
      />
      {active.length > 0 && (
        <KlozView gap={2}>
          <KlozText variant="label">Link one of your listings (optional)</KlozText>
          <KlozView row wrap gap={2}>
            {active.map((l) => (
              <KlozChip
                key={l.id}
                selected={listingId === l.id}
                onPress={() => setListingId(listingId === l.id ? undefined : l.id)}
              >
                {l.title}
              </KlozChip>
            ))}
          </KlozView>
        </KlozView>
      )}
      <KlozView row gap={2}>
        <KlozButton loading={send.isPending} onPress={submit}>
          Send offer
        </KlozButton>
        <KlozButton variant="ghost" onPress={onDone}>
          Cancel
        </KlozButton>
      </KlozView>
    </KlozView>
  );
}
