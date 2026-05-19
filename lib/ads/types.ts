export type AdStatus =
  | "pending_review"
  | "active"
  | "paused"
  | "expired"
  | "rejected";

export interface AdSpot {
  id: string;
  user_id: string;
  status: AdStatus;
  position: 1 | 2 | 3;
  brand_name: string;
  tagline: string;
  click_url: string;
  logo_url: string;
  logo_path: string;
  contact_email: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_session_id: string | null;
  current_period_end: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  refunded_at: string | null;
  created_at: string;
  updated_at: string;
}

/** What we render in the public SponsorStrip — never includes private fields. */
export interface RenderableSlot {
  position: 1 | 2 | 3;
  kind: "placeholder" | "live" | "open";
  brand_name: string;
  tagline: string;
  click_url: string | null;
  logo_url: string | null;
}
