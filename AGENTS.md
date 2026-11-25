# AGENTS.md

## Cursor Cloud specific instructions

This is a **Next.js 16 (App Router, Turbopack) + Tailwind v4** app — the "FamiRelo / Family
Relocation Engine". The core product is statically-rendered city relocation guides driven by
`data/cities.json` (101 cities). Supabase, Stripe, Resend and OpenAI power optional features
(auth/account, one-time report purchases, advertiser emails, and the admin content scanner);
none are needed to browse the core city content.

### Running the app
- Dev server: `npm run dev` (Next.js + Turbopack on http://localhost:3000). Standard commands
  live in `package.json` (`dev`, `build`, `start`, `lint`, `validate-cities`, `check-links`).
- **A `.env.local` is required for the app to boot.** `middleware.ts` and the Supabase clients
  read `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` with non-null assertions, so
  if they are undefined every request (which all pass through middleware) fails. Placeholder
  values are enough to browse the static city/country pages; real keys are only needed to
  exercise auth, Stripe checkout, Resend email, or the LLM scanner. See `.env.example` for the
  full list of variables. `.env.local` is git-ignored.

### Lint / validate / test
- `npm run lint` (ESLint). Note: lint currently reports **pre-existing** errors/warnings in the
  committed code (mostly React hooks/effect rules) — these are not environment problems.
- `npm run validate-cities` and `npm run check-links` are content-quality checks over
  `data/cities.json`; `validate-cities` currently reports many **pre-existing** content issues.
  See `.cursor/rules/*.mdc` for the content authoring rules these enforce.
- There is no automated unit/integration test framework in this repo.
