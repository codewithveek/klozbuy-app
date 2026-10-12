import type { Brand } from './brand';

/** Web Crypto exists in Workers, Node and browsers; declared here so shared stays free of DOM types. */
declare const crypto: { getRandomValues<T extends Uint8Array>(array: T): T };

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const ID_LENGTH = 16;
export const ID_PATTERN = /^[0-9A-Za-z]{16}$/;

export type Id<Name extends string> = Brand<string, Name>;

/**
 * A random 16-character ID (about 95 bits). Random rather than time-ordered so
 * TiDB spreads writes across storage regions instead of creating a hotspot.
 */
export function createId<Name extends string>(): Id<Name> {
  let id = '';
  while (id.length < ID_LENGTH) {
    const bytes = crypto.getRandomValues(new Uint8Array(ID_LENGTH * 2));
    for (const byte of bytes) {
      // 6 bits give 0..63; dropping 62 and 63 avoids bias toward the first characters.
      const index = byte & 63;
      if (index < ALPHABET.length && id.length < ID_LENGTH) id += ALPHABET.charAt(index);
    }
  }
  return id as Id<Name>;
}

/** Checks an ID from outside (a URL, a session) and narrows it to the branded type. */
export function isId<Name extends string>(value: string): value is Id<Name> {
  return ID_PATTERN.test(value);
}
