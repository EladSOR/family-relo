import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Lock, Users, Clock } from "lucide-react";

import Logo from "@/components/brand/Logo";
import AdvertiseForm from "@/components/ads/AdvertiseForm";
import WaitlistForm from "@/components/ads/WaitlistForm";
import { ADVERTISE_COPY } from "@/lib/ads/copy";
import { getRenderableSlots, getOpenSlotCount } from "@/lib/ads/queries";

export const metadata: Metadata = {
  title: "Advertise on FamiRelo — founding rate ($99/month)",
  description:
    "Reach families actively planning a relocation. Limited ad slots. Founding rate $99/month — locked in for life.",
  robots: { index: true, follow: true },
};

export const dynamic = "force-dynamic";

export default async function AdvertisePage() {
  // Auth is handled inside <AdvertiseForm /> — no redirect needed here, so the
  // sale page itself is indexable + readable to anonymous visitors.
  const slots = await getRenderableSlots();
  const open = getOpenSlotCount(slots);

  if (open === 0) {
    return (
      <div className="min-h-screen bg-stone-50">
        <NavBar />
        <main className="mx-auto max-w-md px-4 py-12 text-center md:py-16">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FF5A5F]/10 text-[#FF5A5F]">
            <Clock size={26} strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
            All ad slots are full
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
            We keep this section deliberately small. When a current advertiser cancels we open
            the next slot — drop your email and you'll be the first to hear.
          </p>

          <div className="mt-7">
            <WaitlistForm source="advertise_page" />
          </div>

          <p className="mx-auto mt-6 max-w-sm text-[11px] leading-relaxed text-slate-400">
            We don't run a payment until we have a slot for you — so you'll never need a refund
            from being on the waitlist.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <NavBar />

      <main className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        {/* Top badges */}
        <div className="mx-auto grid max-w-xl grid-cols-3 gap-2 md:gap-3">
          <Badge icon={<Users size={14} />} title={ADVERTISE_COPY.badges[0].label} sub={ADVERTISE_COPY.badges[0].sub} />
          <Badge icon={<Lock size={14} />} title={ADVERTISE_COPY.badges[1].label} sub={ADVERTISE_COPY.badges[1].sub} />
          <Badge icon={<Sparkles size={14} />} title={ADVERTISE_COPY.badges[2].label} sub={ADVERTISE_COPY.badges[2].sub} highlight />
        </div>

        <h1 className="mx-auto mt-8 max-w-2xl text-center text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          {ADVERTISE_COPY.heading}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[15px] leading-relaxed text-slate-600">
          {ADVERTISE_COPY.body}
        </p>

        {/* Form */}
        <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
          <AdvertiseForm />
        </div>

        <p className="mx-auto mt-4 max-w-xl text-center text-xs leading-relaxed text-slate-500">
          {ADVERTISE_COPY.fineprint}{" "}
          <Link
            href="/legal/terms#advertising"
            className="underline hover:text-slate-700"
          >
            Advertising terms apply
          </Link>
          .
        </p>

        {/* What we don't accept — same source of truth as the modal. */}
        <div className="mx-auto mt-10 max-w-xl rounded-xl border border-slate-100 bg-white p-5 text-xs leading-relaxed">
          <p className="font-bold text-slate-800">{ADVERTISE_COPY.notAcceptedHeading}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {ADVERTISE_COPY.notAccepted.map(item => (
              <li key={item} className="flex items-start gap-2 text-slate-600">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-slate-500">
            We refund in full if we reject. No back-and-forth.
          </p>
        </div>
      </main>
    </div>
  );
}

function NavBar() {
  return (
    <nav className="border-b border-slate-100 bg-white px-4 py-4">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <Link href="/" className="w-fit" aria-label="FamiRelo home">
          <Logo size={24} />
        </Link>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#FF5A5F]">
          Advertise
        </span>
      </div>
    </nav>
  );
}

function Badge({
  icon, title, sub, highlight,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-3 text-center ${
        highlight ? "border-[#FF5A5F]/30 bg-[#FF5A5F]/5" : "border-slate-100 bg-white"
      }`}
    >
      <div className={`mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full ${
        highlight ? "bg-[#FF5A5F]/10 text-[#FF5A5F]" : "bg-slate-100 text-slate-500"
      }`}>
        {icon}
      </div>
      <p className="text-xs font-extrabold text-slate-900">{title}</p>
      <p className="mt-0.5 text-[10px] leading-tight text-slate-500">{sub}</p>
    </div>
  );
}
