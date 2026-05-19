# etapebi.com — Website Project Brief

> **მნიშვნელოვანი:** ეს ფაილი ცხოვრობს პროექტის root-ში როგორც `CLAUDE.md`. წაიკითხე სრულად ნებისმიერი დავალების დაწყებამდე. აქ აღწერილი ბრენდი, ფერები, ტონი, არქიტექტურული გადაწყვეტილებები **არ უნდა შეიცვალოს ნებართვის გარეშე.**

## პროექტის მიმოხილვა

ვებსაიტი დამოუკიდებელი სპეციალისტისთვის — გიორგი ლომიძე — რომელიც ეწევა მშენებლობის ეტაპების დოკუმენტურ აღრიცხვას საქართველოში. საიტის მიზანი: პოტენციურმა მესაკუთრემ ერთი ვიზიტით გაიგოს ვინ არის, რას აკეთებს, ნახოს მაგალითები და დაუკავშირდეს.

- **დომენი:** etapebi.com
- **ენა:** მხოლოდ ქართული (ინგლისური ვერსია არ გვჭირდება)
- **სამოქმედო ზონა:** ხაშური + საქართველოს მასშტაბით

## ბრენდი

- **სახელი:** გიორგი ლომიძე (პერსონალური ბრენდი — არა „etapebi" როგორც კომპანია)
- **როლი:** მშენებლობის ეტაპების სპეციალისტი
- **ტეგლაინი:** ეტაპობრივი ფოტოანგარიში · ოქმების მომზადება · დოკუმენტური აღრიცხვა

## კონტაქტები

- **ტელეფონი:** +995 593 50 20 93
- **ემაილი:** info@etapebi.com
- **ვებსაიტი:** etapebi.com

## დიზაინ-სისტემა

### ფერები (Charcoal + Warm Cream)

| როლი | ფერი | Hex |
|---|---|---|
| Background primary | Charcoal | `#161616` |
| Background secondary | Off-charcoal | `#1d1d1d` |
| Text primary | Warm cream | `#ede6d4` |
| Text secondary | Warm gray | `#9a948a` |
| Border | Warm gray subtle | `#2a2a28` |
| Text muted on light | Warm gray (dark variant) | `#5a554f` |
| Feedback — წარმატება | Muted sage | `#7a9270` |
| Feedback — შეცდომა | Muted terracotta | `#d97757` |

დიზაინი მთლიანად მუქია (charcoal background) — არა „dark mode toggle", არამედ ბრენდი თავისთავად ასეთია.

### ტიპოგრაფია

- **სტილი:** მინიმალისტური ტიპოგრაფიული
- **წონები:** მხოლოდ `400` (regular) და `500` (medium). 600 და 700 არასოდეს.
- **სათაურები:** sans-serif, ქართული ანბანის კარგი მხარდაჭერით
- **წერის სტილი:** ყოველთვის sentence case. არასოდეს ALL CAPS, არასოდეს Title Case. ეს მოქმედებს ღილაკებზე, სათაურებზე, ნავიგაციაზეც.
- **ხაზთაშორის მანძილი (line-height):** ბოდი ტექსტისთვის `1.65-1.7`, სათაურებისთვის `1.2-1.3`
- **ტრექინგი (letter-spacing):** დიდ სათაურებზე ოდნავ უარყოფითი (`-0.3px`-ის ფარგლებში)

### ფილოსოფია

- სუფთა, ფლეტი ზედაპირები. **არანაირი** გრადიენტი, აჩრდილი, ბლური, glow ეფექტი.
- გენერაცია — გაცილებით ცარიელი ვიდრე გადატვირთული. სუნთქავს.
- ვიზუალური აქცენტი — მხოლოდ ტიპოგრაფიის სიდიდით და თეთრი სივრცით.

## ტექნოლოგიური სტეკი

| კატეგორია | არჩევანი |
|---|---|
| ფრეიმვორკი | **Astro** (latest stable) |
| სტილიზაცია | **Tailwind CSS** |
| ენა | **TypeScript** (strict mode) |
| კონტენტი | **MDX** (Astro Content Collections) |
| სურათები | Astro `<Image>` კომპონენტი (ავტო WebP/AVIF + responsive) |
| CMS | **Decap CMS** (`/admin` რუთზე, git-ბექენდი) |
| Admin auth | **Cloudflare Access** (პაროლით ან ემაილ-PIN-ით) |
| ჰოსტინგი | Cloudflare Pages |
| DNS / Email Routing | Cloudflare (`info@etapebi.com` → Gmail გადამისამართება) |
| Analytics | (მოგვიანებით — Plausible ან Cloudflare Web Analytics) |

**არ ვიყენებთ:** WordPress, React/Next.js, jQuery, Bootstrap, animation libraries.

## გვერდების სტრუქტურა (5 გვერდი)

URL-ები ინგლისურად, კონტენტი ქართულად.

| URL | ქართული სახელი | მიზანი |
|---|---|---|
| `/` | მთავარი | Hero, 3 მომსახურება, 5-ეტაპიანი პროცესი, 1-2 პროექტი, კონტაქტის CTA |
| `/services` | მომსახურება | დეტალური აღწერა, „როგორ ვმუშაობ" |
| `/projects` | პროექტები | ბადე-სია; ცალკე გვერდები `/projects/[slug]`-ზე |
| `/about` | შესახებ | ვინ არის გიორგი, მიდგომა, რატომ ცალკე სპეციალისტი |
| `/contact` | კონტაქტი | ფორმა + პირდაპირი კონტაქტი + სამოქმედო ზონა |
| `/admin` | (CMS) | Decap CMS UI — Cloudflare Access-ით დაცული, არ ჩანს ნავიგაციაში |

### პროექტების ანონიმიზაცია

რეალური სახელები (იოსები, ციალა) **არ ჩანს** საიტზე. მაგალითები:
- „კომერციული ობიექტი — ხაშური, სააკაძის ქუჩა"
- „კომერციული სავაჭრო ობიექტი — ხაშური, იმერეთის ქუჩა"

## კონტენტის მართვა (CMS)

პროექტები ემატება **ორი გზით — ორივე ერთსა და იმავე git-რეპოზიტორიაში წერს**, ანუ შედეგი იდენტურია:

1. **კოდით** — ვქმნით `.mdx` ფაილს `src/content/projects/`-ში, ვამატებთ სურათებს, git push
2. **Decap CMS-ით** — `/admin` რუთზე ვებ-ფორმით (გიორგი ან მისი დელეგატი)

### Decap CMS კონფიგურაცია

- **ლოკაცია:** `public/admin/` — შეიცავს `index.html` (CMS-ის გასაშვები) და `config.yml` (schema)
- **ბექენდი:** `git-gateway` (კონტენტი ჩვეულებრივ git commit-ებად ხვდება რეპოზიტორიაში)
- **მედია ფოლდერი:** `public/uploads/projects/` (ან `src/assets/projects/` თუ Astro-ს მიერ ოპტიმიზაცია გვინდა — ეს გადაწყვიტე setup-ის დროს)
- **წვდომა:** `/admin` სრულად გადაკეტილია Cloudflare Access-ით — სანამ admin UI ჩაიტვირთება, Cloudflare-ის auth-ფანჯარა გამოჩნდება

### Cloudflare Access — წვდომის მოდელი

- **მეთოდი:** Email OTP (one-time PIN) — ემაილზე ეგზავნება დროებითი კოდი, შესვლა მხოლოდ ამ კოდით შესაძლებელია
- **მომხმარებლები:** ემაილ-allowlist (Cloudflare Access policy-ში დამატებული მისამართები)
- **წვდომის გათიშვა:** ემაილის წაშლა allowlist-დან — მომხმარებელი მაშინვე ვეღარ შედის
- **ალტერნატივა (თუ ერთი საერთო პაროლი გჭირდება):** Cloudflare Worker-ის Basic Auth `/admin`-ის წინ — environment variable-ად შენახული პაროლი, შეცვლა redeploy-ით

ორივე უფასოა Cloudflare-ის Free გეგმის ფარგლებში (50 მომხმარებლამდე Access-ისთვის).

### პროექტის Schema (Content Collection + Decap-ის ერთიანი სქემა)

თითო პროექტის ფრონტმეტერი:

```yaml
title: string                  # მაგ. "კომერციული ობიექტი — ხაშური, სააკაძის ქუჩა"
slug: string                   # URL-ისთვის (მაგ. "khashuri-saakadze-133")
location: string               # ქალაქი + ქუჩა
buildingClass: string          # მაგ. "მე-2 კლასი"
permitDate: date               # ნებართვის გაცემის თარიღი
permitValidUntil: date         # ნებართვა ძალაშია
buildingType: string           # მაგ. "კომერციული ობიექტი"
stagesCompleted: number[]      # [1] ან [1, 2] — დასრულებული ეტაპები
coverImage: image              # სათავე სურათი
gallery: image[]               # ფოტოანგარიშის სურათები
description: string            # მოკლე აღწერა (ერთი აბზაცი)
publishedAt: date              # გამოქვეყნების თარიღი
```

ცალკე პროექტის გვერდი (`/projects/[slug]`) რენდერავს ამ ველებს, gallery-ს უმატებს Astro `<Image>`-ს (ავტო-ოპტიმიზაცია).

### Decap-ის config.yml — საფუძველი

```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "public/uploads/projects"
public_folder: "/uploads/projects"

collections:
  - name: "projects"
    label: "პროექტები"
    folder: "src/content/projects"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "სათაური", name: "title", widget: "string" }
      - { label: "ლოკაცია", name: "location", widget: "string" }
      - { label: "შენობის კლასი", name: "buildingClass", widget: "string" }
      - { label: "ნებართვის თარიღი", name: "permitDate", widget: "date" }
      - { label: "ნებართვა ძალაშია", name: "permitValidUntil", widget: "date" }
      - { label: "ობიექტის ტიპი", name: "buildingType", widget: "string" }
      - { label: "დასრულებული ეტაპები", name: "stagesCompleted", widget: "list" }
      - { label: "სათავე სურათი", name: "coverImage", widget: "image" }
      - { label: "გალერეა", name: "gallery", widget: "list", field: { label: "სურათი", name: "image", widget: "image" } }
      - { label: "აღწერა", name: "description", widget: "text" }
      - { label: "ძირითადი ტექსტი", name: "body", widget: "markdown" }
```

## შინაარსის ტონი

- ფორმალური, მაგრამ მკაფიო (არა აკადემიური)
- ფაქტი > ემოცია
- პროფესიული ტერმინოლოგია: ნებართვა, ეტაპი, ოქმი, აღრიცხვა, საჯარო რეესტრი
- მოკლე წინადადებები. ცარიელი მარკეტინგული ფრაზები არ არის.

## SEO სავალდებულო

- `<html lang="ka">`
- სრული Open Graph + Twitter Card meta-ები ყოველ გვერდზე
- JSON-LD სქემა: `LocalBusiness` ან `ProfessionalService` (მისამართი, ტელეფონი, geo, ფასების დიაპაზონი თუ ექნება)
- `sitemap.xml` ავტოგენერაცია (`@astrojs/sitemap`)
- `robots.txt` — ღია, sitemap-ზე ლინკით
- ცალკე `<title>` (60 სიმბოლომდე) და `meta description` (155 სიმბოლომდე) ყოველ გვერდზე
- Open Graph გამოსახულება 1200×630, ბრენდის ფერებში
- Cloudflare Pages → ავტო HTTPS, HTTP/2, CDN

## ხელმისაწვდომობა

- WCAG 2.1 AA მინიმუმი
- ფერთა კონტრასტი: ბოდისთვის ≥4.5:1, დიდი ტექსტისთვის ≥3:1
- კლავიატურით ნავიგაცია მუშაობს ყველგან
- Focus-ის მკაფიო ვიზუალური ინდიკატორი
- Alt ტექსტი ყველა შინაარსიან სურათზე

## შეზღუდვები (არ დაარღვიო)

- არ დაამატო JavaScript ბიბლიოთეკა თუ კონკრეტული საჭიროება არ არის
- font-weight მხოლოდ 400 ან 500
- ALL CAPS ან Title Case — არასოდეს
- სურათი ყოველთვის Astro `<Image>`-ით, არასოდეს `<img>`
- ფერები ან ტიპოგრაფია არ შეცვალო ნებართვის გარეშე
- ემოჯი არ გამოიყენო UI-ში
- გრადიენტი, აჩრდილი, blur, glow — არ გამოიყენო

## საქაღალდის სტრუქტურა (მისაღწევი)

```
etapebi/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── services.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   └── projects/
│   │       ├── index.astro
│   │       └── [slug].astro
│   ├── content/
│   │   ├── config.ts             # Astro Content Collection schema (იგივე Decap-ისა)
│   │   └── projects/
│   │       └── *.mdx             # პროექტების ფაილები (კოდით ან CMS-ით ემატება)
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── BaseHead.astro
│   │   └── ProjectCard.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── styles/
│       └── global.css
├── public/
│   ├── admin/
│   │   ├── index.html            # Decap CMS UI loader
│   │   └── config.yml            # Decap schema (Astro schema-ს ემთხვევა)
│   ├── uploads/
│   │   └── projects/             # CMS-დან ატვირთული სურათები
│   ├── og-image.png
│   ├── favicon.svg
│   └── robots.txt                # /admin გამორიცხული ინდექსირებიდან
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## განვითარების ბრძანებები

```bash
npm install         # დამოკიდებულებები
npm run dev         # ლოკალური გაშვება (localhost:4321)
npm run build       # ბილდი (გენერდება dist/)
npm run preview     # ბილდის ნახვა
```

## განვითარების ფაზები

რადგან CMS ბირთვშია, წინასწარ დავყავით სამუშაო ფაზებად — Claude Code-ი ერთ ფაზას აკეთებს, შემდეგ შევამოწმებთ, შემდეგ მეორეზე გადავდივართ.

**ფაზა 1 — საფუძველი** (პირველი დღე)

- Astro init + Tailwind + TypeScript + sitemap/MDX integrations
- BaseLayout, Header, Footer
- 5 გვერდის ჩონჩხი (ცარიელი მაგრამ რენდერდები)
- ბრენდის ფერები + ტიპოგრაფია global stylesheet-ში
- robots.txt, sitemap.xml ავტოგენერაცია

**ფაზა 2 — კონტენტის სტრუქტურა** (პირველი დღე)

- `src/content/config.ts` — projects collection-ის schema
- `/projects` — ბადე-სია
- `/projects/[slug]` — ცალკე პროექტის გვერდი (gallery, ეტაპები, ფრონტმეტერი)
- Astro `<Image>` ოპტიმიზაცია gallery-ზე

**ფაზა 3 — CMS UI** (მეორე დღე)

- `public/admin/index.html` + `config.yml` (Decap CMS)
- Schema სრულად ემთხვევა `src/content/config.ts`-ს
- ლოკალური ტესტი `npm run dev`-ით — `/admin` უნდა გაიხსნას, ფორმა მუშაობდეს

**ფაზა 4 — გვერდების კონტენტი** (მეორე დღე)

- მთავარი (Hero, services, process, projects preview, CTA)
- /services დეტალური აღწერა
- /about ტექსტი
- /contact ფორმა (Cloudflare Pages Functions backend)

**ფაზა 5 — დეპლოი + წვდომის დაცვა**

- GitHub repo დაკავშირება Cloudflare Pages-თან
- DNS კონფიგი `etapebi.com`-ისთვის
- Cloudflare Access-ის policy `/admin` გზაზე (Email OTP, allowlist)
- Cloudflare Email Routing — `info@etapebi.com` → Gmail
- Production ტესტი

## მომავალი (არ ვაშენებთ ახლა)

- ბლოგი / სიახლეები (SEO გაფართოება)
- სტრუქტურირებული მონაცემების ფართო მარკაპი (FAQ, HowTo)
- ინგლისური ვერსია (თუ საერთაშორისო კლიენტები გამოიჩნდება)
- Analytics (Plausible ან Cloudflare Web Analytics)
