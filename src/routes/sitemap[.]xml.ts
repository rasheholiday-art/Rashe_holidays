import { createFileRoute } from "@tanstack/react-router";
import { company, destinations, vehicles } from "@/data/site";

// Indexable pages only: no /admin, no query-string variants (they canonicalise to these).
// `lastmod` is omitted on purpose — we have no reliable per-page modification dates.
const paths = [
  "/",
  "/vehicles",
  "/destinations",
  "/trip-types",
  "/how-it-works",
  "/about",
  "/contact",
  "/booking",
  ...vehicles.map((v) => `/vehicles/${v.slug}`),
  ...destinations.map((d) => `/destinations/${d.slug}`),
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = paths.map((p) => `  <url><loc>${company.siteUrl}${p}</loc></url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
