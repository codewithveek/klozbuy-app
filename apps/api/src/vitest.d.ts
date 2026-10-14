export {};

/** Values test/global-setup.ts provides to test files through inject(). */
declare module 'vitest' {
  export interface ProvidedContext {
    apiTestDatabaseUrl: string | null;
  }
}
