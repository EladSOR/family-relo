/**
 * POST /api/comparisons/save
 *
 * Called after a successful Stripe payment to save the unlocked comparison
 * and decrement the purchase credit.
 *
 * Body: {
 *   purchase_id: string       — the purchase row to decrement
 *   city_ids:    string[]     — e.g. ['valencia-es', 'lisbon-pt']
 *   city_names:  string[]     — e.g. ['Valencia', 'Lisbon']
 *   inputs:      object       — budget, family, work, priorities, kids
 *   report_url:  string       — full /compare/results?... URL
 *   top_match:   string       — city name with highest score
 *   top_pct:     number       — match % of top city
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { purchase_id, city_ids, city_names, inputs, report_url, top_match, top_pct } = body;

  if (!city_ids?.length || !report_url) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Idempotent: same purchase + same report URL only saves once (Stripe return + refresh).
  if (purchase_id) {
    const { data: existingRow } = await supabase
      .from("comparisons")
      .select("id")
      .eq("user_id", user.id)
      .eq("purchase_id", purchase_id)
      .eq("report_url", report_url)
      .maybeSingle();

    if (existingRow) {
      return NextResponse.json({ id: existingRow.id, duplicate: true });
    }
  }

  // Verify purchase belongs to user and has credits remaining
  if (purchase_id) {
    const { data: purchase } = await supabase
      .from("purchases")
      .select("id, credits_total, credits_used")
      .eq("id", purchase_id)
      .eq("user_id", user.id)
      .single();

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }
    if (purchase.credits_used >= purchase.credits_total) {
      return NextResponse.json({ error: "No credits remaining" }, { status: 403 });
    }

    // Decrement credit
    await supabase
      .from("purchases")
      .update({ credits_used: purchase.credits_used + 1 })
      .eq("id", purchase_id);
  }

  // Save comparison
  const { data, error } = await supabase
    .from("comparisons")
    .insert({
      user_id:    user.id,
      purchase_id: purchase_id ?? null,
      city_ids,
      city_names,
      inputs,
      report_url,
      top_match:  top_match ?? null,
      top_pct:    top_pct ?? null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
