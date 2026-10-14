/**
 * Architecture rules from the system design doc. `pnpm boundaries` fails when code
 * crosses a boundary, so the structure stays as designed as the codebase grows.
 */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'packages-never-import-apps',
      severity: 'error',
      from: { path: '^packages/' },
      to: { path: '^apps/' },
    },
    {
      name: 'shared-is-standalone',
      comment: 'packages/shared holds pure utilities and depends on no other workspace package.',
      severity: 'error',
      from: { path: '^packages/shared/' },
      to: { path: '^packages/(?!shared/)' },
    },
    {
      name: 'contracts-only-shared',
      severity: 'error',
      from: { path: '^packages/contracts/' },
      to: { path: '^packages/(db|domain|ui|api-client)/' },
    },
    {
      name: 'db-below-domain',
      severity: 'error',
      from: { path: '^packages/db/' },
      to: { path: '^packages/(domain|ui|api-client)/' },
    },
    {
      name: 'ui-knows-no-data',
      comment: 'The design system must not depend on data access or business rules.',
      severity: 'error',
      from: { path: '^packages/ui/' },
      to: { path: '^packages/(db|domain|contracts|api-client)/' },
    },
    {
      name: 'api-client-knows-contracts-only',
      comment: 'The client speaks the API contract; it never reaches past the API.',
      severity: 'error',
      from: { path: '^packages/api-client/' },
      to: { path: '^packages/(db|domain|ui)/' },
    },
    {
      name: 'app-talks-to-api-only',
      comment: 'The Expo app reaches data through the API, never the database or domain code.',
      severity: 'error',
      from: { path: '^apps/app/' },
      to: { path: '^packages/(db|domain)/' },
    },
    {
      name: 'domain-module-boundaries',
      comment: 'Import another domain module only through its index.ts.',
      severity: 'error',
      from: { path: '^packages/domain/src/([^/]+)/' },
      to: {
        path: '^packages/domain/src/[^/]+/(?!index\\.ts$)',
        pathNot: '^packages/domain/src/$1/',
      },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: '(^|/)(node_modules|dist|\\.expo|\\.wrangler|drizzle)/' },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'types', 'default'],
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
  },
};
