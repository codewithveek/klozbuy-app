declare const brand: unique symbol;

/**
 * A nominal type: `Brand<string, 'ListingId'>` is a string that can't be mixed up
 * with another branded string, such as a ShopId.
 */
export type Brand<T, Name extends string> = T & { readonly [brand]: Name };
