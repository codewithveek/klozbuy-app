import { createApiClient } from '@klozbuy/api-client';
import { API_URL } from './config';

/** For loaders and metadata on the server: public reads only, no session. */
export const serverApi = createApiClient({ baseUrl: API_URL });

/** Null for a missing page instead of an exception, so the screen can show "not found". */
export async function orNull<T>(load: () => Promise<T>): Promise<T | null> {
  try {
    return await load();
  } catch {
    return null;
  }
}
