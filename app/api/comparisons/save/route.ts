/**
 * POST /api/comparisons/save
 *
 * Two modes:
 * 1. Stripe-return: client sends `purchase_id` (from verify-session). Decrements that
 *    specific purchase, then saves the comparison. Idempotent on (purchase_id, report_url).
 * 2. Credit redeem: client omits `purchase_id`. Server picks the oldest purchase with
 *    credits remaining (FIFO), decrements 1, and saves. Returns 402 if no credits.
 *
 * Body: {
 *   purchase_id?: string     — optional; if omitted server auto-picks
 *   city_ids:    string[]    — e.g. ['valencia-es', 'lisbon-pt']
 *   city_names:  string[]    — e.g. ['Valencia', 'Lisbon']
 *   inputs:      object      — budget, family, work, priorities, kids
 *   report_url:  string      — full /compare/results?... URL
 *   top_match:   string      — city name with highest score
 *   top_pct:     number      — match % of top city
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
  const { city_ids, city_names, inputs, report_url, top_match, top_pct } = body;
  let purchase_id: string | undefined = body.purchase_id;

  if (!city_ids?.length || !report_url) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // ── Idempotency: if user already has a saved row for this exact URL, return it.
  // Covers Stripe re-return AND duplicate redeem clicks (no double-decrement).
  {
    const { data: existingRow } = await supabase
      .from("comparisons")
      .select("id")
      .eq("user_id", user.id)
      .eq("report_url", report_url)
      .maybeSingle();

    if (existingRow) {
      return NextResponse.json({ id: existingRow.id, duplicate: true });
    }
  }

  // ── Resolve purchase_id (auto-pick when missing).
  if (!purchase_id) {
    const { data: purchases } = await supabase
      .from("purchases")
      .select("id, credits_total, credits_used, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    const usable = (purchases ?? []).find(
      (p) => p.credits_used < p.credits_total,
    );

    if (!usable) {
      return NextResponse.json(
        { error: "No credits remaining" },
        { status: 402 },
      );
    }
    purchase_id = usable.id;
  }

  // ── Verify chosen purchase + decrement (CAS to avoid double-spend on rapid clicks).
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
    return NextResponse.json({ error: "No credits remaining" }, { status: 402 });
  }

  const { error: decErr, count } = await supabase
    .from("purchases")
    .update(
      { credits_used: purchase.credits_used + 1 },
      { count: "exact" },
    )
    .eq("id", purchase_id)
    .eq("credits_used", purchase.credits_used);

  if (decErr) {
    return NextResponse.json({ error: decErr.message }, { status: 500 });
  }
  if (!count) {
    // Lost a race against another request — caller should retry.
    return NextResponse.json({ error: "Try again" }, { status: 409 });
  }

  // ── Save the comparison row.
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
