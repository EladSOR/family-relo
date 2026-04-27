import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog/registry";
import { buildPageMetadata } from "@/lib/seo/buildPageMetadata";
import { clipMetaDescription } from "@/lib/seo/description";
import { SITE_SERP_TITLE_BRAND } from "@/lib/seo/constants";
import Breadcrumb from "@/components/Breadcrumb";
import StickySearchHeader from "@/components/StickySearchHeader";

const TITLE = `Family relocation: city comparison guides & tips | ${SITE_SERP_TITLE_BRAND}`;

const DESCRIPTION = clipMetaDescription(
  "Practical family relocation compare guides: two cities, one page—rent, cost of living, international schools, childcare, and safety. For parents planning a move abroad with kids.",
);

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  canonicalPath: "/blog",
});

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();
  return (
    <main className="min-h-screen bg-[#F5EFE8]">
      <StickySearchHeader />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Blog</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          City comparison guides
        </h1>
        <p className="mt-4 max-w-prose text-base leading-relaxed text-slate-700">
          When you’re torn between two places, you want the same kind of answer for both—rent, schools, what
          day-to-day life costs, and what the weather really feels like. We put that in one place so you can
          compare, then dig into each city’s full guide.
        </p>
        <ul className="mt-10 space-y-6">
          {posts.map((p) => (
            <li key={p.slug}>
              <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-stone-300 md:p-6">
                <p className="text-xs text-slate-500">{p.contentTypeLabel}</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  <Link href={`/blog/${p.slug}`} className="hover:underline">
                    {p.listTitle}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.metaDescription}</p>
                <Link
                  href={`/blog/${p.slug}`}
                  className="mt-3 inline-block text-sm font-semibold text-[#E84A4F] hover:underline"
                >
                  Read →
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
