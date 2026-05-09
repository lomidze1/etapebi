---
name: seo
description: Technical and on-page SEO reference for the etapebi.com Astro site. Includes JSON-LD templates (ProfessionalService, LocalBusiness, Service, BreadcrumbList, Place, Article), Core Web Vitals targets, and Georgian-locale notes (lang="ka", regional targeting in Search Console). Use when implementing or reviewing SEO features, adding structured data, writing meta tags, or optimizing for Core Web Vitals. For audits of specific files, use the `seo` agent instead.
---

# SEO reference for etapebi.com

This skill is a reference handbook. Don't run audits with it — for that, use the `seo` agent.

## Site context

- Domain: `etapebi.com`
- Language: Georgian only (`lang="ka"`, `og:locale=ka_GE`)
- Type: Personal-brand professional service site (not e-commerce, not blog)
- Service area: Khashuri + all of Georgia
- Stack: Astro 5 (static), Tailwind CSS, MDX content collections
- No JavaScript framework. Static HTML output. Cloudflare Pages CDN.

## Technical SEO checklist

- [ ] `astro.config.mjs` has `site: 'https://etapebi.com'` and `trailingSlash: 'never'`
- [ ] `@astrojs/sitemap` integration registered; filter excludes `/admin`
- [ ] `public/robots.txt` allows `/`, disallows `/admin`, links to `/sitemap-index.xml`
- [ ] HTTPS enforced (Cloudflare Pages default)
- [ ] HTTP/2 enabled (Cloudflare default)
- [ ] No render-blocking JavaScript
- [ ] CSS minified and tree-shaken (Astro default in production)
- [ ] No mixed content
- [ ] 404 page exists at `src/pages/404.astro`
- [ ] Favicon `/favicon.svg` exists and is referenced
- [ ] OG image `/og-image.png` exists at 1200×630, in brand colors

## On-page SEO checklist (per page)

- [ ] `<title>` 30–60 characters, unique, brand suffix when natural
- [ ] `<meta name="description">` 120–155 characters, unique
- [ ] One `<h1>` per page
- [ ] Heading hierarchy: no skipped levels (h1 → h2 → h3)
- [ ] Canonical link tag matches the page URL
- [ ] Internal linking: every page links to ≥1 other page
- [ ] All `<Image>` components have meaningful `alt` (or `alt=""` for decorative)
- [ ] No orphan pages (every page reachable from `/`)

## Open Graph and Twitter Card template

Every page should ship with these tags. `BaseLayout.astro` already injects them site-wide; don't duplicate.

```html
<meta property="og:type" content="website" /> <!-- "article" for project detail pages -->
<meta property="og:locale" content="ka_GE" />
<meta property="og:site_name" content="გიორგი ლომიძე" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:url" content="..." />
<meta property="og:image" content="https://etapebi.com/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="https://etapebi.com/og-image.png" />
```

OG image rules: 1200×630, charcoal background `#161616`, cream foreground `#ede6d4`, font-weight 400 or 500, no gradient/shadow.

## Structured data templates (JSON-LD)

Render via `<script type="application/ld+json" set:html={JSON.stringify(schema)} />`. Multiple JSON-LD blocks per page are allowed and recommended (one site-wide entity + one page-specific + breadcrumbs).

### ProfessionalService — site-wide, in BaseLayout

```ts
const professionalService = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'გიორგი ლომიძე',
  description:
    'მშენებლობის ეტაპების სპეციალისტი — ეტაპობრივი ფოტოანგარიში, ოქმების მომზადება და დოკუმენტური აღრიცხვა.',
  url: 'https://etapebi.com',
  telephone: '+995593502093',
  email: 'info@etapebi.com',
  areaServed: { '@type': 'Country', name: 'საქართველო' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'ხაშური',
    addressCountry: 'GE',
  },
};
```

### LocalBusiness — alternative, only if a visitable office exists

`ProfessionalService` already covers Giorgi's case. Switch to `LocalBusiness` only if a physical, public-facing office opens. `LocalBusiness` requires `openingHours` and a precise street address.

### Service — per service page (optional enrichment)

```ts
const service = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'მშენებლობის ეტაპების ფოტოანგარიში',
  provider: {
    '@type': 'ProfessionalService',
    name: 'გიორგი ლომიძე',
    url: 'https://etapebi.com',
  },
  areaServed: { '@type': 'Country', name: 'საქართველო' },
};
```

### BreadcrumbList — project detail pages

```ts
const breadcrumbs = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'მთავარი', item: 'https://etapebi.com/' },
    { '@type': 'ListItem', position: 2, name: 'პროექტები', item: 'https://etapebi.com/projects' },
    { '@type': 'ListItem', position: 3, name: project.data.title },
  ],
};
```

### Place — the building/location being documented

```ts
const place = {
  '@type': 'Place',
  name: project.data.title,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'GE',
    addressLocality: 'ხაშური',
    streetAddress: 'სააკაძის ქუჩა N133',
  },
};
```

### Article — wraps the documentation about the Place

```ts
const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: project.data.title,
  description: project.data.description,
  datePublished: project.data.publishedAt.toISOString(),
  inLanguage: 'ka',
  author: {
    '@type': 'Person',
    name: 'გიორგი ლომიძე',
    url: 'https://etapebi.com',
  },
  publisher: {
    '@type': 'ProfessionalService',
    name: 'გიორგი ლომიძე',
    url: 'https://etapebi.com',
  },
  about: place,
};
```

`Report` (a subtype of `Article`) is also valid and semantically closer to "ეტაპობრივი ანგარიში". `Article` is the safer default — broader crawler support and well-understood by Google. Use `Report` only if Search Console starts surfacing better Article-style rich results and you want to specialize.

## Core Web Vitals targets

| Metric | Good | Needs Improvement | Poor |
|---|---|---|---|
| LCP — Largest Contentful Paint | <2.5s | 2.5–4.0s | >4.0s |
| INP — Interaction to Next Paint | <200ms | 200–500ms | >500ms |
| CLS — Cumulative Layout Shift | <0.1 | 0.1–0.25 | >0.25 |

For this site (static, no JS): LCP and CLS are the only realistic risks. INP should be near-zero.

- LCP: the cover image on a project page is the LCP element. Use Astro `<Image>` with `widths={[640, 1080, 1920]}`, `formats={['avif', 'webp']}`, and `loading="eager"` for above-the-fold heroes only. All other images stay lazy by default.
- CLS: always set explicit width/height (or aspect-ratio) on images. Astro `<Image>` does this automatically when used with imported assets — verify by inspecting the built HTML for `width=` and `height=` attributes.
- INP: should stay near-zero. Watch for any `<script>` tag that gets added — every JS bundle is a regression risk.

## Image SEO

- Always use Astro `<Image>` from `astro:assets`. Never raw `<img>`.
- Astro `<Image>` generates AVIF + WebP and a responsive `srcset` automatically.
- `alt`: meaningful Georgian text for content images. Empty string `alt=""` for purely decorative.
- For project cover images: 1600×1200 source minimum, 4:3 aspect ratio.
- Per-project OG image override: not implemented yet. Phase 4 candidate — would require storing an absolute-URL pointer to the cover image and threading it through `BaseLayout`.

## Georgian-locale notes

- `<html lang="ka">` always set — `BaseLayout` handles this site-wide.
- `og:locale="ka_GE"` (note underscore between language and region, not hyphen).
- `addressCountry: "GE"` (ISO 3166-1 alpha-2 for Georgia).
- `inLanguage: "ka"` on Article schemas.
- No `hreflang` needed today — Georgian is the only language. If English is ever added: pair `<link rel="alternate" hreflang="ka" href="..." />` with `<link rel="alternate" hreflang="en" href="..." />` and an `x-default`.
- Google Search Console: International Targeting → set Country = Georgia. Small ranking signal for `.com` TLDs targeting a single country market.
- Bing Webmaster Tools: Geographic Targeting → Georgia. Same idea.
- Yandex Webmaster: Georgia is in the CIS-adjacent footprint; submit sitemap there too if traffic warrants.

## What not to do

- No render-blocking JavaScript.
- No third-party scripts without explicit justification (no jQuery, no Bootstrap, no Google Analytics — use Cloudflare Web Analytics or Plausible later, both privacy-respecting and lightweight).
- No tracking pixels.
- No meta `keywords` tag (Google ignores it; pure clutter).
- No `og:locale` ALT versions until multi-language ships.
- No keyword stuffing in copy. Read the Georgian content out loud — if it sounds unnatural, rewrite.
- Don't repeat the brand name in `<title>` more than once.
- Don't ship draft `description` text from CMS without review — Decap might leave editor placeholders behind.

## When auditing

Use the `seo` agent at `.claude/agents/seo.md`. It reads a file and produces categorized findings in Georgian. This skill is reference, not action.

## Quick references

- Schema validator: https://validator.schema.org/
- Rich Results test: https://search.google.com/test/rich-results
- Mobile-friendly test: https://search.google.com/test/mobile-friendly
- PageSpeed Insights: https://pagespeed.web.dev/
- WebPageTest: https://www.webpagetest.org/
