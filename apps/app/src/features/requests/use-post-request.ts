import { ApiError, useCreateRequest, useMe } from '@klozbuy/api-client';
import { router } from 'expo-router';
import { useState } from 'react';
import { useBuyerLocation } from '../location/LocationProvider';

/**
 * Posting a request from anywhere: signed-out buyers go to sign in first and come back to
 * the requests page with their words kept.
 */
export function usePostRequest() {
  const me = useMe();
  const { location } = useBuyerLocation();
  const create = useCreateRequest();
  const [error, setError] = useState<string | null>(null);
  async function post(text: string, budgetNgn?: number) {
    setError(null);
    const words = text.trim();
    if (words.length < 5) {
      setError('Say what you need, like "PS5 slim under ₦600k"');
      return null;
    }
    if (!me.data) {
      const next = `/requests?text=${encodeURIComponent(words)}`;
      router.push(`/sign-in?next=${encodeURIComponent(next)}`);
      return null;
    }
    try {
      return await create.mutateAsync({
        text: words,
        budgetNgn,
        lat: location.lat,
        lng: location.lng,
      });
    } catch (cause) {
      setError(
        cause instanceof ApiError ? cause.message : 'Could not post your request. Try again.',
      );
      return null;
    }
  }
  return { post, error, posting: create.isPending };
}
