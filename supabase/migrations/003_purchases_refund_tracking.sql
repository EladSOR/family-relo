-- Refund visibility on /account.
-- Adds two columns so the UI can distinguish between:
--   credits naturally consumed       (refunded_at IS NULL, credits_used = N)
--   credits revoked by full refund   (refunded_at IS NOT NULL, refund_kind = 'full')
--   credits revoked by partial refund(refunded_at IS NOT NULL, refund_kind = 'partial')
--
-- Without this, a refunded user just sees "3 of 3 used" and assumes they
-- consumed the product — confusing and misleading.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'purchases'
      AND column_name = 'refunded_at'
  ) THEN
    ALTER TABLE public.purchases
      ADD COLUMN refunded_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'purchases'
      AND column_name = 'refund_kind'
  ) THEN
    ALTER TABLE public.purchases
      ADD COLUMN refund_kind text;
    -- Constrain to known values; allow NULL for non-refunded rows.
    ALTER TABLE public.purchases
      ADD CONSTRAINT purchases_refund_kind_check
      CHECK (refund_kind IS NULL OR refund_kind IN ('full', 'partial'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'purchases'
      AND column_name = 'credits_used_at_refund'
  ) THEN
    ALTER TABLE public.purchases
      ADD COLUMN credits_used_at_refund integer;
    -- We snapshot how many credits were already consumed at refund time so the
    -- UI can show "1 used · 2 refunded" honestly.
  END IF;
END$$;
