# Rashe Holidays: technical SEO audit

**Site:** https://rasheholidays.com · **Date:** 10 Oct 2026 · **Mode:** full-site audit, plus fixes applied locally
**Goal from the client:** rank for travel and taxi booking in Ooty, the Nilgiris and nearby areas.

> No one can guarantee a #1 ranking. Technical SEO removes the obstacles that stop Google from crawling, understanding and trusting the site. For a local taxi business, rankings mostly depend on the Google Business Profile, genuine reviews, and pages that match what people search for (see §6).

---

## 1. Executive summary

**Overall condition:** the foundation is good. The site is server-rendered (TanStack Start on Cloudflare), so titles, headings and content are in the raw HTML Google fetches, and unknown URLs correctly return 404. Lighthouse SEO scores 100. That score only checks basics, though, and the real gaps were elsewhere:

**Top problems found**
1. **Published email address doesn't work.** `hello@rasheholidays.in` is on every page, but `rasheholidays.in` doesn't exist (Google DNS returns NXDOMAIN). Every customer email bounces. `rasheholidays.com` has no MX records either. **Critical, needs your input.**
2. **No sitemap.xml** (live: 404) and robots.txt doesn't point to one. *Fixed locally.*
3. **No canonical tags anywhere.** The `http://` version and query variants like `/vehicles?category=4-seater` are all indexable duplicates. *Fixed locally.*
4. **Site-wide broken links:** the footer on every page linked to `/vehicles/toyota-innova-hycross` and `/vehicles/19-seater-traveller`, and both return 404 live. *Fixed locally.*
5. **No structured data** (no LocalBusiness, so Google gets no machine-readable address, phone or hours). *Fixed locally.*
6. **Inaccurate, weakly targeted metadata.** Descriptions advertised "19-seater Travellers" and "hatchbacks" that aren't in the fleet. Destination titles ran 85–95 characters. No page title started with what people search for ("Ooty taxi…"). *Fixed locally.*
7. **HTTP doesn't redirect to HTTPS** (`http://rasheholidays.com` serves 200). *Blocked: needs a Cloudflare dashboard setting.*
8. **Mobile layout overflow:** `/vehicles`, the vehicle pages, `/trip-types` and the homepage pricing tabs were wider than a 375 px phone (407 px), so phones zoomed the page out. *Fixed locally.*
9. **Slow mobile LCP (5.8 s lab):** about 1 MB of unoptimised images, render-blocking fonts, and an entrance animation that delays the LCP element. *Partly addressed. The image work needs your approval for a tool.*

**Scope and coverage:** all 25 indexable URLs (8 static pages, 6 vehicle pages, 11 destination pages) plus `/admin` and 404 behaviour. The source code was reviewed in full. The live site was checked with curl, Google DNS, PageSpeed Insights, and the in-app browser.

**Limitations:** no Search Console, Google Business Profile, analytics, or backlink-tool access. Field Core Web Vitals don't exist yet (CrUX shows "No Data" for this origin). **Nothing is deployed yet:** all fixes are local and uncommitted, waiting for your approval.

---

## 2. Checklist

Evidence levels: **Code** = source repo · **Live** = curl, DNS or browser against rasheholidays.com · **Local** = local SSR server.

### A. Rendering & indexability
| Item | Status | Evidence | Priority |
|---|---|---|---|
| JS rendering / SSR | PASS (+ one FIXED) | Live raw HTML contains title, meta, H1, body copy. Hero stats were empty `<span>`s in SSR ("+ Happy Customers"); they now render real numbers in the HTML | — |
| sitemap.xml | FIXED & VERIFIED (local) | Live `/sitemap.xml` → 404. Local: 200 `application/xml`, 25 URLs, generated from site data | Critical |
| robots.txt | FIXED & VERIFIED (local) | Allows all, no AI-crawler rules (none changed). Added `Sitemap:` line | High |
| Unintended noindex | PASS | Only `/admin` (intended) and not-found pages are noindex. No `X-Robots-Tag` header live | — |
| Canonical tags | FIXED & VERIFIED (local) | Live: none. Local: 25/25 pages have exactly one absolute self-canonical. `?category=` and `/booking?…` canonicalise to the clean URL | Critical |
| HTTPS & hostname | ISSUE FOUND / BLOCKED | `http://rasheholidays.com` → 200, no redirect. `www.` doesn't resolve (NXDOMAIN) | High |
| Status codes / soft 404 | PASS | `/nope`, `/vehicles/<bad>`, `/destinations/<bad>` all return real 404 live | — |
| Trailing-slash redirects | ISSUE FOUND (not fixed) | `/about/` → **307** (temporary) → `/about`; should be 301/308. Framework/host behaviour | Low |
| URL slugs | PASS | Lowercase, readable. No URLs changed | — |
| Duplicate / thin content | ISSUE FOUND | Destination photos don't match places (see E). Vehicle and destination pages are short and template-driven | Medium |
| hreflang | N/A | Single-language (English) site | — |

### B. On-page
| Item | Status | Evidence | Priority |
|---|---|---|---|
| Titles | FIXED & VERIFIED (local) | 25 unique, 46–62 chars, query-first (e.g. "Ooty to Coimbatore Airport Taxi — Fixed Fares") | High |
| Meta descriptions | FIXED & VERIFIED (local) | 25 unique, 134–162 chars, built from real fares, distances and highlights. Removed the false "19-seater"/"hatchback" claims | High |
| One H1 per page | PASS | Exactly 1 H1 on all 25 URLs (crawl-verified) | — |
| Heading hierarchy | PASS | H1 → section H2 → card H3 | — |
| H1 keyword targeting | ISSUE FOUND (not changed) | Home H1 "Travel the Nilgiris in quiet comfort"; inner H1s like "Pick the vehicle that fits your trip". These are brand-copy decisions, see §3 | High |
| Image alt text | PASS (with caveat) | Informative images have alt; decorative hero backgrounds use `alt=""`. Caveat: several alts name places the photo doesn't show (see E) | Medium |
| Open Graph / Twitter | FIXED & VERIFIED (local) | Added `og:url`, absolute `og:image` (+alt, size on default), `og:locale`, Twitter title/description/image. The `og:image` URL returns 200 on production | Medium |
| Duplicate metadata | PASS (after fix) | No duplicate titles/descriptions; one canonical per page; TanStack dedupes meta | — |
| Keyword / intent mapping | Done, see §6 | No search-volume data available; mapping is by intent only | — |

### C. Structured data
| Item | Status | Evidence | Priority |
|---|---|---|---|
| Existing markup | PASS | None existed, so no conflicts | — |
| TravelAgency (LocalBusiness) | FIXED & VERIFIED (local) | Home + contact: name, URL, phone, full address, 24/7 hours, areas served. JSON parses. **Email left out** because it's broken. `geo` left out because there are no verified office coordinates | High |
| WebSite | FIXED & VERIFIED (local) | Home | Low |
| BreadcrumbList | FIXED & VERIFIED (local) | All 11 destination pages; matches the visible breadcrumb | Medium |
| Ratings / reviews markup | Deliberately not added | Google ignores self-serving LocalBusiness review markup, and the on-site ratings can't be verified (see I) | — |
| Rich Results Test validation | NOT VERIFIED | Run after deploy: https://search.google.com/test/rich-results | Medium |

### D. Links
| Item | Status | Evidence | Priority |
|---|---|---|---|
| Broken internal links | FIXED & VERIFIED (local) | Footer (every page): 2 links → 404. Now 5 working links to Crysta, HyCross, Tempo Traveller, Urbania, Sedan | High |
| Broken `mailto:` | ISSUE FOUND | `mailto:hello@rasheholidays.in` points to a non-existent domain | Critical |
| Crawlable links | PASS | Nav, footer and cards use real `<a href>`. All sitemap URLs are reachable from listing pages | — |
| Orphan pages | PASS | Every vehicle/destination URL is linked from `/vehicles` or `/destinations` | — |
| External links | PASS (spot-checked) | `wa.me`, `tel:`, Maps embed formats correct. No exhaustive external crawl | — |

### E. Images
| Item | Status | Evidence | Priority |
|---|---|---|---|
| Oversized / old formats | ISSUE FOUND | PSI: **987 KiB** potential savings on the homepage. Hero JPG 437 KiB @1600 px; `tavera.png` 545 KiB; vehicle photos stored as PNG; no WebP/AVIF/srcset | High |
| Wrong photos for places | ISSUE FOUND | Coonoor & Trichy use `coorg.jpg`; Pykara & Mudumalai use `mysore.jpg`; Calicut & Cochin use `kerala.jpg`. Needs real photos | Medium |
| Width/height / CLS | PASS | Cards use aspect-ratio boxes; mobile CLS 0.015 (lab) | — |
| Lazy-loading / LCP image priority | PASS + FIXED | Below-fold images lazy; hero eager + preloaded. Added `fetchpriority="high"` to hero | — |
| WhatsApp icon | ISSUE FOUND | 512×512 PNG (37 KiB), shown at ~40 px and preloaded on every page | Low |

### F. Core Web Vitals & performance
| Item | Status | Evidence | Priority |
|---|---|---|---|
| Field data (real users) | NOT VERIFIED | PageSpeed Insights: "No Data" for origin (10 Oct 2026); too little traffic yet | — |
| Lab, mobile (before) | ISSUE FOUND | PSI / Lighthouse 13.5.0, live homepage: **Perf 68**, FCP 3.5 s, **LCP 5.8 s**, TBT 0 ms, CLS 0.015, SI 5.4 s | High |
| Lab, desktop (before) | PASS | Perf 98, LCP 0.9 s, CLS 0.002 | — |
| LCP cause | ISSUE FOUND | Mobile LCP element = the "25,000+" counter, with 2.7 s render delay. Hero text uses a `fade-up` animation from opacity 0, so Chrome skips it as an LCP candidate and LCP waits for the counter animation | Medium |
| Render-blocking | ISSUE FOUND | Google Fonts CSS (750 ms) + app CSS (480 ms); Manrope ×5 weights + Instrument Serif ×2 styles | Medium |
| INP | NOT VERIFIED | Needs field data | — |
| After measurements | NOT VERIFIED | Fixes not deployed yet; re-run PSI after deploy | — |

### G. Mobile & accessibility
| Item | Status | Evidence | Priority |
|---|---|---|---|
| Viewport meta | PASS | `width=device-width, initial-scale=1` | — |
| Horizontal overflow | FIXED & VERIFIED (local) | Live `/vehicles` = 407 px at a 375 px viewport. Local: 11 templates × 360/375/414 px, all fit | High |
| Accessibility basics | FIXED (2 items) | Lighthouse a11y 97. Fixed "prohibited ARIA" on star ratings; animated counters now read as real numbers by screen readers | Low |

### H. Search Console
| Item | Status | Evidence | Priority |
|---|---|---|---|
| Property / sitemap / indexing | BLOCKED | No access. Verification file `/google4e1563dfaffaa22f.html` is served via a **307 redirect**. The `google-site-verification` meta tag reuses the HTML-file code, which isn't a meta-tag token, so it likely verifies nothing. No TXT record exists on the domain | High |

### I. Local SEO
| Item | Status | Evidence | Priority |
|---|---|---|---|
| NAP consistency | ISSUE FOUND | Name/phone/address consistent on-site (single source). **Email domain dead** | Critical |
| Google Business Profile | NOT VERIFIED | No access. This is the single biggest lever for "taxi near me / Ooty taxi" map-pack results | Critical |
| Map embed | ISSUE FOUND | Embeds a generic "Charring Cross, Ooty" search, not your business listing | Low |
| Reviews & claims | ISSUE FOUND | Per-vehicle "4.9 · 486 reviews", "Rated 4.9 out of 5", "12,000+ customers", testimonials: I can't verify these. If they aren't real, remove them (Google policy and Indian consumer-protection rules on fake reviews) | High |

---

## 3. Prioritised action plan

**Critical**
1. **Fix the email.** Tell me the real inbox (e.g. a Gmail or a `@rasheholidays.com` address you'll set up) and I'll update `src/data/site.ts`. One change covers the footer, contact page and schema.
2. **Deploy the fixes** in this report (commit + push to `main`; Lovable syncs).
3. **Google Business Profile:** claim/verify it, category "Taxi service" (secondary "Travel agency"). Use exactly the same name, address and phone as the site, add real photos of your vehicles, and ask every customer for a review.
4. **Search Console:** add a **Domain property** verified by DNS TXT record in Cloudflare (covers http/https/www), then submit `https://rasheholidays.com/sitemap.xml`.

**High**
5. **Cloudflare → SSL/TLS → Edge Certificates → "Always Use HTTPS": On.** Optionally add a `www` DNS record plus a redirect rule to the apex.
6. **Optimise images** (about 1 MB saved on the homepage): convert to WebP, resize to display size, add `srcset`. Needs a dev-dependency (`sharp`), so I need your OK.
7. **Keyword-led H1s** (copy decision). Suggestions that keep the style: home "Ooty taxi & cab service across the Nilgiris"; vehicles "Taxis, Innovas & tempo travellers in Ooty"; destinations "Sightseeing & airport taxis from Ooty".
8. **Review claims:** keep only ratings, counts and testimonials you can back up.

**Medium**
9. **New landing pages for missing high-intent searches:** *Coimbatore Airport → Ooty taxi* (arrival direction; the current page is Ooty → airport only), *Mettupalayam ↔ Ooty*, *Ooty ↔ Mysore / Bangalore city*, *Kotagiri*, *Tempo traveller in Ooty*. Each needs real fares and 300+ words of genuinely useful route info (ghat road, timing, stops).
10. **Replace mismatched destination photos** with real ones of Coonoor, Pykara, Mudumalai, Calicut, Cochin and Trichy.
11. **LCP:** drop the opacity part of the hero `fade-up` (keep the slide) or show the counters' final values without animating. This is a design call.
12. **Fonts:** self-host Manrope + Instrument Serif, or trim the weights, to remove about 750 ms of render-blocking.

**Low**
13. Trailing-slash 307 → 308; shrink the WhatsApp icon; embed the GBP listing on the contact page.

---

## 4. Implementation summary (local, **not committed or deployed**)

**New files**
- `src/lib/seo.ts`: `pageHead()` (title, description, canonical, OG, Twitter in one place), JSON-LD builders (TravelAgency, WebSite, BreadcrumbList), description-fitting helpers.
- `src/routes/sitemap[.]xml.ts`: `/sitemap.xml` server route built from `vehicles` + `destinations`, so it can't drift from real pages.

**Modified**
- `src/data/site.ts`: `siteUrl`, structured `postalAddress` (same address as displayed).
- `src/routes/__root.tsx`: fallback title (404 pages had none), `og:locale=en_IN`.
- All page routes: `pageHead()` with rewritten titles/descriptions. JSON-LD on home, contact and destination pages.
- `src/components/site/Footer.tsx`: broken fleet links replaced with 5 valid ones.
- `src/components/site/PricingTable.tsx`, `src/routes/vehicles.index.tsx`, `src/routes/vehicles.$slug.tsx`: mobile overflow fixes, no visual redesign.
- `src/components/ui/CountUp.tsx`: final number in SSR HTML (visually hidden; animation unchanged).
- `src/components/site/Stars.tsx`: `role="img"` for valid ARIA.
- `src/routes/index.tsx`: `fetchpriority="high"` on hero image.
- `public/robots.txt`: `Sitemap:` line.
- `src/routeTree.gen.ts`: auto-regenerated for the sitemap route.
- `src/routes/about.tsx`: "three-category fleet" → "five-category" (matches the site's own fleet data).

**Not changed:** URLs, redirects, DNS/hosting, copy beyond metadata, images, AI-crawler rules, dependencies.

---

## 5. Verification

| Check | Result |
|---|---|
| `npm run build` | Pass |
| TypeScript | No new errors. 87 pre-existing errors (BookingForm, lib, data, one route) unchanged |
| ESLint (changed code) | Clean. Pre-existing Prettier issues in untouched lines left alone |
| Local crawl of all 25 sitemap URLs | 25 × HTTP 200, exactly one title/description/canonical/H1 each, canonical = sitemap URL, absolute production `og:image`, valid JSON-LD, 0 duplicate titles/descriptions |
| Query-string canonicals | `/vehicles?category=4-seater` → `/vehicles`; `/booking?…` → `/booking` |
| 404s | Unknown routes still 404, with a title and no canonical |
| Mobile overflow | 0 of 33 (11 templates × 360/375/414 px) |
| Console errors / hydration | None on home |
| Production asset paths | `og:image` resolves to `/assets/hero-ooty-eb4_c1BV.jpg`, 200 on live |
| **Live site** | **Unchanged until deployed.** After deploy, re-run: sitemap fetch, Rich Results Test, PSI mobile, Search Console URL Inspection |

**Before (live, 10 Oct 2026, PSI / Lighthouse 13.5.0, PSI default mobile profile):** Perf 68, LCP 5.8 s, FCP 3.5 s, CLS 0.015, TBT 0 ms · Desktop Perf 98. No "after" numbers yet; none claimed.

---

## 6. Ranking strategy beyond technical SEO (strategy, not findings)

Searches like "Ooty taxi", "taxi in Ooty", "Coimbatore to Ooty cab" are **local-intent**, and Google shows the **map pack** above organic results. What moves them:

1. **Google Business Profile** (correct category, real photos, posts, Q&A, fast replies) plus a **steady flow of genuine reviews** that mention the service and route ("Coimbatore airport to Ooty in a Crysta…"). This matters more than anything else on this list.
2. **Consistent citations:** the same name, address and phone on Justdial, Sulekha, IndiaMART, TripAdvisor (transport), Bing Places and Apple Business Connect.
3. **Pages for every money query** (§3 item 9), each with real fares and practical route detail competitors don't have.
4. **Genuine local links:** partner hotels and homestays in Ooty/Coonoor ("recommended taxi" pages), tea-estate and tour operators, Nilgiris travel blogs, local news coverage. No paid link schemes.

**Intent → page map**
| Search intent | Page |
|---|---|
| Ooty taxi / cab booking / taxi service in Ooty | `/` |
| Innova Crysta / HyCross / Tempo Traveller / Urbania hire in Ooty | `/vehicles/<slug>` |
| Ooty / Coonoor / Pykara / Mudumalai sightseeing taxi | `/destinations/<slug>` |
| Ooty to <airport> taxi | `/destinations/<airport>` |
| **Coimbatore airport → Ooty**, Mettupalayam ↔ Ooty, Ooty ↔ Mysore/Bangalore city, Kotagiri taxi | **Gap: no page** |
