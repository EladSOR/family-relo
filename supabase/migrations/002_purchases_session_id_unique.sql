-- Idempotency: prevent duplicate purchase rows from a single Stripe session.
-- The webhook AND the verify-session fallback can both try to insert. Without
-- this constraint, a race could double-credit a user. With it, only one wins
-- and the other gets a unique-violation we already handle in code.

-- 1. Defensive cleanup: if any duplicates already exist, keep the oldest.
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY stripe_session_id
           ORDER BY created_at ASC, id ASC
         ) AS rn
  FROM public.purchases
  WHERE stripe_session_id IS NOT NULL
)
DELETE FROM public.purchases p
USING ranked r
WHERE p.id = r.id AND r.rn > 1;

-- 2. Add UNIQUE constraint (idempotent — only adds if not present).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'purchases_stripe_session_id_key'
  ) THEN
    ALTER TABLE public.purchases
      ADD CONSTRAINT purchases_stripe_session_id_key
      UNIQUE (stripe_session_id);
  END IF;
END$$;
