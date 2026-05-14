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

  // ── Verify chosen purchase has credits available before doing anything.
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

  // ── INSERT FIRST: save the comparison row before touching the credit.
  // If the insert fails (schema drift, FK constraint, etc.) the credit is
  // never consumed — failed redeems no longer waste credits.
  const { data, error: insertErr } = await supabase
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

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  // ── DECREMENT SECOND: optimistic CAS to avoid double-spend on rapid clicks.
  const { error: decErr, count } = await supabase
    .from("purchases")
    .update(
      { credits_used: purchase.credits_used + 1 },
      { count: "exact" },
    )
    .eq("id", purchase_id)
    .eq("credits_used", purchase.credits_used);

  // If the decrement fails or loses a race, the comparison is already saved
  // (so the user has their report) — we just log the discrepancy and return
  // success. Worst case: a "free" unlock if two redeems collide. Better than
  // the alternative of charging a credit for a failed save.
  if (decErr) {
    console.error("[comparisons/save] credit decrement failed", decErr.message);
  } else if (!count) {
    console.warn("[comparisons/save] credit decrement CAS lost, comparison still saved", { purchase_id, comparison_id: data.id });
  }

  return NextResponse.json({ id: data.id });
}
