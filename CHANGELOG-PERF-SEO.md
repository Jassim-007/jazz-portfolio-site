# Jazz portfolio — performance and SEO work

## What changed

- Added Vercel rewrites and route-specific static HTML for `/my-work`, `/photography`, and `/videography`; direct visits now return the correct page instead of a Vercel 404.
- Added a branded 404 page, canonical URLs, page-specific descriptions and social metadata, a sitemap, robots rules, and Person/WebSite structured data.
- Kept a text-rich HTML page available before React starts, so crawlers and link previews can read the portfolio without waiting for client rendering.
- Fixed the hero loading poster so it remains visible until the first animation frame is ready. Added a high-priority first-frame preload and kept the highest-resolution frame set for displays that can use it.
- Reduced work in the scroll-frame renderer and deferred GSAP, ScrollTrigger, and Lenis until browser idle time or the visitor’s first interaction. The hero sequence reads native scroll progress immediately, so its first frame update does not wait for those libraries to load.
- Converted the four role-card images to WebP. Their combined file size fell from about 643 KB to about 346 KB, while the original JPEGs remain in the repository.
- Added caching and security response headers. No application dependencies were added; the dependency audit previously reported zero vulnerabilities.

## Lighthouse measurements

Lighthouse 12.8.2 against the Vercel production alias. Mobile runs use a 4× CPU slowdown. Numbers can vary between runs and describe lab conditions, not real-user field data.

| Metric | Earlier production baseline | Current production |
| --- | ---: | ---: |
| Mobile performance | 63 | 81 |
| Mobile accessibility | 94 | 100 |
| Mobile SEO | 91 | 100 |
| Mobile First Contentful Paint | 3.6 s | 3.1 s |
| Mobile Largest Contentful Paint | 11.3 s | 3.9 s |
| Mobile Total Blocking Time | 155 ms | 60 ms |
| Mobile Cumulative Layout Shift | 0.000 | 0.004 |
| Mobile transferred bytes | 2.48 MB | 0.71 MB |
| Desktop performance | 99 | 99 |
| Desktop accessibility / best practices / SEO | 94 / 100 / 91 | 100 / 100 / 100 |
| Desktop LCP / TBT | 0.73 s / 0 ms | 0.75 s / 0 ms |

The latest mobile LCP is still above the 2.5-second Core Web Vitals target in this throttled lab run. The current deployment substantially improves it, but it should not be described as fully meeting that target until real-user or repeatable field measurements confirm it.

## Production checks

- Build: `npm run build` — passed.
- GitHub commit `aa6ca6b` was pushed to `main`; Vercel production deployment reached **Ready**.
- Direct production requests for `/my-work`, `/photography`, and `/videography` returned HTTP 200 with the expected page titles and headings.
- Latest Lighthouse scores: desktop 99 / 100 / 100 / 100 and mobile 81 / 100 / 100 / 100 for performance / accessibility / best practices / SEO.
- `git diff --check` — passed before the final report was added.

## Items that need Jassim

- Choose and connect a custom domain, then update the canonical base URL in `index.html` and `scripts/build-seo.mjs`.
- Verify the site in Google Search Console and Bing Webmaster Tools and submit `/sitemap.xml` after choosing the final domain.
- Add real project demo URLs, detailed case-study outcomes, and any approved Tenco screenshots when available. The site currently describes the projects without inventing impact claims.
- Record a DevTools Performance trace while scrolling the hero and galleries on a representative phone. Lighthouse does not provide a trustworthy scroll FPS measurement here.
- Search rankings are not guaranteed by metadata or a performance score; monitor impressions and indexing after the domain is verified.
