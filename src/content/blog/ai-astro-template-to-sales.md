---
slug: ai-astro-template-to-sales
title: AI Built Your Astro Site From a Template. Now Make It Sell.
description: Your AI-generated Astro site looks great but brings in zero leads. Here's the exact SEO checklist to fix that — sitemaps, content collections, GA4, Search Console, structured data, and the monthly habits that turn a template into a business.
author: Bryson M
pubDate: 2026-05-31
keywords:
  - SEO
  - Astro
  - Sitemap
  - Content Collections
  - Google Analytics
  - Google Search Console
  - Structured Data
image: src/content/images/astro-seo-checklist-linegraph.webp
---

My friend just launched his own river rafting website from an Astro template. It looks great — hero images of white water, booking CTAs, trip photos. But the day after launch, he asked the question every new site owner asks: _"How do I actually get people to find this thing?"_

I pulled up my own site and walked him through everything I've done on [smiling.dev](https://smiling.dev). By the end of the call, we had a checklist. Here it is — written so anyone with an Astro site can run through it in an afternoon and come out the other side with a site that Google actually knows about.

---

## 1. Sitemap — Tell Google What Pages Exist

If Google doesn't know a page exists, it won't rank it. The `@astrojs/sitemap` integration generates an XML sitemap automatically at build time.

```bash
pnpm add @astrojs/sitemap
```

In `astro.config.mjs`:

```js
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://your-site.com",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/private/"),
    }),
  ],
});
```

The `site` field is mandatory — the sitemap needs absolute URLs. `filter` lets you exclude pages (drafts, admin routes, private proposals).

**Verify**: visit `yoursite.com/sitemap-index.xml`. If it returns XML, you're done.

**Docs**: [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)

---

## 2. RSS Feed — Let Aggregators Find You

RSS feeds let blog aggregators, newsletter platforms, and RSS readers discover new content automatically. For SEO, it's another signal to crawlers that your site is actively publishing.

```bash
pnpm add @astrojs/rss
```

Create `src/pages/rss.xml.ts`:

```ts
import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";

export const prerender = true;

export async function GET(context: APIContext) {
  const blog = await getCollection("blog");
  const experiences = await getCollection("experiences");

  const items = [...blog, ...experiences].map((entry) => ({
    title: entry.data.title,
    description: entry.data.description,
    pubDate: entry.data.pubDate,
    link: new URL(`/${entry.collection}/${entry.data.slug}`, context.site).href,
  }));

  return rss({
    title: "Your Rafting Site — RSS Feed",
    description: "Latest blog posts and rafting experiences",
    site: context.site || "https://your-site.com",
    items,
    customData: `<language>en-us</language>`,
  });
}
```

**Verify**: visit `yoursite.com/rss.xml`.

**Docs**: [@astrojs/rss](https://docs.astro.build/en/guides/rss/)

---

## 3. Content Collections — Blogs + Experiences

This is where the actual content lives. Define collections for blog posts and for the experiences/trips you sell. Each `.md` file becomes an indexed page.

```bash
mkdir -p src/content/blog src/content/experiences src/content/images
```

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      slug: z.string().regex(/^[a-z0-9-]+$/),
      title: z.string(),
      description: z.string(),
      author: z.string(),
      pubDate: z.date(),
      updateDate: z.date().optional(),
      keywords: z.array(z.string()),
      image: image(),
      draft: z.boolean().default(false),
    }),
});

const experiences = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/experiences" }),
  schema: ({ image }) =>
    z.object({
      slug: z.string().regex(/^[a-z0-9-]+$/),
      title: z.string(),
      description: z.string(),
      pubDate: z.date(),
      keywords: z.array(z.string()),
      image: image(),
      price: z.string().optional(),
      duration: z.string().optional(),
      difficulty: z.enum(["Easy", "Moderate", "Hard", "Extreme"]).optional(),
      location: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog, experiences };
```

**Example experience `.md`** (`src/content/experiences/family-half-day.md`):

```md
---
slug: family-half-day
title: Family Half-Day Float
description: A gentle 3-hour trip perfect for kids 6 and up. Calm water, big scenery.
pubDate: 2026-05-01
image: src/content/images/family-float.jpg
keywords:
  - family rafting
  - beginner
  - half day
price: "$65/person"
duration: "3 hours"
difficulty: Easy
location: "Buena Vista, CO"
---

Scenic float through Browns Canyon. No experience needed...
```

**Docs**: [Content Collections](https://docs.astro.build/en/guides/content-collections/)

---

## 4. Automate Monthly Blogging

Consistency is the biggest SEO lever after technical setup. One blog post per month compounds over time.

**Each post should have:**

- A relevant hero image from `src/content/images/`
- Keywords people actually search for ("family rafting in Colorado", "beginner white water rafting", "best river trips near Denver")
- Links to your social accounts
- Corresponding social media posts that link back to the blog URL

Set a calendar reminder for the first of every month. Write the `.md` file, commit, deploy. That's one new indexed page every 30 days.

---

## 5. Google Search Console — Get Indexed

This is how Google knows you exist.

1. Go to [Google Search Console](https://search.google.com/search-console/about)
2. Add your domain (choose the "Domain" option)
3. Verify ownership by adding the DNS TXT record they give you to your domain registrar (Cloudflare, Namecheap, GoDaddy, etc.)
4. Once verified, submit your sitemap: `yoursite.com/sitemap-index.xml`

After 2-3 months of data, check **Search Console → Performance** to see exactly what search queries people are using to find you. Write blog posts targeting those queries.

**Docs**: [Search Console Help](https://support.google.com/webmasters/answer/9008080)

---

## 6. Google Analytics (GA4) — Know Your Traffic

Understanding where leads come from tells you what's working.

1. Go to [analytics.google.com](https://analytics.google.com)
2. Create account → create property → choose "Web"
3. Copy your Measurement ID (looks like `G-XXXXXXXXXX`)
4. Paste into your `Layout.astro` `<head>`:

```html
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>
```

Optional: use `@astrojs/partytown` to offload GA4 to a web worker so it doesn't block page rendering.

**Docs**: [GA4 Setup](https://support.google.com/analytics/answer/9304153)

---

## 7. robots.txt — Crawler Instructions

Tell crawlers what to index and where your sitemap lives.

`public/robots.txt`:

```
User-agent: *
Allow: /

Disallow: /private/

Sitemap: https://your-site.com/sitemap-index.xml
Sitemap: https://your-site.com/sitemap.md
```

---

## 8. SEO Head Component — Meta Tags That Make Links Look Good

When someone shares your link on Facebook, Twitter, or Slack, the preview image and description come from Open Graph and Twitter Card meta tags.

Create `src/components/Head.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: string;
  type?: "website" | "article";
}

const {
  title,
  description,
  image = "/default-og-image.jpg",
  canonicalUrl = Astro.url.href,
  type = "website",
} = Astro.props;

const siteTitle = title.includes("Your Site")
  ? title
  : `${title} — Your Rafting Site`;
---

<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<link rel="icon" type="image/png" href="/favicon.png" />

<title>{siteTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalUrl} />

<!-- Open Graph / Facebook -->
<meta property="og:type" content={type} />
<meta property="og:url" content={canonicalUrl} />
<meta property="og:title" content={siteTitle} />
<meta property="og:description" content={description} />
<meta property="og:image" content={new URL(image, Astro.url)} />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content={canonicalUrl} />
<meta property="twitter:title" content={siteTitle} />
<meta property="twitter:description" content={description} />
<meta property="twitter:image" content={new URL(image, Astro.url)} />

<!-- RSS & Sitemap -->
<link
  rel="alternate"
  type="application/rss+xml"
  title="RSS Feed"
  href="/rss.xml"
/>
<link rel="sitemap" href="/sitemap-index.xml" />

<!-- LLM/Agent Discovery -->
<link
  rel="alternate"
  type="text/markdown"
  title="Curated content for AI agents"
  href="/llms.txt"
/>
<link
  rel="alternate"
  type="text/markdown"
  title="Complete content with full articles"
  href="/llms-full.txt"
/>
<link
  rel="alternate"
  type="text/markdown"
  title="Sitemap in markdown format"
  href="/sitemap.md"
/>
```

Use it in `Layout.astro`:

```astro
<Head title="Page Title" description="Page description" image="/hero.jpg" />
```

Test with the [Open Graph Debugger](https://www.opengraph.xyz).

---

## 9. JSON-LD Structured Data — Rich Results in Google

Structured data helps Google show rich results — star ratings, location, prices, hours. For a rafting company, use `TouristAttraction`.

Create `src/components/JsonLd.astro`:

```astro
---
interface Props {
  data: Record<string, any>;
}
const { data } = Astro.props;
---

<script type="application/ld+json" set:html={JSON.stringify(data)} />
```

Add to `Layout.astro`:

```astro
<JsonLd
  data={{
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Your Rafting Company",
    url: "https://your-site.com",
    description: "Guided white water rafting trips in Colorado",
    sameAs: ["https://facebook.com/yourpage", "https://instagram.com/yourpage"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Your City",
      addressRegion: "CO",
      addressCountry: "US",
    },
  }}
/>
```

Test with [Google Rich Results Test](https://search.google.com/test/rich-results).

**Docs**: [schema.org/TouristAttraction](https://schema.org/TouristAttraction)

---

## 10. sitemap.md + llms.txt + llms-full.txt — AI Agent Discovery

These three endpoints help both search crawlers and AI agents discover your content. They're plain text, always up-to-date, and cost nothing to add.

- `sitemap.md` — human-readable listing of every page
- `llms.txt` — curated summary (titles + descriptions, 8-10 items max) for AI agents that want a quick overview
- `llms-full.txt` — full body content of every post for deep context

Each is a single Astro API route. Create them in `src/pages/`:

**`src/pages/sitemap.md.ts`** — iterate `getCollection()` and list every page with links.

**`src/pages/llms.txt.ts`** — slice the first 8 items from each collection, show title + description + keywords.

**`src/pages/llms-full.txt.ts`** — dump every post's full body content with metadata headers.

These are also linked in your `Head.astro` component so crawlers discover them automatically.

---

## 11. Social Media — Post Consistently, Always Link Back

The #1 free SEO lever is external links pointing to your site. Every social post is a backlink.

- **Facebook Business Page**: Trip photos, testimonials, blog post links
- **Instagram**: Reels of rapids, gear reviews, behind-the-scenes. Website link in bio.
- **LinkedIn**: Corporate outings, team building packages
- **Google Business Profile**: This is critical for local SEO. Claim it, add photos, hours, booking links. [business.google.com](https://business.google.com)

**Rule**: every social post includes a link to `yoursite.com`. Every blog post includes links to your social accounts. Consistency compounds.

---

## Priority Order

If you only have one afternoon, here's what to hit in order:

| Priority | Task                                    | Why                                               |
| -------- | --------------------------------------- | ------------------------------------------------- |
| 1        | Google Search Console + sitemap submit  | Gets Google to even know you exist                |
| 2        | GA4 analytics                           | You can't improve what you don't measure          |
| 3        | Sitemap + RSS                           | Crawler discoverability                           |
| 4        | Content collections + first blog post   | Pages to actually index and rank                  |
| 5        | Head.astro (OG/Twitter tags)            | Link previews look professional when shared       |
| 6        | JSON-LD structured data                 | Rich results in Google SERPs                      |
| 7        | Google Business Profile                 | Local SEO — this is where rafting leads come from |
| 8        | Social media accounts + monthly posting | Long-term compounding growth                      |
| 9        | llms.txt / llms-full.txt / sitemap.md   | Future-proof AI discoverability                   |
| 10       | robots.txt                              | Clean crawler instructions                        |

---

My friend ran through this list in two afternoons. His site went from zero impressions in Search Console to showing up for "river rafting near [his town]" within a week. The technical setup is table stakes — the real growth comes from showing up monthly with a new blog post and posting on social media consistently. But you can't do any of that until steps 1-7 are in place.
