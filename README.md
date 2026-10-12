# Klozbuy

Find trusted shops and services near you in Nigerian cities, and contact them on WhatsApp.

This repository is a pnpm + Turborepo monorepo. The API and the web app both run on Cloudflare Workers; the same Expo app ships to iOS and Android later. The architecture is described in the [system design doc](https://claude.ai/code/artifact/LQMR1QMmQmiJ47Tfi3WnbX) and the UI in the [Kloz design system](https://claude.ai/artifact/HutLU4UUU3rQfgtrgye48n).

## Layout

```
apps/
  api/           Hono API on Cloudflare Workers (routes are thin: validate, call a service, map errors)
  app/           Expo Router app: server-rendered web on Workers, plus iOS and Android
packages/
  shared/        Pure utilities: IDs, money, text, H3 geo cells. Depends on nothing else.
  contracts/     Zod schemas shared by the API and the app (the API contract)
  db/            Drizzle schema, migrations and the TiDB client
  domain/        Business logic, one folder per module: identity, shops, catalog, discovery, leads
  api-client/    Typed client and React Query hooks for the app
  ui/            Kloz components: tokens, theme, KlozText, KlozView, KlozTap, KlozButton…
  config/        Shared TypeScript and ESLint config
legacy/next-app/ The previous Next.js app, kept for reference only (not built or linted)
```

Import rules are enforced by `pnpm boundaries` (dependency-cruiser): packages never import apps, the app never imports `db` or `domain`, `ui` knows nothing about data, and a domain module is imported only through its `index.ts`.

## Requirements

- Node 22 (`.nvmrc`) and pnpm 10 (`corepack enable`)
- Docker, for a local TiDB

## Run it locally

```sh
pnpm install

# A local TiDB (the same engine as TiDB Cloud)
docker run -d --name klozbuy-tidb -p 4000:4000 pingcap/tidb:v8.5.3
DATABASE_URL=mysql://root@127.0.0.1:4000/klozbuy_local pnpm db:setup:local
pnpm --filter @klozbuy/api demo-data   # optional: five shops and listings around Yaba

# API on http://localhost:8787 (Node, against the local TiDB)
pnpm dev:api

# Web app on http://localhost:8081
cp apps/app/.env.example apps/app/.env.local
pnpm dev:web
```

Open http://localhost:8081 for the near-me feed. To sell, tap **Sell**: sign in with any Nigerian mobile number (for example 0803 555 1234; in development no SMS is sent and the code is printed in the API's terminal), open a shop and add listings.

Why the API runs in Node locally: the deployed worker talks to TiDB Cloud over its HTTP driver, which a local TiDB does not serve. `pnpm dev:api` runs the same Hono app with a plain MySQL connection instead. To run the real worker in `wrangler dev` against a TiDB Cloud dev cluster, copy `apps/api/.dev.vars.example` to `.dev.vars` and run `pnpm --filter @klozbuy/api dev`.

## Checks

`pnpm check` runs what CI runs: formatting, lint (including the size limits: 40 lines per function, 150 per component, 300 per file, complexity 10), boundaries, type checks and tests.

Database tests (sign-in and profile against a real TiDB) run when `TEST_DATABASE_URL` is set; the test database is dropped and recreated on each run, so its name must contain `test`:

```sh
TEST_DATABASE_URL=mysql://root@127.0.0.1:4000/klozbuy_test pnpm test
```

## Database

- The schema lives in `packages/db/src/schema`, one file per module. Conventions: 16-character random IDs, money as whole naira (`BIGINT`), UTC `DATETIME(3)`, `created_at` and `updated_at` on every table. `schema.test.ts` checks these for every table.
- After changing the schema, run `pnpm db:generate` and commit the new file in `packages/db/drizzle`. CI fails if the schema and migrations disagree.
- Apply migrations with `DATABASE_URL=… pnpm db:migrate`. Change columns expand-then-contract (add, backfill, switch code, then drop) so the running version never breaks.

## Deploy

Each worker has `staging` and `production` environments in its `wrangler.jsonc`.

API:

```sh
cd apps/api
npx wrangler secret put DATABASE_URL --env staging        # TiDB Cloud serverless driver URL
npx wrangler secret put BETTER_AUTH_SECRET --env staging  # openssl rand -base64 32
npx wrangler secret put TERMII_API_KEY --env staging      # SMS for sign-in codes
npx wrangler deploy --env staging
```

Web app:

```sh
cd apps/app
EXPO_PUBLIC_API_URL=https://api.staging.klozbuy.com pnpm build:web
npx wrangler deploy --env staging
```

The `klozbuy.com` hostnames in the configs are placeholders until the domain is settled.
