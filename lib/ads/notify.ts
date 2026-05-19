/**
 * Email notifications for the advertiser flow.
 *
 * All sends are best-effort: any failure is logged but never thrown,
 * so a misconfigured Resend can't break the Stripe webhook.
 *
 * Required env:
 *   RESEND_API_KEY          — already used by /api/audience/subscribe
 *   ADVERTISE_NOTIFY_EMAIL  — admin destination ("info@eladshalev.com")
 *   ADVERTISE_FROM_EMAIL    — verified sender, defaults to "noreply@famirelo.com"
 */

import { Resend } from "resend";

const FROM_DEFAULT = "FamiRelo <noreply@famirelo.com>";

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function fromAddress(): string {
  return process.env.ADVERTISE_FROM_EMAIL?.trim() || FROM_DEFAULT;
}

function adminAddress(): string | null {
  return process.env.ADVERTISE_NOTIFY_EMAIL?.trim() || null;
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, ch =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]!),
  );
}

/** New ad submitted → notify the admin so they can review at /admin/ads. */
export async function notifyAdminNewAd(args: {
  brandName: string;
  tagline: string;
  clickUrl: string;
  contactEmail: string;
  position: number;
  reviewUrl: string;
}) {
  const resend = client();
  const to = adminAddress();
  if (!resend || !to) {
    console.warn("[ads/notify] admin email not sent — RESEND_API_KEY or ADVERTISE_NOTIFY_EMAIL missing");
    return;
  }

  try {
    await resend.emails.send({
      from: fromAddress(),
      to,
      subject: `New ad pending review — ${args.brandName}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px">
          <h2 style="margin:0 0 8px">New ad submitted</h2>
          <p style="color:#475569;margin:0 0 16px">
            A buyer has paid for slot ${args.position}. Review and approve before it goes live.
          </p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:6px 0;color:#64748b">Brand</td><td style="padding:6px 0"><b>${escape(args.brandName)}</b></td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Tagline</td><td style="padding:6px 0">${escape(args.tagline)}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Click URL</td><td style="padding:6px 0"><a href="${escape(args.clickUrl)}">${escape(args.clickUrl)}</a></td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Buyer</td><td style="padding:6px 0">${escape(args.contactEmail)}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Slot</td><td style="padding:6px 0">${args.position}</td></tr>
          </table>
          <p style="margin-top:24px">
            <a href="${escape(args.reviewUrl)}"
               style="background:#FF5A5F;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:700">
              Review on /admin/ads →
            </a>
          </p>
        </div>
      `,
    });
  } catch (e) {
    console.error("[ads/notify] admin email failed", e);
  }
}

/** Ad approved → tell the advertiser their ad is live. */
export async function notifyAdvertiserApproved(args: {
  to: string;
  brandName: string;
}) {
  const resend = client();
  if (!resend) return;
  try {
    await resend.emails.send({
      from: fromAddress(),
      to: args.to,
      subject: `Your ${args.brandName} ad is live on FamiRelo`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px">
          <h2 style="margin:0 0 8px">You're live</h2>
          <p style="color:#334155">
            Hi — your ad for <b>${escape(args.brandName)}</b> just went live on FamiRelo.
            It will run for the rest of your current quarter and renew automatically
            unless you cancel.
          </p>
          <p style="color:#334155">
            Need to update your logo or tagline? Reply to this email and we'll swap it.
          </p>
        </div>
      `,
    });
  } catch (e) {
    console.error("[ads/notify] approved email failed", e);
  }
}

/** Waitlist signup → notify the admin so they can reach out personally. */
export async function notifyAdminWaitlist(args: {
  email: string;
  source: string;
  manageUrl: string;
}) {
  const resend = client();
  const to = adminAddress();
  if (!resend || !to) {
    console.warn("[ads/notify] waitlist email not sent — RESEND_API_KEY or ADVERTISE_NOTIFY_EMAIL missing");
    return;
  }
  try {
    await resend.emails.send({
      from: fromAddress(),
      to,
      subject: `Ad waitlist signup — ${args.email}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px">
          <h2 style="margin:0 0 8px">New advertiser on the waitlist</h2>
          <p style="color:#475569;margin:0 0 16px">
            All ad slots are currently full. Someone wants to advertise once a slot opens — reach out personally.
          </p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:6px 0;color:#64748b">Email</td><td style="padding:6px 0"><b>${escape(args.email)}</b></td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Source</td><td style="padding:6px 0">${escape(args.source)}</td></tr>
          </table>
          <p style="margin-top:24px">
            <a href="${escape(args.manageUrl)}"
               style="background:#0f172a;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:700">
              Open admin →
            </a>
          </p>
        </div>
      `,
    });
  } catch (e) {
    console.error("[ads/notify] waitlist email failed", e);
  }
}

/** Ad rejected → tell the advertiser their refund is on the way. */
export async function notifyAdvertiserRejected(args: {
  to: string;
  brandName: string;
  reason: string;
}) {
  const resend = client();
  if (!resend) return;
  try {
    await resend.emails.send({
      from: fromAddress(),
      to: args.to,
      subject: `Your ${args.brandName} application — refund issued`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px">
          <h2 style="margin:0 0 8px">Application not approved</h2>
          <p style="color:#334155">
            Thanks for applying to advertise on FamiRelo. After review we couldn't run
            your ad for <b>${escape(args.brandName)}</b>:
          </p>
          <blockquote style="border-left:3px solid #e2e8f0;padding-left:12px;color:#475569;margin:16px 0">
            ${escape(args.reason)}
          </blockquote>
          <p style="color:#334155">
            Your full payment has been refunded — it should appear on your card in 5–10 business days.
          </p>
        </div>
      `,
    });
  } catch (e) {
    console.error("[ads/notify] rejected email failed", e);
  }
}
