-- ─────────────────────────────────────────────────────────────────────────────
-- Run this in Supabase → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- purchases: one row per transaction (single report or bundle)
create table if not exists public.purchases (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  plan             text not null check (plan in ('single', 'bundle')),
  credits_total    int  not null default 1,   -- 1 for single, 3 for bundle
  credits_used     int  not null default 0,
  stripe_session_id text,                      -- filled after Stripe webhook
  created_at       timestamptz not null default now()
);

alter table public.purchases enable row level security;

create policy "Users can view own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

create policy "Users can insert own purchases"
  on public.purchases for insert
  with check (auth.uid() = user_id);

create policy "Users can update own purchases"
  on public.purchases for update
  using (auth.uid() = user_id);


-- comparisons: one row per saved report
create table if not exists public.comparisons (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  purchase_id  uuid references public.purchases(id) on delete set null,
  city_ids     text[]      not null,   -- e.g. ['valencia-es', 'lisbon-pt']
  city_names   text[]      not null,   -- e.g. ['Valencia', 'Lisbon']
  inputs       jsonb       not null,   -- budget, family, work, priorities, kids
  report_url   text        not null,   -- full /compare/results?... URL
  top_match    text,                   -- name of city with highest score
  top_pct      int,                    -- match % of top city
  created_at   timestamptz not null default now()
);

alter table public.comparisons enable row level security;

create policy "Users can view own comparisons"
  on public.comparisons for select
  using (auth.uid() = user_id);

create policy "Users can insert own comparisons"
  on public.comparisons for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own comparisons"
  on public.comparisons for delete
  using (auth.uid() = user_id);
