import heroImg from "@/assets/hero-ooty.jpg";
import { company } from "@/data/site";

/** Absolute URL on the production origin for a site path or bundled asset path. */
export const absoluteUrl = (path: string) =>
  /^https?:\/\//.test(path)
    ? path
    : `${company.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

export const defaultOgImage = {
  url: heroImg,
  width: 1600,
  height: 1067,
  alt: "Tea gardens and winding roads of the Nilgiri hills near Ooty",
};

/** First candidate that fits in `max` characters (most detailed first), else the last one trimmed. */
export function fitText(candidates: string[], max = 160) {
  return (
    candidates.find((c) => c.length <= max) ?? clampText(candidates[candidates.length - 1]!, max)
  );
}

/** Trim to `max` characters on a word boundary (for meta descriptions). */
export function clampText(text: string, max = 160) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:—–-]+$/, "")}…`;
}

interface PageSeo {
  title: string;
  description: string;
  /** Canonical path, without query string (e.g. "/vehicles"). */
  path: string;
  image?: { url: string; width?: number; height?: number; alt: string };
}

/**
 * Per-page head tags: title, description, self-referencing canonical, Open Graph and Twitter.
 * Use only in leaf routes — TanStack merges `links` from every matched route, so a canonical
 * in a parent route would be duplicated.
 */
export function pageHead({ title, description, path, image = defaultOgImage }: PageSeo) {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image.url);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: imageUrl },
      ...(image.width && image.height
        ? [
            { property: "og:image:width", content: String(image.width) },
            { property: "og:image:height", content: String(image.height) },
          ]
        : []),
      { property: "og:image:alt", content: image.alt },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

/** A JSON-LD <script> for a route's `head().scripts`. TanStack renders script children unescaped. */
export const jsonLdScript = (data: object) => ({
  type: "application/ld+json",
  children: JSON.stringify(data).replace(/</g, "\\u003c"),
});

/** LocalBusiness (TravelAgency) markup — only facts that are visible on the site. */
export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${company.siteUrl}/#business`,
    name: company.name,
    url: `${company.siteUrl}/`,
    description:
      "Ooty-based taxi, cab and traveller service for Nilgiris sightseeing, airport transfers and outstation trips across South India.",
    image: absoluteUrl(defaultOgImage.url),
    telephone: company.phoneHref.replace("tel:", ""),
    address: { "@type": "PostalAddress", ...company.postalAddress },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    areaServed: [
      { "@type": "AdministrativeArea", name: "The Nilgiris" },
      ...["Ooty", "Coonoor", "Kotagiri", "Gudalur", "Coimbatore", "Mysore", "Bangalore"].map(
        (name) => ({ "@type": "City", name }),
      ),
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${company.siteUrl}/#website`,
    url: `${company.siteUrl}/`,
    name: company.name,
    publisher: { "@id": `${company.siteUrl}/#business` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
