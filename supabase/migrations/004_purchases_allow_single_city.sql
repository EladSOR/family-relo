-- ─────────────────────────────────────────────────────────────────────────────
-- Allow 'single_city' as a purchase plan value.
--
-- Original constraint: plan in ('single', 'bundle')
-- New constraint:      plan in ('single', 'bundle', 'single_city')
--
-- 'single_city' is the new $7 "Should we move here?" report (one city, deep
-- personalized analysis). It grants 1 credit, just like 'single', but is
-- tracked separately so we can:
--   - measure conversion / mix in dashboards
--   - render correct labels on /account ("Single-city report" vs "Comparison")
--   - keep refund analytics clean per product
--
-- Idempotent — safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.purchases
  drop constraint if exists purchases_plan_check;

alter table public.purchases
  add constraint purchases_plan_check
  check (plan in ('single', 'bundle', 'single_city'));
