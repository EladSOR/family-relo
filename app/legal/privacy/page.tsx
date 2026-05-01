import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Famirelo",
  description: "How Famirelo collects, uses, and protects your information.",
  robots: { index: true },
};

const LAST_UPDATED = "May 2026";

const sections = [
  {
    title: "1. Who we are",
    body: (
      <p>
        Famirelo (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates the website{" "}
        <strong>famirelo.com</strong> — a relocation research tool for families. You can reach us at{" "}
        <a href="mailto:hello@famirelo.com" className="text-[#FF5A5F] hover:underline">
          hello@famirelo.com
        </a>
        .
      </p>
    ),
  },
  {
    title: "2. What we collect",
    body: (
      <>
        <p className="mb-2">We collect the following categories of information:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Usage data:</strong> pages visited, time on site, browser type, and device type —
            collected automatically via analytics tools (e.g. Google Analytics).
          </li>
          <li>
            <strong>Comparison inputs:</strong> budget, family size, priorities, and city selections
            you enter in the Compare tool. These are stored only in your browser URL — we do not store
            them on our servers.
          </li>
          <li>
            <strong>Email address</strong> (if you voluntarily submit it via a contact or waitlist
            form).
          </li>
          <li>
            <strong>Payment data</strong> (when payments are enabled): processed securely by our
            payment provider (Stripe). We do not store card numbers.
          </li>
          <li>
            <strong>Cookies and tracking pixels:</strong> we use cookies and third-party pixels
            (including Google and Meta) for analytics and advertising purposes. See Section 5.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "3. How we use your information",
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>To operate and improve the Famirelo service.</li>
        <li>To understand how visitors use the site and which content is most helpful.</li>
        <li>To send you updates or responses if you contacted us — and nothing else.</li>
        <li>To process payments and fulfil orders (when enabled).</li>
        <li>To run advertising campaigns on platforms like Google and Meta to reach families researching relocation.</li>
      </ul>
    ),
  },
  {
    title: "4. Legal basis (EU/EEA users)",
    body: (
      <>
        <p className="mb-2">
          If you are in the EU or EEA, we process your data on the following legal bases:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Legitimate interests:</strong> operating the site, improving our service, and
            understanding usage.
          </li>
          <li>
            <strong>Consent:</strong> analytics and advertising cookies/pixels, where applicable.
          </li>
          <li>
            <strong>Contract:</strong> processing your payment when you purchase a report.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "5. Cookies and third-party tools",
    body: (
      <>
        <p className="mb-2">We use the following third-party services, which may set cookies or collect data:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Google Tag Manager / Google Analytics:</strong> site analytics and performance
            measurement.
          </li>
          <li>
            <strong>Meta Pixel:</strong> advertising performance and retargeting on Facebook/Instagram.
          </li>
          <li>
            <strong>Stripe</strong> (when payments go live): payment processing. Stripe has its own
            privacy policy.
          </li>
        </ul>
        <p className="mt-3">
          You can opt out of Google Analytics via the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF5A5F] hover:underline"
          >
            Google Analytics Opt-out browser add-on
          </a>
          . You can manage ad preferences via your browser settings or platform-level controls
          (Google Ad Settings, Meta Ad Preferences).
        </p>
      </>
    ),
  },
  {
    title: "6. Data sharing",
    body: (
      <>
        <p className="mb-2">We do not sell your personal data. We share data only with:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Third-party service providers listed in Section 5, each bound by their own data
            processing terms.
          </li>
          <li>
            Law enforcement or regulators if required by applicable law.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "7. Data retention",
    body: (
      <p>
        Analytics data is retained per the default settings of each platform (typically 14 months for
        Google Analytics). If you contact us by email, we retain that correspondence as long as
        relevant. Payment records are kept as required by applicable accounting law.
      </p>
    ),
  },
  {
    title: "8. Your rights",
    body: (
      <>
        <p className="mb-2">
          Depending on your location, you may have the right to:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Access the personal data we hold about you.</li>
          <li>Request correction or deletion of your data.</li>
          <li>Object to or restrict processing.</li>
          <li>Data portability (EU/EEA).</li>
          <li>Withdraw consent at any time (without affecting prior processing).</li>
          <li>Lodge a complaint with your local data protection authority.</li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, email{" "}
          <a href="mailto:hello@famirelo.com" className="text-[#FF5A5F] hover:underline">
            hello@famirelo.com
          </a>
          .
        </p>
      </>
    ),
  },
  {
    title: "9. Security",
    body: (
      <p>
        We use industry-standard measures to protect information transmitted to and from our site
        (HTTPS). No method of transmission is 100% secure — we cannot guarantee absolute security,
        but we take reasonable precautions.
      </p>
    ),
  },
  {
    title: "10. Children",
    body: (
      <p>
        Famirelo is not directed at children under 16. We do not knowingly collect personal data from
        children. If you believe a child has provided us personal data, contact us and we will delete
        it.
      </p>
    ),
  },
  {
    title: "11. Changes to this policy",
    body: (
      <p>
        We may update this policy as the service evolves (e.g. when payments or login are added). The
        &ldquo;Last updated&rdquo; date at the top will reflect any changes. Continued use of Famirelo
        after updates constitutes acceptance of the revised policy.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="We keep this plain and honest — here is exactly what we collect, why, and what you can do about it."
      lastUpdated={LAST_UPDATED}
      sections={sections}
    />
  );
}
