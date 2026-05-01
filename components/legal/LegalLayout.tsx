import Link from "next/link";
import { MapPin } from "lucide-react";

interface Section {
  title: string;
  body: React.ReactNode;
}

export default function LegalLayout({
  title,
  subtitle,
  lastUpdated,
  sections,
}: {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
}) {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="border-b border-slate-100 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5A5F] text-white">
              <MapPin size={13} strokeWidth={2.5} />
            </span>
            <span className="text-sm font-extrabold tracking-tight text-slate-900">
              FamiRelo
            </span>
          </Link>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <Link href="/legal/privacy" className="hover:text-slate-700">
              Privacy
            </Link>
            <Link href="/legal/terms" className="hover:text-slate-700">
              Terms
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#FF5A5F]">
            Legal
          </p>
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            {title}
          </h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
          <p className="mt-1 text-xs text-slate-400">Last updated: {lastUpdated}</p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="mb-3 text-base font-bold text-slate-900">{s.title}</h2>
              <div className="prose prose-sm prose-slate max-w-none leading-relaxed text-slate-600">
                {s.body}
              </div>
            </section>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 rounded-xl border border-slate-100 bg-white p-5 text-sm text-slate-500">
          Questions about this document?{" "}
          <a
            href="mailto:hello@famirelo.com"
            className="font-semibold text-[#FF5A5F] hover:underline"
          >
            hello@famirelo.com
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white px-4 py-6 text-center text-xs text-slate-400">
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <Link href="/compare" className="hover:text-slate-700">Compare cities</Link>
          <Link href="/legal/privacy" className="hover:text-slate-700">Privacy Policy</Link>
          <Link href="/legal/terms" className="hover:text-slate-700">Terms of Use</Link>
        </div>
        <p className="mt-3">© {new Date().getFullYear()} Famirelo. All rights reserved.</p>
      </footer>
    </div>
  );
}
