-- ─────────────────────────────────────────────────────────────────────────────
-- Ad spots — sponsored slots shown in the SponsorStrip on city pages and home.
--
-- Lifecycle:
--   1. User submits /advertise form → row created with status = 'pending_review'
--      and a stripe_subscription_id once Checkout completes (subscription mode).
--   2. Admin reviews on /admin/ads:
--        approve → status = 'active'   (ad becomes live on site)
--        reject  → status = 'rejected' (full refund issued via Stripe API)
--   3. Stripe subscription webhooks keep current_period_end fresh.
--      On cancellation / payment failure → status = 'expired' (ad removed).
--
-- All writes happen via the service-role admin client in server routes.
-- Anon role has SELECT-only access to the active rows the SponsorStrip needs.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.ad_spots (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references auth.users(id) on delete cascade,
  status                   text not null check (status in ('pending_review','active','paused','expired','rejected')),
  position                 int  not null check (position between 1 and 3),
  brand_name               text not null check (char_length(brand_name) <= 40),
  tagline                  text not null check (char_length(tagline) <= 120),
  click_url                text not null,
  logo_url                 text not null,                       -- public Storage URL
  logo_path                text not null,                       -- Storage object path (for cleanup on reject)
  contact_email            text not null,
  stripe_customer_id       text,
  stripe_subscription_id   text unique,
  stripe_session_id        text unique,
  current_period_end       timestamptz,
  reviewed_by              text,                                -- admin email (lowercased)
  reviewed_at              timestamptz,
  rejection_reason         text,
  refunded_at              timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists ad_spots_status_idx on public.ad_spots(status);
create index if not exists ad_spots_user_idx   on public.ad_spots(user_id);

-- updated_at trigger (idempotent)
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists ad_spots_touch on public.ad_spots;
create trigger ad_spots_touch
  before update on public.ad_spots
  for each row execute function public.touch_updated_at();

-- Row-level security: users only see their own rows; only the service role
-- can mutate. The public SponsorStrip uses a SECURITY DEFINER view (below)
-- to expose just the four display fields of currently-active ads.
alter table public.ad_spots enable row level security;

create policy "Users can view own ad submissions"
  on public.ad_spots for select
  using (auth.uid() = user_id);

-- Public read view for the SponsorStrip — only the columns we render, only
-- active rows. Using a view keeps the table itself private (no RLS leakage of
-- pending_review or rejected rows to anon visitors).
create or replace view public.active_ad_spots as
  select position, brand_name, tagline, click_url, logo_url
    from public.ad_spots
   where status = 'active'
   order by position;

grant select on public.active_ad_spots to anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- Logo storage bucket — public read (so <img> works without signed URLs),
-- writes only via service role.
--
-- Run this AFTER the table migration. Idempotent.
-- ─────────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
  values ('ad-logos', 'ad-logos', true)
  on conflict (id) do update set public = true;

-- Public can read all logo files (they're meant to render on every page).
-- Writes are service-role only (no policy = denied for anon/authenticated).
drop policy if exists "Public can read ad logos" on storage.objects;
create policy "Public can read ad logos"
  on storage.objects for select
  using (bucket_id = 'ad-logos');

-- ─────────────────────────────────────────────────────────────────────────────
-- Data API grants (matches pattern in 001_purchases_comparisons.sql)
-- ─────────────────────────────────────────────────────────────────────────────
grant select on table public.ad_spots to authenticated;
-- All inserts/updates happen via service role in server routes — no
-- client-direct mutation is exposed.
