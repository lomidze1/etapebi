# etapebi.com

გიორგი ლომიძის — მშენებლობის ეტაპების სპეციალისტის — პერსონალური ვებსაიტი.

## ტექ სტეკი

- Astro 5 (სტატიკური)
- Tailwind CSS 3
- TypeScript (strict)
- MDX content collections
- Decap CMS (`/admin`, GitHub backend, OAuth proxy Pages Functions-ით)
- Cloudflare Pages (ჰოსტინგი) + Pages Functions (`/api/contact`, `/oauth/*`)

## წინაპირობები

- Node.js LTS (≥ 20)
- npm
- Cloudflare account (production-ისთვის)
- GitHub account (production-ისთვის)
- Resend account (ფორმის ემაილისთვის)

## სწრაფი დაწყება

```bash
npm install
npm run dev
```

ლოკალური სერვერი: <http://localhost:4321>

## npm scripts

| ბრძანება | რას აკეთებს |
|---|---|
| `npm run dev` | ლოკალური dev სერვერი (`localhost:4321`), hot reload |
| `npm run build` | წარმოების ბილდი — გენერდება `dist/` |
| `npm run preview` | წარმოების ბილდის ლოკალური ნახვა |
| `npm run check` | TypeScript და Astro სქემის შემოწმება |
| `npm run cms` | Decap CMS-ის ლოკალური proxy (`localhost:8081`) |
| `npm run astro` | Astro CLI-ის პირდაპირი გამოძახება |

## საქაღალდის სტრუქტურა

```
etapebi/
├── src/
│   ├── pages/            # ფაილ-დაფუძნებული მარშრუტიზაცია
│   ├── layouts/          # BaseLayout — ერთი ლეიაუტი ყველა გვერდისთვის
│   ├── components/       # Header, Footer, ProjectCard, Hero, Button …
│   ├── content/          # projects collection (MDX) + config.ts
│   └── styles/           # global.css (Tailwind layers)
├── public/
│   ├── admin/            # Decap CMS UI (index.html + config.yml)
│   └── robots.txt
├── functions/
│   ├── api/contact.ts    # ფორმის backend (Turnstile + Resend)
│   └── oauth/            # Decap-ის OAuth proxy (auth.ts + callback.ts)
├── .claude/
│   ├── agents/           # seo, a11y, content-writer, designer
│   └── skills/           # seo, brand-voice, astro-patterns
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## ლოკალური CMS

კონტენტის რედაქტირება Decap CMS-ით ლოკალურად — ორი ტერმინალია საჭირო.

ერთ ტერმინალში:

```bash
npm run cms
```

მეორე ტერმინალში:

```bash
npm run dev
```

ბრაუზერში: <http://localhost:4321/admin/>

`local_backend: true` მითითების გამო Decap CMS UI ტოვებს GitHub OAuth-ს და მუშაობს `decap-server`-ის proxy-ით — ცვლილებები პირდაპირ ლოკალურ ფაილებში იწერება (`src/content/projects/`).

ფორმის backend (`/api/contact`) **ლოკალურად არ მუშაობს** — Pages Functions მხოლოდ Cloudflare-ის გარემოში გადის. ლოკალური ტესტისთვის `wrangler pages dev dist` შესაძლებელია, თუმცა production-ში ფაქტობრივი test უფრო მარტივი.

---

## Production deployment

ერთხელადი setup, ~1–2 საათი. ნაბიჯები **წააკითხე ბოლომდე ჯერ ერთხელ**, შემდეგ შეასრულე — დამოკიდებულებები (env vars-ი ერთი ნაბიჯიდან მეორეში გადის) ცხადი გახდება.

### საჭირო env vars (ერთიანი ცხრილი)

| Variable | Purpose | სად დაიყენება |
|---|---|---|
| `GITHUB_CLIENT_ID` | OAuth proxy → Decap auth | Pages env (B.3) |
| `GITHUB_CLIENT_SECRET` | OAuth proxy → Decap auth | Pages env (B.3) |
| `TURNSTILE_SECRET` | Server-side spam ვერიფიკაცია | Pages env (B.3) |
| `PUBLIC_TURNSTILE_SITE_KEY` | Client-side widget rendering | Pages env (B.3) |
| `RESEND_API_KEY` | Email sending | Pages env (B.3) |
| `MAIL_TO_ADDRESS` | ფორმის შეტყობინების მიმღები | Pages env (B.3) |
| `MAIL_FROM_ADDRESS` | „From" ფაქტობრივი მისამართი (`info@etapebi.com`) | Pages env (B.3) |

### B.1 — GitHub repo შექმნა და კოდის push

1. GitHub-ში: New repository → name: `etapebi` → private (ან public, არ ცვლის CMS-ის მუშაობას) → არ შექმნა README/`.gitignore` (უკვე გვაქვს ლოკალურად).
2. ლოკალური git init:
   ```bash
   git init
   git add .
   git commit -m "initial: etapebi.com Phase 1–5"
   git branch -M main
   git remote add origin git@github.com:YOUR-USERNAME/etapebi.git
   git push -u origin main
   ```
3. **`public/admin/config.yml`-ში `repo: YOUR-USERNAME/etapebi`** ჩაანაცვლე ფაქტობრივი username-ით → commit + push.

ვერიფიკაცია: GitHub-ზე ხედავ ფაილებს, `main` branch ცოცხალია.

### B.2 — GitHub OAuth App (Decap-ის auth-ისთვის)

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
2. შეავსე:
   - Application name: `etapebi CMS`
   - Homepage URL: `https://etapebi.com`
   - Authorization callback URL: `https://etapebi.com/oauth/callback`
3. Register application.
4. **Client ID** და **Generate new client secret** → ორივე დააკოპირე უსაფრთხოდ. Secret მხოლოდ ერთხელ ჩანს.

ვერიფიკაცია: გაქვს Client ID + Client Secret დროებით უსაფრთხო ადგილას.

### B.3 — Cloudflare Pages-ის დაკავშირება GitHub repo-სთან

1. Cloudflare dashboard → Workers & Pages → Create application → Pages → Connect to Git → აირჩიე `etapebi` repo.
2. Build configuration:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: (ცარიელი)
   - Node version: `20` (Environment variables-ში: `NODE_VERSION=20`)
3. Environment variables (Production + Preview ორივე):

   | Key | Value |
   |---|---|
   | `GITHUB_CLIENT_ID` | (B.2-დან) |
   | `GITHUB_CLIENT_SECRET` | (B.2-დან) |
   | `TURNSTILE_SECRET` | (B.6-დან, შემდეგ მოვალთ უკან) |
   | `PUBLIC_TURNSTILE_SITE_KEY` | (B.6-დან) |
   | `RESEND_API_KEY` | (B.9-დან) |
   | `MAIL_TO_ADDRESS` | giorgi-ს ფაქტობრივი ემაილი |
   | `MAIL_FROM_ADDRESS` | `info@etapebi.com` |

4. Save and Deploy. პირველი deploy ~3-5 წუთი.

ვერიფიკაცია: deploy წარმატებით, ხელმისაწვდომია temporary URL-ზე (`<project>.pages.dev`).

### B.4 — DNS კონფიგი etapebi.com

1. Cloudflare-ში: Add a Site → `etapebi.com` → Free plan.
2. Domain registrar-ზე nameservers ცვლილება Cloudflare-ის nameservers-ად. Propagation 5-30 წუთი.
3. Cloudflare Pages → თქვენი project → Custom domains → Set up a custom domain → `etapebi.com` → Activate.
4. დაამატე `www.etapebi.com` redirect-ით → root.
5. SSL/TLS settings → encryption mode: **Full (strict)**.
6. Always Use HTTPS: **On**.

ვერიფიკაცია: <https://etapebi.com> ხსნის საიტს, valid HTTPS cert, www-დან redirect-ი მუშაობს.

### B.5 — Cloudflare Access /admin/* დაცვა

1. Cloudflare Zero Trust dashboard → Access → Applications → Add an application → **Self-hosted**.
2. Application configuration:
   - Application name: `etapebi CMS`
   - Session duration: `24 hours`
   - Application domain: `etapebi.com` + path: `/admin/*`
3. Add policy → Include → **Emails** → giorgi-ს ემაილი.
4. Identity providers: **One-time PIN** (Email OTP) ჩართე (Settings → Authentication → Login methods).
5. Save.

ვერიფიკაცია: `https://etapebi.com/admin/` ხსნის Cloudflare-ის Email OTP ფანჯარას — ემაილი ჩამოვა, კოდი შეიყვანე, შემდეგ Decap UI იხსნება.

### B.6 — Cloudflare Turnstile (spam-დაცვა)

1. Cloudflare dashboard → Turnstile → Add site.
2. Configuration:
   - Domain: `etapebi.com`
   - Widget mode: **Managed** (default)
3. Site Key + Secret Key — ორივე დააკოპირე.
4. Pages env vars (B.3):
   - `PUBLIC_TURNSTILE_SITE_KEY` = Site Key
   - `TURNSTILE_SECRET` = Secret Key
5. Pages → Deployments → Retry deployment (env vars-ის გამოსაყენებლად).

ვერიფიკაცია: <https://etapebi.com/contact> — ფორმის ქვემოთ Turnstile widget-ი ხილვადია.

### B.7 — Cloudflare Email Routing

1. Cloudflare → Email → Email Routing → Get started.
2. DNS records ავტომატურად დაემატება (MX + TXT) — Confirm.
3. Custom addresses → Create address → `info@etapebi.com` → Action: **Send to an email** → giorgi-ს Gmail.
4. Verify destination (giorgi-ს Gmail-ზე ვერიფიკაცია) → Confirm.

ვერიფიკაცია: გაგზავნე test ემაილი `info@etapebi.com`-ზე → ჩამოვა giorgi-ს Gmail-ზე ~30 წამში.

### B.8 — Google Search Console

1. <https://search.google.com/search-console/welcome> → Add property → Domain: `etapebi.com`.
2. DNS verification: Cloudflare-ში დაამატე TXT record (Search Console-ის მოცემული) → Verify.
3. Sitemaps → Add a new sitemap → `sitemap-index.xml` → Submit.
4. International Targeting → Country: **Georgia** (small ranking signal).

ვერიფიკაცია: Sitemap status: **Success**, 1-3 დღეში დაიწყება გვერდების indexing.

### B.9 — Resend ემაილ-domain ვერიფიკაცია

1. <https://resend.com> → Sign up → API Keys → Create API Key (full access) → დააკოპირე.
2. Domains → Add Domain → `etapebi.com` → Region: **eu-west-1** (Europe-სთან ახლოს).
3. DNS records (Resend dashboard აჩვენებს ზუსტ ჩანაწერებს): Cloudflare-ში დაამატე:
   - SPF: `TXT @ "v=spf1 include:_spf.resend.com ~all"` (თუ უკვე გაქვს SPF, შეუთავსე — ერთი TXT @ ჩანაწერი მაქსიმუმ)
   - DKIM: `TXT resend._domainkey` (Resend მისცემს ღირებულებას)
4. Resend dashboard-ში → Verify → ⏳ DNS propagation (5-15 წუთი).
5. Pages env: `RESEND_API_KEY` = (1-ში დაკოპირებული).
6. Pages → Retry deployment.

ვერიფიკაცია: ფორმა submit (ვერიფიკაცია C.6) → ემაილი ჩამოვა Gmail-ზე From: `info@etapebi.com`-ით.

---

## Production verification checklist

Deploy-ის შემდეგ გაიარე ეს 11 წერტილი ცოცხალ საიტზე. ერთიც წარუმატებელი — production-ready ჯერ არ არის.

1. **HTTPS + cert:** <https://etapebi.com> იხსნება, ბრაუზერი valid certificate-ს აჩვენებს, www-დან redirect-ი მუშაობს.
2. **5 ძირითადი გვერდი რენდერდება:** `/`, `/services`, `/projects`, `/about`, `/contact` — ყველა 200, კონტენტი ქართულად, h1 უნიკალური.
3. **პროექტის დეტალური გვერდი:** `/projects/khashuri-saakadze-133` (ან სხვა არსებული slug) — სრული frontmatter რენდერდება, breadcrumb მუშაობს.
4. **CMS access flow:** `/admin/` ხსნის Cloudflare Access-ის Email OTP ფანჯარას → ემაილი ჩამოვა → კოდი → Decap UI → projects collection → ერთ პროექტში მცირე ცვლილება (e.g. description-ის ერთი სიტყვა) → **Publish** → GitHub-ზე commit გამოჩნდება.
5. **Auto-rebuild:** Cloudflare Pages → Deployments → ახალი build (Decap-ის commit-ის შემდეგ) → წარმატებით → ცვლილება ცოცხალ საიტზე ~2-3 წუთში.
6. **Form submit (success path):** `/contact` → ფორმის შევსება (name, message, ერთი contact method, Turnstile pass) → Submit → URL `/contact?sent=1` → success ბანერი → giorgi-ს Gmail-ზე ემაილი ჩამოვა ~30 წამში.
7. **Form submit (Turnstile fail):** ფორმა გაგზავნე Turnstile-ის გარეშე (Inspect → ხელით დააფიქსირე token-ი ცარიელად) → URL `/contact?error=turnstile` → error ბანერი ჩანს, ემაილი არ მოვიდა.
8. **Form submit (validation fail):** ცარიელი name → submit → ვერ ხდება (browser HTML5 validation დაიჭერს), ან server-side `?error=name` → error ბანერი.
9. **Lighthouse:** Chrome DevTools → Lighthouse → Mobile + Desktop:
   - Performance ≥ 95
   - Accessibility = 100
   - Best Practices ≥ 95
   - SEO = 100
10. **robots.txt:** <https://etapebi.com/robots.txt> → `Disallow: /admin/` ხილული.
11. **sitemap.xml:** <https://etapebi.com/sitemap-index.xml> → `/sitemap-0.xml` → ყველა საჯარო გვერდი ჩამონათვალში, `/admin/*` არ არის. Search Console-ში status: **Success** (1-2 დღეში).

---

## Maintenance

### კონტენტის განახლება

1. გახსენი <https://etapebi.com/admin/> → Email OTP-ით შესვლა → projects collection.
2. ცვლილება (ახალი პროექტი, სურათი, ეტაპი) → Save → Publish.
3. GitHub-ზე ავტომატური commit, Cloudflare Pages auto-rebuild ~2-3 წუთში.

### Secret-ების როტაცია

1. ცვლილება Cloudflare Pages → Settings → Environment variables.
2. Save.
3. Deployments → Retry deployment (env vars production-ში მხოლოდ ახალი deploy-ის შემდეგ აქტიურდება).

### Domain-ის ცვლილება

თუ etapebi.com შეიცვალა:
- `astro.config.mjs:7` (`site:`)
- `public/admin/config.yml` (`base_url:`)
- `public/robots.txt` (Sitemap URL)
- BaseLayout-ში JSON-LD `url`
- GitHub OAuth App callback URL (B.2)
- Resend domain ვერიფიკაცია (B.9)
- Cloudflare Access policy domain (B.5)

### პროექტის ანონიმიზაცია

საიტზე მესაკუთრის ვინაობა **არ უნდა იკვეთებოდეს**. ახალი პროექტის დამატებისას (კოდით ან Decap-ით):

- **სახელი და გვარი არ ჩაიწეროს** — არც `title`-ში, არც `description`-ში, არც სხვა ველში.
- **მისამართი ბოლომდე არ ჩაიწეროს** — მხოლოდ ქალაქი/მუნიციპალიტეტი/სოფელი და ქუჩა. სახლის ან ნაკვეთის ნომერი არ მიეთითოს.
- `title`-ის ფორმატი: „[ობიექტის ტიპი] — ხაშური, [ქუჩა ან სოფელი]" — ნომრის გარეშე.
- პირადი ინფორმაცია (telephone, მესაკუთრის სახელი, პირადი ნომერი) — არასოდეს content collection-ში.

წყარო-მასალები (ნებართვები, ოქმები, ფოტოები) ცხოვრობს ცალკე, საიტის რეპოზიტორიის გარეთ — იხ. იქაური `README.md`.

---

## სრული ბრიფი

დეტალური ბრენდი, არქიტექტურული გადაწყვეტილებები და ფაზობრივი გეგმა იხილე [`CLAUDE.md`](CLAUDE.md)-ში.
