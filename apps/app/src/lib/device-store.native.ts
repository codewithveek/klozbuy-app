/** Native keeps these for the session only until the app adds on-device storage. */
const memory = new Map<string, unknown>();

export const readStored = <T>(key: string): T | null => (memory.get(key) as T | undefined) ?? null;
export const writeStored = (key: string, value: unknown): void => {
  memory.set(key, value);
};
