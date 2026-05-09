---
name: astro-patterns
description: Project-specific Astro conventions for etapebi.com — file organization, the single-layout pattern, the Image component contract (widths, formats, loading strategy), the content collection schema and its Decap CMS alignment, semantic Tailwind tokens (never hex in components), and the project's anti-patterns. This is not a generic Astro reference; it documents the actual decisions in this codebase. Use when adding pages, components, or content; when reviewing a PR for project-fit; or when porting a pattern from elsewhere into the etapebi codebase.
---

# Astro patterns — etapebi.com

This skill documents the actual conventions in this codebase, not generic Astro practices. When in doubt, read the cited file.

## Stack snapshot

- Astro 5 (static output, no SSR)
- Tailwind CSS 3.4 via `@astrojs/tailwind` (no JS framework integration)
- TypeScript strict (`astro/tsconfigs/strict`)
- MDX content via `@astrojs/mdx`
- Sitemap via `@astrojs/sitemap` (filtered to exclude `/admin`)
- `trailingSlash: 'never'`, `site: 'https://etapebi.com'` — see `astro.config.mjs`
- Output: pure static HTML to `dist/`. No client-side hydration anywhere.

## File organization

```
src/
├── pages/                       # Astro file-based routing (URLs in English)
│   ├── index.astro              # /
│   ├── services.astro           # /services
│   ├── about.astro              # /about
│   ├── contact.astro            # /contact
│   └── projects/
│       ├── index.astro          # /projects (grid)
│       └── [slug].astro         # /projects/<slug> (detail page)
├── layouts/
│   └── BaseLayout.astro         # one layout, every page
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   └── ProjectCard.astro
├── content/
│   ├── config.ts                # collection schema (mirrors Decap config.yml)
│   └── projects/
│       └── *.mdx                # one file per project
├── styles/
│   └── global.css               # Tailwind layers + small base overrides
└── env.d.ts                     # Astro types reference

public/
├── robots.txt                   # disallows /admin, links sitemap-index.xml
└── (favicon.svg, og-image.png — TBD, Phase 4)
```

Conventions:

- **URLs in English**, **content in Georgian**. Slugs like `khashuri-saakadze-133`.
- **Folder for collections of pages.** When a route has children (`/projects` + `/projects/[slug]`), use `pages/projects/index.astro` + `pages/projects/[slug].astro`, not `pages/projects.astro`.
- **One Astro page = one file.** Don't split a page across multiple Astro files. Extract repeated UI into `components/`.

## Component framework choice

Always Astro components (`.astro`). No React, Vue, Svelte, Solid integrations. No `client:*` directives anywhere.

Why: this site has zero interactive client behavior. A static HTML build is the simplest correct answer. Adding a framework would mean shipping JS for no user benefit and would regress LCP / INP scores.

If a future feature genuinely needs interactivity (e.g., a lightbox for the gallery): first try a CSS-only solution. If that fails, evaluate adding `@astrojs/react` or similar — but it requires a written justification in the PR description.

## Layout pattern: one layout, every page

There is exactly one layout — `src/layouts/BaseLayout.astro`. Every page imports it and passes `title`, `description`, and optionally `extraJsonLd`.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="..."
  description="..."
  extraJsonLd={[breadcrumbsSchema, articleSchema]}
>
  <!-- page content -->
</BaseLayout>
```

`BaseLayout` owns:

- `<html lang="ka">`
- All `<head>` meta: charset, viewport, canonical, title, description, full Open Graph + Twitter Card
- The site-wide `ProfessionalService` JSON-LD block
- Optional extra JSON-LD blocks per page (passed via `extraJsonLd`)
- The page chrome: `<Header />`, `<main>`, `<Footer />`

Pages own only the page body. Don't write `<head>` content directly in a page — extend `BaseLayout`'s props instead.

## Content collection pattern

Single collection: `projects`. Defined in `src/content/config.ts` using the modern glob loader (Astro 5+):

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      location: z.string(),
      buildingClass: z.string(),
      permitDate: z.coerce.date(),
      permitValidUntil: z.coerce.date(),
      buildingType: z.string(),
      stagesCompleted: z.array(z.coerce.number().int().min(1).max(5)).default([]),
      coverImage: image().optional(),
      gallery: z.array(image()).default([]),
      description: z.string(),
      publishedAt: z.coerce.date(),
    }),
});

export const collections = { projects };
```

Fixed contract:

- `slug` is **not** a frontmatter field. The slug is derived from filename (the glob loader uses `entry.id` for routing).
- `coverImage` is optional. The UI must degrade gracefully — see `ProjectCard.astro` for the `სურათი მზადდება` placeholder pattern.
- `gallery` defaults to `[]`. Detail page renders the gallery section only when length > 0.
- `stagesCompleted` is bounded to integers 1–5. Build fails on out-of-range data.
- Dates use `z.coerce.date()` so YAML date literals (`2025-09-15`) and ISO strings both validate.

**Decap CMS alignment.** The Decap `config.yml` (Phase 3) must mirror this schema field-for-field. Any change here forces a change there. When you add a field, document it in both files in the same commit.

## Image pattern

Always `<Image>` from `astro:assets`. Never raw `<img>`.

The project's standard contract for content images (cover, gallery):

```astro
<Image
  src={data.coverImage}
  alt={`${data.title} — სათავე სურათი`}
  widths={[640, 1080, 1920]}
  sizes="(min-width: 1024px) 1024px, 100vw"
  formats={['avif', 'webp']}
  loading="eager"  // only for above-the-fold hero / cover
  class="w-full h-auto border border-subtle"
/>
```

Rules:

- **`widths`**: `[640, 1080, 1920]` for full-width images; `[640, 1080]` for grid cards. Astro derives a responsive `srcset` from this.
- **`formats`**: `['avif', 'webp']`. Don't ship JPEG or PNG when a modern format works.
- **`sizes`**: always set. Without it, the browser can't pick the right `srcset` candidate.
- **`loading`**: default `lazy` for everything below the fold (gallery, cards). Set `loading="eager"` only on the LCP element of a page (typically the cover image on a project detail page).
- **`alt`**: meaningful Georgian text for content images. Use `alt=""` (empty string, never missing) for purely decorative images.
- **Aspect ratio**: enforced by container (e.g., `aspect-[4/3]` on the card thumbnail wrapper) when using `object-cover`. This avoids CLS during image decode.

Imported / collection images get explicit `width` and `height` attributes from Astro automatically — verify by inspecting built HTML.

## Tailwind tokens — semantic only

Defined in `tailwind.config.mjs`:

| Token | Hex | Use |
|---|---|---|
| `bg-base` | `#161616` | Page background, default surface |
| `bg-elevated` | `#1d1d1d` | Cards, raised surfaces |
| `text-primary` | `#ede6d4` | Body text, headings |
| `text-muted` | `#9a948a` | Secondary text, metadata, labels |
| `border-subtle` | `#2a2a28` | Dividers, low-contrast borders |

Rules:

- **Never write hex in components.** Use the semantic token. If a new token is genuinely needed, add it to `tailwind.config.mjs` first and update this skill, then use it.
- **Never use `text-base` for font size.** It collides with the `base` color token (Tailwind generates both `font-size` and `color` rules with the same selector). For 1rem text, rely on the body default or use a sibling size like `text-sm` / `text-lg`. `text-base` as a color (cream → `#161616`) is fine because the color rule is what we want when on a cream background.
- **Pre-verified contrast** (per CLAUDE.md):
  - `text-primary` on `bg-base` = 14.93:1 (WCAG AAA)
  - `text-muted` on `bg-base` = 6.08:1 (WCAG AA)
- **Borders for non-text UI** (1.4.11 ≥3:1): use `border-muted` (6:1) when the boundary itself must communicate state. `border-subtle` is fine for purely decorative dividers.

Font weight: only `font-normal` (400) and `font-medium` (500). The Tailwind defaults for 600/700 must not appear in any component. If they sneak in via `font-semibold` or `font-bold`, treat as a bug.

## Global CSS

`src/styles/global.css` is intentionally minimal: Tailwind layers, body defaults (`bg-base`, `text-primary`, line-height 1.65), heading defaults (line-height 1.25, letter-spacing -0.3px, font-weight 500), `:focus-visible` outline, and `::selection` colors.

Do **not** add component classes here. Compose with Tailwind utilities at the call site.

## SEO injection

`BaseLayout` injects everything site-wide. For per-page additions:

- **Page-specific JSON-LD** (BreadcrumbList, Article, etc.): pass via `extraJsonLd={[...]}` prop.
- **Custom OG image per page**: not yet supported. TBD Phase 4 — would need an `ogImage?: string` prop threaded through.
- **Custom canonical**: not currently overridable. Layout derives canonical from `Astro.url`.

## Anti-patterns — never do these

1. **Raw `<img>` tag.** Use `<Image>` from `astro:assets`. No exceptions for "small" or "decorative" images.
2. **Hex colors in component class lists.** Use semantic tokens. If a token is missing, add it first.
3. **Adding a JS framework integration "just in case".** Astro components only. Adding React/Vue/Svelte costs build time, bundle size, and complexity — require justification.
4. **`client:*` directives.** None exist in the project. If you find yourself reaching for one, the design is probably wrong.
5. **Inline `<style>` blocks for site-wide concerns.** Use `global.css`. Inline `<style>` is acceptable only for one-off scoped styles in a single component, and even then prefer Tailwind.
6. **Duplicating SEO meta in pages.** `BaseLayout` is the single source. Extend its props if a new meta tag is needed everywhere; pass JSON-LD if it's per-page.
7. **`font-semibold` / `font-bold` / `font-extrabold`.** Brand only ships 400 and 500.
8. **Title Case or ALL CAPS in user-facing text.** Sentence case only. This includes button labels and nav.
9. **Adding a `tools:` field to agents or `name:` collisions.** The project's existing agents/skills use minimal frontmatter — match that shape.
10. **Reading `.astro` files with `<img>` in mind.** Astro components are HTML + JS frontmatter; the rules above apply to the rendered output, not just the source.

## TBD — decisions deferred

These are genuinely undecided in the codebase right now. Don't pretend they're settled.

- **404 page.** No `src/pages/404.astro` yet. Astro falls back to the build-time default. Add one before deploy (Phase 5).
- **Per-project OG image override.** Phase 4 candidate. Requires absolute URL serialization for collection images.
- **Decap CMS UI.** Phase 3 — `public/admin/index.html` + `public/admin/config.yml`. Schema must mirror `src/content/config.ts`.
- **Real images.** All `coverImage` / `gallery` are currently absent. Sample MDX files have no images.
- **Analytics.** None installed. Cloudflare Web Analytics or Plausible — decision deferred.
- **Form backend.** `/contact` has no form yet. Cloudflare Pages Functions is the planned backend (Phase 4).
