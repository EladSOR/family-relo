# Freshness / monitoring system — handoff for new chat

Paste this entire file into the new chat as the first message. It gives the
next agent full context, the scope, the cadence, and the constraints.

---

## What FamiRelo is (1-paragraph summary)

A Next.js 16 + Tailwind site that helps families decide where to relocate.
Core surfaces: ~100 city guides + country guides + a paid personalized
comparison product at `/compare` ($9 single / $19 bundle, Stripe). Stack:
Next.js App Router, Supabase (auth + Postgres), Resend (email), Stripe
(payments), Vercel (hosting). All city/country data lives in static JSON
(`data/cities.json`, `data/countries.json`) and is rendered as static
pages. Every city has a `lastReviewed` ISO YYYY-MM field already.

---

## Why this system matters (the only reason to build it pre-launch)

A relocation-info site is **only credible if the info is current**. Visa
rules, school fees, rent ranges, bank document requirements, and
government processes change constantly. If a user moves based on stale
data, the brand is dead. So the freshness system isn't a nice-to-have —
it's the difference between this being a content business or a one-shot
project. Hence the goal: **ship the minimum that lets us prove the site
is actively maintained, before launch.**

---

## Recommended cadence (you, the agent, can defend these to the user)

| What | How often | Why |
|---|---|---|
| **Per-city full review** | Every **90 days** (quarterly) | Standard for evergreen relocation guides. Visa rules, fees, and rents rarely move faster than this. |
| **Link health check** | Every **7 days** (automated) | URLs break silently — a broken government link is the #1 trust-killer. Cheap to detect. |
| **High-volatility fields review** (visa rules, fees, currency-converted prices) | Every **30 days** for top-10 traffic cities only | Don't over-burden; focus on cities people actually read. |
| **"Reviewed [date]" badge shown to readers** | When `lastReviewed` > **180 days old** | Honest signal; doesn't penalize fresh content. |
| **"Outdated" hard warning to readers** | When `lastReviewed` > **365 days old** | If we let a city go a year, we owe the reader a heads-up. |

You should tell the user that anything more frequent than this is
over-engineering pre-launch.

---

## V1 scope — must ship before launch (small, ~1–2 sessions of work)

These four pieces are the MVP. Nothing more for V1.

### 1. Reader-facing freshness signals on city pages
- Already have `dest.lastReviewed` ("YYYY-MM") on every city.
- Compute `monthsSinceReview` at render time.
- If ≤ 6 months: show a small green "Reviewed [Month YYYY]" badge near
  the header.
- If 6–12 months: show neutral "Last reviewed [Month YYYY]".
- If > 12 months: show amber "Information may be out of date — last
  reviewed [Month YYYY]" with a small link to the contact email
  inviting corrections.
- Render this as a tiny component, e.g. `components/FreshnessBadge.tsx`,
  inserted once at the top of the city page hero area.

### 2. Admin dashboard at `/admin/freshness`
- Auth-gate: only one or two specific email addresses (read from env var
  `ADMIN_EMAILS=elad@…,…`). Anyone else gets a 404 — never redirect, never
  leak that the page exists.
- Server component (no client state), single table:
  - City | Country | `lastReviewed` | Days since | # source links | actions
- Sort by "Days since" descending so the most-stale floats up.
- Action button per row: "Mark as reviewed" → calls an API route that
  writes the new `lastReviewed` value to `cities.json` AND commits +
  pushes the change (via GitHub API using a PAT in env var
  `GITHUB_REVIEW_TOKEN`). Show a confirmation toast.
- Second action: "Open editor" → opens GitHub web editor for that city's
  JSON block at the right line range.

### 3. Link health check script + GitHub Action
- New script: `scripts/check_links.py`.
- Iterates every `isVerified: true` URL in `cities.json` and
  `countries.json` (housing portals, source links, etc.).
- HEAD request per URL with a 10s timeout; treat 200–299 as OK,
  300–399 as warning (redirect, log target), 4xx/5xx/timeout as broken.
- Output: a `link-health-report.md` with broken URLs grouped by city.
- Exit non-zero if any URL is broken → CI fails.
- Wire to `.github/workflows/link-check.yml` running weekly (cron
  `0 8 * * 1`) plus on PR for any change touching `data/*.json`.
- Critical: respect a per-host rate limit (max 1 request per host per
  2s) so we don't get banned from government sites.

### 4. Daily reminder email (only if any city crosses thresholds)
- Tiny Vercel cron (or GitHub Action with cron) that runs once a day.
- Computes how many cities are >90 days, >180 days, >365 days.
- If any thresholds are crossed since the last run, send a single
  Resend email to the admin with counts + a deep link to
  `/admin/freshness`. Otherwise send nothing.
- Don't store state in a DB — just look at `lastReviewed` ages.

---

## V2 backlog — post-launch only, NOT in scope now

Mention these to the user but do not start them in V1:
- LLM scan: ChatGPT API call per city per quarter that compares each
  section against the linked official source and flags drift.
- Reader feedback button at end of every section ("Is this still
  accurate?") writing to a Supabase table.
- Slack/Discord webhook instead of email.
- Per-section freshness (not just per-city) — track when housing was
  last reviewed vs. when visa was.
- Editor / Admin role split with multiple editors.
- Public "Last reviewed" page listing all cities with freshness status.

---

## Technical context the next agent must know

### Repo structure (relevant bits)
- `data/cities.json` — array of 100 city objects, each ~1–3KB JSON.
- `data/countries.json` — country-level visa/policy fallback.
- `app/[country]/[city]/page.tsx` — city page renderer.
- `lib/types.ts` — TypeScript types for `Destination` and nested objects.
- `scripts/validate_cities.py` and `scripts/deep_audit_cities.py` —
  existing Python validators. Reuse their JSON-loading helpers as a
  pattern for `check_links.py`.

### Auth + admin gating (existing)
- Supabase Auth already wired with magic-link + Google OAuth.
- No role system yet. For V1, gate the admin route by **email allowlist**
  read from `process.env.ADMIN_EMAILS` (comma-separated). This is the
  fastest correct option — no schema changes.
- Use `createClient` from `@/lib/supabase/server` inside the admin page
  and call `supabase.auth.getUser()`. If the email isn't in the
  allowlist, `notFound()` from `next/navigation`. Do not redirect — 404
  to avoid leaking the route.

### Supabase
- Existing tables: `purchases`, `comparisons`. Migrations in
  `supabase/migrations/`.
- V1 needs **zero new tables** — `lastReviewed` already lives in the
  JSON file. Keep it that way; do not move it to a DB.

### Deployment / cost
- Hosted on Vercel free tier. The previous session hit ISR + Fast
  Origin Transfer limits, so:
  - Keep `/admin/freshness` `dynamic = "force-dynamic"` (admin-only,
    won't be hit by bots).
  - Do NOT add `revalidate` to city pages — they're fully static at
    build time, which is the cheapest path.
- The "Mark as reviewed" action triggers a `git commit` via GitHub API,
  which triggers a Vercel rebuild. That's the deploy path — there is no
  runtime data source for `lastReviewed`.

### Stripe webhook (don't break this)
- Webhook at `app/api/stripe/webhook/route.ts` is excluded from
  middleware. Any new API routes you add for the admin must NOT
  interfere with that exclusion.

### Existing constraints / rules
- All city/country content edits must pass:
  ```bash
  python3 scripts/validate_cities.py
  python3 scripts/deep_audit_cities.py
  ```
- See `.cursor/rules/new-city-generation.mdc` for what makes a city
  "complete". You don't need to read all of it for the freshness system,
  but if you're editing JSON via the admin "Mark as reviewed" flow,
  ensure the only field you change is `lastReviewed`.

---

## Acceptance criteria for V1

The user (Elad) considers V1 done when:

1. Every city page renders a `<FreshnessBadge />` reflecting age.
2. `/admin/freshness` works for his email, 404s for anyone else.
3. Clicking "Mark as reviewed" on a city updates `cities.json`,
   commits + pushes to `main`, and Vercel redeploys.
4. `scripts/check_links.py` runs locally and reports all broken
   `isVerified: true` URLs.
5. `.github/workflows/link-check.yml` runs weekly and fails the build
   on broken links.
6. Daily Vercel cron sends an admin email only if a threshold is
   crossed since the last run.

That's it. No LLM scans, no reader feedback, no role system, no Supabase
tables. Resist scope creep.

---

## Suggested order of work for the next agent

1. **FreshnessBadge component + city page integration** — instant user-
   visible signal, 30 min.
2. **`/admin/freshness` page with email allowlist** — auth gate + read-
   only table first, 1 hour.
3. **"Mark as reviewed" via GitHub API** — POST to GitHub Contents API,
   1 hour.
4. **`check_links.py` script** — Python, 30 min.
5. **GitHub Action** — weekly cron, 20 min.
6. **Daily admin email** — Vercel cron or GitHub Action, 30 min.

Total estimated: ~4 hours of focused work. Anything longer means scope
creep — push back to V2.

---

## Open questions the agent should ask Elad before starting

1. Confirm admin email(s) for the allowlist.
2. Does Elad want the "Mark as reviewed" action to commit directly to
   `main`, or open a PR he approves? (Direct commit is simpler; PR is
   safer if there are ever multiple editors.)
3. Confirm Resend "from" address for the daily threshold email.
4. Should the reader-facing "Outdated" warning (>365d) actually appear,
   or is the badge enough? (Recommend: yes, show it — trust signal.)
