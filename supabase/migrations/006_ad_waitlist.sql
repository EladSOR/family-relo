-- ─────────────────────────────────────────────────────────────────────────────
-- ad_waitlist — collect emails when all ad slots are full so we can reach
-- out the moment a slot opens (an advertiser doesn't renew, an admin opens
-- a new slot, etc.).
--
-- Public can INSERT (anonymous waitlist signup is the whole point).
-- Only the service role / admin can SELECT — these are private leads.
--
-- Idempotent — safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.ad_waitlist (
  id           uuid primary key default gen_random_uuid(),
  email        text not null check (char_length(email) <= 200),
  source       text not null default 'advertise_page' check (
    source in ('advertise_page', 'modal', 'unknown')
  ),
  user_agent   text,
  ip_hash      text,
  notified_at  timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists idx_ad_waitlist_email      on public.ad_waitlist (email);
create index if not exists idx_ad_waitlist_created_at on public.ad_waitlist (created_at desc);

alter table public.ad_waitlist enable row level security;

-- Anyone can sign up (no auth required).
drop policy if exists ad_waitlist_insert_public on public.ad_waitlist;
create policy ad_waitlist_insert_public
  on public.ad_waitlist for insert
  to anon, authenticated
  with check (true);

-- Nobody can read except the service role (admin).
drop policy if exists ad_waitlist_select_none on public.ad_waitlist;
create policy ad_waitlist_select_none
  on public.ad_waitlist for select
  to anon, authenticated
  using (false);

grant insert on public.ad_waitlist to anon, authenticated;
