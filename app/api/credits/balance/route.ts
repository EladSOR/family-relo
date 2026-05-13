import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/credits/balance
 * Returns the number of unused report credits the signed-in user has.
 * Returns { remaining: 0 } for users who have never purchased.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: purchases, error } = await supabase
    .from("purchases")
    .select("credits_total, credits_used")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const remaining = (purchases ?? []).reduce(
    (sum, p) => sum + Math.max(0, p.credits_total - p.credits_used),
    0,
  );

  return NextResponse.json({ remaining });
}
