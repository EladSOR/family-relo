import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Use | Famirelo",
  description: "The terms that govern your use of Famirelo.",
  robots: { index: true },
};

const LAST_UPDATED = "May 2026";

const sections = [
  {
    title: "1. About Famirelo",
    body: (
      <p>
        Famirelo (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates{" "}
        <strong>famirelo.com</strong> — a relocation research platform for families — and any
        associated tools, features, reports, or services we may offer now or in the future
        (collectively, the &ldquo;Services&rdquo;). By accessing or using the Services, you agree
        to these Terms of Use. If you do not agree, please do not use the Services.
        Questions: &nbsp;
        <a href="mailto:hello@famirelo.com" className="text-[#FF5A5F] hover:underline">
          hello@famirelo.com
        </a>
        .
      </p>
    ),
  },
  {
    title: "2. What we offer",
    body: (
      <>
        <p className="mb-2">
          The Services currently include, and may in the future expand to include:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Free city guides, destination pages, and relocation information.</li>
          <li>Personalized city comparison tools and reports (free preview and paid versions).</li>
          <li>
            Premium features and reports — purchased on a one-time, subscription, or bundle basis
            depending on the product at time of purchase.
          </li>
          <li>
            A user account system (when introduced) to manage purchases and saved reports.
          </li>
          <li>
            Any additional tools, data products, guides, or features we introduce over time.
          </li>
        </ul>
        <p className="mt-3">
          We reserve the right to add, modify, pause, or discontinue any feature or part of the
          Services at any time, with or without notice.
        </p>
      </>
    ),
  },
  {
    title: "3. Informational purpose — not professional advice",
    body: (
      <p>
        All content on Famirelo — city guides, cost benchmarks, school information, visa summaries,
        safety scores, comparison reports, and any other data — is provided for{" "}
        <strong>general informational purposes only</strong>. Nothing on Famirelo constitutes legal,
        financial, tax, immigration, investment, or medical advice. We make reasonable efforts to
        keep information current, but conditions change and we cannot guarantee accuracy. Always
        verify critical information with official government sources and licensed professionals
        before making relocation or financial decisions.
      </p>
    ),
  },
  {
    title: "4. Payments, pricing, and currencies",
    body: (
      <>
        <p className="mb-2">When you purchase any paid feature or product through Famirelo:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Payments are processed securely by our payment provider (currently Stripe). We do not
            store card or banking details.
          </li>
          <li>
            Prices may be displayed in USD or other currencies depending on your location and
            available display options. The currency shown at checkout is the currency you will be
            charged in — any currency conversion is handled by your bank or card provider.
          </li>
          <li>
            We reserve the right to change pricing at any time. Price changes do not affect
            purchases already completed.
          </li>
          <li>
            Applicable taxes may be added at checkout depending on your jurisdiction.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "5. Digital products and refunds",
    body: (
      <>
        <p className="mb-2">
          Our paid products are <strong>digital products delivered immediately</strong> upon
          purchase (e.g. a shareable comparison report link, access to premium features, or similar
          digital deliverables). By completing a purchase, you acknowledge and agree that:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Delivery of the digital product begins immediately upon payment confirmation.
          </li>
          <li>
            Because the product is delivered instantly, refunds are not automatically provided.
          </li>
          <li>
            If you experience a verified technical failure that prevents you from accessing what
            you purchased, contact us within 7 days at{" "}
            <a href="mailto:hello@famirelo.com" className="text-[#FF5A5F] hover:underline">
              hello@famirelo.com
            </a>{" "}
            and we will resolve the issue or issue a refund at our sole discretion.
          </li>
          <li>
            For subscription products (if and when offered): you may cancel at any time and will
            retain access until the end of your current billing period. No partial-period refunds
            are issued unless required by applicable law.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "6. Affiliate links and third-party recommendations",
    body: (
      <p>
        Some links on Famirelo may be affiliate links — we may earn a commission if you click and
        make a purchase, at no additional cost to you. Affiliate relationships do not influence the
        content, data, scores, or recommendations we publish. We only link to third-party services
        we consider relevant and useful to our audience. Famirelo is not responsible for the
        content, accuracy, availability, or practices of any third-party website or service we
        link to.
      </p>
    ),
  },
  {
    title: "7. User accounts",
    body: (
      <p>
        If you create an account with Famirelo (now or in the future), you are responsible for
        maintaining the confidentiality of your credentials and for all activity that occurs under
        your account. You agree to notify us immediately of any unauthorized use. We reserve the
        right to suspend or terminate accounts that violate these Terms or that we reasonably
        believe pose a risk to other users or the platform.
      </p>
    ),
  },
  {
    title: "8. Acceptable use",
    body: (
      <>
        <p className="mb-2">You agree not to:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Scrape, crawl, copy, or systematically extract content or data from Famirelo without
            written permission.
          </li>
          <li>
            Reproduce, resell, sublicense, or redistribute content, reports, or any part of the
            Services for commercial purposes.
          </li>
          <li>Use the Services for any unlawful purpose or in violation of any applicable law.</li>
          <li>
            Interfere with or disrupt the security, integrity, or performance of the platform or
            its underlying infrastructure.
          </li>
          <li>
            Impersonate another person or entity, or provide false information in connection with
            the Services.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "9. Intellectual property",
    body: (
      <p>
        All content, tools, design, copy, data, generated reports, and functionality on Famirelo
        are owned by or licensed to Famirelo. You may share a link to your personal comparison
        report or print it for personal, non-commercial use. You may not republish, repackage, or
        commercialise Famirelo content or outputs without our prior written permission.
      </p>
    ),
  },
  {
    title: "10. Disclaimer of warranties",
    body: (
      <p>
        The Services are provided <strong>&ldquo;as is&rdquo;</strong> and{" "}
        <strong>&ldquo;as available&rdquo;</strong> without warranties of any kind, express or
        implied — including, without limitation, warranties of merchantability, fitness for a
        particular purpose, accuracy, or non-infringement. We do not warrant that the Services will
        be uninterrupted, error-free, virus-free, or completely secure.
      </p>
    ),
  },
  {
    title: "11. Limitation of liability",
    body: (
      <p>
        To the fullest extent permitted by applicable law, Famirelo and its operators, employees,
        and affiliates shall not be liable for any indirect, incidental, special, consequential, or
        punitive damages — including loss of data, revenue, profits, or goodwill — arising from
        your use of or inability to use the Services, even if we have been advised of the
        possibility of such damages. For any claim related to a specific paid purchase, our total
        liability shall not exceed the amount you paid for that purchase. Nothing in these Terms
        excludes liability that cannot legally be excluded under applicable law.
      </p>
    ),
  },
  {
    title: "12. Governing law",
    body: (
      <p>
        These Terms are governed by the laws of the jurisdiction in which Famirelo operates,
        without regard to conflict-of-law principles. Any disputes arising under these Terms shall
        be subject to the exclusive jurisdiction of the competent courts of that jurisdiction.
      </p>
    ),
  },
  {
    title: "13. Changes to these Terms",
    body: (
      <p>
        We may update these Terms at any time to reflect changes to our Services, legal
        requirements, or business practices. The &ldquo;Last updated&rdquo; date at the top of
        this page will reflect any revisions. Continued use of the Services after any update
        constitutes your acceptance of the revised Terms. If a change is material, we will make
        reasonable efforts to notify you.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Use"
      subtitle="Please read these terms before using Famirelo. By using the site or any of its features, you agree to them."
      lastUpdated={LAST_UPDATED}
      sections={sections}
    />
  );
}
