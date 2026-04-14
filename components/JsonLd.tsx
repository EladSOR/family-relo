/**
 * Server-safe structured data. Pass a single object or @graph payload.
 * https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
