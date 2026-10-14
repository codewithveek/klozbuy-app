export {};

/** Values test/global-setup.ts provides to test files through inject(). */
declare module 'vitest' {
  export interface ProvidedContext {
    testDatabaseUrl: string | null;
  }
}
