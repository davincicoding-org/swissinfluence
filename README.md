# swissinfluence.ch — Web App & CMS

Next.js 15 application powered by Payload CMS and a Postgres database. Media is stored on an S3-compatible backend (Supabase Storage). Internationalization via `next-intl`. Sentry and Resend are integrated for monitoring and email.

### Stack

- **Framework**: Next.js 15, React 19
- **CMS**: Payload 3 (`@payloadcms/next`)
- **Database**: Postgres (`@payloadcms/db-postgres`)
- **Storage**: S3-compatible (Supabase Storage via S3 endpoint)
- **Email**: Resend + Mailchimp (marketing & transactional)
- **i18n**: `next-intl`
- **Styling**: Tailwind CSS 4
- **DX**: TypeScript, ESLint, Prettier, Storybook

## Prerequisites

- Node.js 20+
- pnpm 10+ (repo uses `packageManager: pnpm@10.x`)
- Docker or Podman (optional, for local Postgres via helper script)

## Quick start

1. Install dependencies

```bash
pnpm install
```

2. Configure environment

- Copy your env file and fill in values:

```bash
cp .env.example .env.development.local
```

- See the full variable list below. For local dev, you can temporarily bypass strict validation by prefixing commands with `SKIP_ENV_VALIDATION=1`.

3. (Optional) Start a local Postgres via Docker

```bash
./start-database.sh
```

This script reads `POSTGRES_URL` from `.env.development.local` and creates/starts a container named `<db>-postgres`.

4. Run database migrations and generate Payload types/import map

```bash
pnpm migrate
pnpm generate:types
pnpm generate:importmap
```

5. Start the app

```bash
pnpm dev
```

Now open the app and CMS:

- Site: http://localhost:3000
- Payload Admin: http://localhost:3000/admin
- GraphQL API: http://localhost:3000/api/graphql
- GraphQL Playground: http://localhost:3000/api/graphql-playground

## Environment variables

Environment is validated via `@t3-oss/env-nextjs` in `src/env.js`. For Vercel deployments, `BASE_URL` is auto-derived from Vercel env — you do not need to set it manually for prod/preview. For local dev, if unset, it defaults to `https://localhost:3000`.

- `NODE_ENV` (optional): development | test | production
- `POSTGRES_URL` (required): Postgres connection string
  - Example: `postgresql://postgres:password@localhost:5432/swissinfluence`
- `PAYLOAD_SECRET` (required): random secret used by Payload
- `SUPABASE_URL` (required): Supabase project URL (used for public asset links)
  - Example: `https://<project>.supabase.co`
- `S3_BUCKET` (required): Storage bucket name (e.g. `public`)
- `S3_ACCESS_KEY_ID` (required): S3-compatible access key
- `S3_SECRET_ACCESS_KEY` (required): S3-compatible secret key
- `S3_REGION` (required): S3 region string (e.g. `us-east-1`)
- `S3_ENDPOINT` (required): S3-compatible endpoint
  - Supabase example: `https://<project>.supabase.co/storage/v1/s3`
- `RESEND_API_KEY` (required): Resend API key (email sending)
- `MAILCHIMP_API_KEY` (required): Mailchimp Marketing API key
- `MAILCHIMP_TRANSACTIONAL_API_KEY` (required): Mailchimp Transactional API key
- `ANALYZE` (optional): `true` | `no-open` (bundle analyzer)
- `IGNORE_BUILD_ERRORS` (optional): `true` | `false` as string

Tips:

- Set `SKIP_ENV_VALIDATION=1` to run without filling every secret during local prototyping.
- If your `POSTGRES_URL` includes `sslmode=require`, it will be sanitized automatically for the server pool connection.

## Database & migrations

- Apply migrations: `pnpm migrate`
- Create a new migration: `pnpm migrate:create` (then commit the generated files under `src/cms/migrations`)
- Types and import map (keep in sync with Payload):
  - `pnpm generate:types`
  - `pnpm generate:importmap`

Helper script for local DB: `./start-database.sh` (uses Docker/Podman and `.env.development.local`).

## CMS (Payload)

- Admin route: `/admin` (`src/app/(payload)/admin`)
- REST routes: `/api/*` (`src/app/(payload)/api/[...slug]`)
- GraphQL: `/api/graphql`
- GraphQL Playground: `/api/graphql-playground`
- Collections/globals are in `src/cms/**`; Payload config is in `src/payload.config.ts`.

## Scripts

```bash
pnpm dev                 # Start Next.js in dev mode
pnpm build               # Build Next.js
pnpm start               # Start Next.js in production mode
pnpm dev:check           # Lint + typecheck
pnpm dev:preview         # Build (optionally analyze) and start local preview
pnpm lint                # Run ESLint
pnpm lint:fix            # Fix ESLint errors where possible
pnpm typecheck           # TypeScript noEmit typecheck
pnpm format              # Prettier write
pnpm migrate             # Run Payload migrations
pnpm migrate:create      # Create a new Payload migration
pnpm generate:types      # Generate Payload TS types
pnpm generate:importmap  # Generate Payload admin import map
pnpm storybook           # Start Storybook at :6006
pnpm build-storybook     # Build static Storybook
```

## Development notes

- Tailwind CSS 4 is configured via `postcss` and `src/ui/styles/tailwind.css`.
- Internationalization is set up with `next-intl` (`src/i18n/*`).
- Sentry is wired through `@sentry/nextjs` and Payload Sentry plugin; ensure required Sentry env vars are provided in the hosting environment if you enable it.
- Emails are sent via Resend; Mailchimp SDKs are available for marketing and transactional use cases.

## Deployment

- Target: Vercel (recommended). See `vercel.json` and `next.config.ts`.
- Ensure all required env vars are set in the hosting provider.
- `BASE_URL` is auto-derived on Vercel from branch/production URLs.

## Useful directories

- `src/app` — Next.js app routes (site, admin, API)
- `src/cms` — Payload collections, globals, migrations, and admin customizations
- `src/server` — Server-only utilities, queries, and services
- `src/ui` — Isolated UI components and pages
- `src/env.js` — Centralized environment validation and exposure
