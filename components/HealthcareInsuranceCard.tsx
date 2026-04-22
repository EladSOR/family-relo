import { ShieldCheck, ExternalLink } from "lucide-react";

/**
 * Optional insurance recommendation shown at the end of every city
 * Healthcare section. Rendered once via the shared city page template,
 * so it appears automatically on all existing and future city pages.
 */
export function HealthcareInsuranceCard() {
  return (
    <div className="mt-6 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 md:mt-8 md:p-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">
          <ShieldCheck size={16} className="text-slate-500" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800">
            Optional insurance option
          </p>

          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            Some families prefer to have private international medical coverage
            for the first period abroad. SafetyWing is one option to check if you
            want a flexible plan while relocating.
          </p>

          <a
            href="https://safetywing.com/?referenceID=26514496&utm_source=26514496&utm_medium=Ambassador"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#E84A4F] px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d43e43] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E84A4F] focus-visible:ring-offset-2"
          >
            Check SafetyWing
            <ExternalLink size={13} className="shrink-0" aria-hidden="true" />
          </a>

          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Always confirm that any insurance you choose matches your visa,
            residency, and healthcare needs.
          </p>
        </div>
      </div>
    </div>
  );
}
