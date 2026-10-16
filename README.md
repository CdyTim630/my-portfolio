# Ding-Yuan Chen — Personal Website & Engineering Portfolio

A personal website and a dedicated engineering portfolio for an NTU Information Management undergraduate pursuing backend, data engineering, and applied AI internships. The original personal homepage remains at `/`; the engineering showcase lives at `/portfolio`. Case studies show the problem, personal contribution, architecture, trade-offs, and source evidence. Both experiences share the existing Supabase writing and administration features.

- Website: [cdytim.vercel.app](https://cdytim.vercel.app)
- Engineering portfolio: [cdytim.vercel.app/portfolio](https://cdytim.vercel.app/portfolio)
- Source: [CdyTim630/my-portfolio](https://github.com/CdyTim630/my-portfolio)
- Contact: [b13705020@ntu.edu.tw](mailto:b13705020@ntu.edu.tw)

## Local development

Use **Node.js 24.15 or newer in the 24.x release line**. `.nvmrc` selects Node 24; npm and the committed lockfile are the supported installation path.

```bash
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000> for the personal website or <http://localhost:3000/portfolio> for the engineering portfolio. The personal homepage's **View portfolio** link opens the showcase, and **Personal website** returns to `/`. Supabase is optional: both landing pages and case studies work without it, writing shows an unavailable state, the original resume link remains available, and administration fails closed. Missing CMS data is never replaced with invented articles or experiences.

## Included features

- The original personal homepage at `/`, retaining its greeting, portrait, personal sections, visual style, and theme control.
- A concise English/Traditional Chinese engineering landing page at `/portfolio` with selected work, résumé and contact links, purple/blue accents, and rounded project cards.
- `/projects` with project domain filters and a categorized, searchable bilingual archive. Native **Details** disclosures show summaries, contributions, technologies and sources. Every work has a `/projects/[slug]` detail page with editable sections, references, responsive architecture diagrams, and optional screenshots/video; eight projects have ten-section narratives; all other entries now have six-section explanations.
- Independent personal-site and portfolio theme preferences with **Light**, **Dark**, and **Color** modes, scoped styles, keyboard-accessible mobile navigation, reduced-motion support, and essential content readable without JavaScript.
- Existing blog, comments, private diary editor, post/category/experience administration, resume settings, and analytics, plus a bilingual Project Studio with independent drafts and published versions.
- Metadata, canonical links, social previews, structured data, sitemap, robots rules, and optimized local images.
- Typed request validation, trusted administrator authorization, failure states, automated tests, GitHub Actions, and a standalone Docker build.

The curated catalog contains **20 distinct works with detailed bilingual pages, including 8 full case studies and a 17-entry categorized archive**. Five archive projects—SIGmile, ToMyBaby, Algorithm Visualizer, the Jenkins delivery pipeline and NTU Water Risk Map—also have complete cases. All six homepage highlights link to dedicated ten-section articles. Source status and personal contributions are explicit. The read-only review covered 34 accessible repositories.

The compact **文 A** button switches between English and Traditional Chinese on `/portfolio`, `/projects`, and project pages. The portfolio interface, all 20 detailed project pages, and the secondary project archive support both languages. Explicit `?lang=en` or `?lang=zh-TW` links take precedence over the saved `portfolio-locale` cookie, so links are shareable and language selection works without JavaScript. The personal website, Blog, existing CMS entries, and administrator content retain their original wording.

For a local project editor without Supabase, enable the development workspace in `.env.local` and run `npm run dev:local`. `/login` provides **進入本機後台**; drafts and local publications persist in the ignored `.local-data/projects.json`. Production builds keep this workspace disabled. Setup and storage details are in [作品工作室](docs/PROJECT_STUDIO.md#本機試用).

Nine actual UI captures across seven projects provide local image covers and expandable screenshots, with bilingual provenance captions. Report-backed projects include a direct report link; the water map links its final report and presentation. See [project content and capture notes](docs/PROJECT_NARRATIVES.md). Published CMS edits continue to take precedence over the built-in starting content.

Archivo headings and Space Grotesk body text are served locally. The portfolio's typography, gradients, and project visuals have their own CSS scope; the original personal homepage and Blog retain their presentation.

## Stack and source map

Next.js **16.4.0** (App Router), React **19.2.3**, strict TypeScript, Tailwind CSS **4**, and Supabase. Tests use Vitest, React Testing Library, and Playwright. No second UI framework or content database was introduced.

```text
app/                     Public/admin pages and HTTP route handlers
app/portfolio/           Dedicated engineering landing page
components/personal/     Original personal homepage, navigation, and theme scope
components/portfolio/    Cards, filters, diagrams, shared presentation
lib/projects.ts          Typed case studies and source evidence
lib/project-translations.ts  Complete Traditional Chinese case-study narratives
lib/featured-*-cases.ts  Four promoted bilingual cases, included in the central registry
lib/project-archive.ts    Additional projects with bilingual summaries
lib/archive-project-narratives.ts  Detailed bilingual archive explanations
lib/water-map-case.ts     Report-backed campus water-map case
lib/project-media.ts      Actual UI captures and bilingual provenance captions
lib/project-collections.ts  Primary archive categories and concise bilingual teasers
lib/portfolio-locale*.ts  Portfolio URL helpers and server locale resolution
lib/public-content.ts    Anonymous published-content queries and fallbacks
lib/admin-auth.ts        Verified administrator sessions
lib/validation.ts        Input allowlists, limits, IDs, URLs, upload checks
lib/supabase/            Browser, server, anonymous clients and config
tests/                   Unit/component/content tests and browser journeys
docs/                    Audit, evidence, content, architecture, security
```

## Environment and existing Supabase

| Variable | Purpose | Required |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Existing Supabase project's URL | CMS/auth only |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon or publishable key | CMS/auth only |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin; defaults to `https://cdytim.vercel.app` | Recommended |
| `CRON_SECRET` | Server-only keepalive bearer secret | To enable cron |

Never use a service-role/secret key in a `NEXT_PUBLIC_*` variable. Public values are embedded at build time; changing them requires a rebuild. No service-role key is needed by this application.

**Before deploying administrator features, follow [SECURITY.md](docs/SECURITY.md).** Access requires the verified user's trusted `app_metadata.portfolio_admin` to be boolean `true`. Set this claim for the existing owner through a trusted Supabase administration workflow. Ordinary registered accounts are denied. Disable public signups and configure each origin's `/auth/callback` redirect URL.

`supabase-security-hardening.sql` is a migration proposal, **not an applied production migration**. It preserves rows and adds restrictive RLS policies. Inspect deployed policies, establish the owner's claim, and test it in staging before applying it. Do not rerun historical setup scripts to recreate a live database.

Private diary rows currently use images in the **public** `blog-images` bucket; those URLs are publicly fetchable. Anonymous comments/analytics may need gateway-level abuse controls. These existing limits and a staging test matrix are documented in [SECURITY.md](docs/SECURITY.md).

## Checks and tests

```bash
npm run lint
npm run typecheck
npm test
npm run build
# All four:
npm run check
```

Run the built standalone server locally with `npm run start:standalone`. It prepares the public/static assets using the same layout as the Docker image. Override its bind address with `PORT=3100 HOSTNAME=127.0.0.1 npm run start:standalone` when needed. The conventional `npm start` script is retained, but standalone output should use the dedicated launcher.

Browser smoke tests use a production build **without Supabase configuration**, so they do not query or mutate production data. If a previous build used real credentials, explicitly rebuild for this baseline:

```bash
npx playwright install chromium
NEXT_PUBLIC_SUPABASE_URL= NEXT_PUBLIC_SUPABASE_ANON_KEY= npm run build
npm run test:e2e
```

Playwright starts an isolated server at `127.0.0.1:3100`; keep that port free. It does not stop the development server on port 3000. The suite covers 360px, 390px, 768px, and 1440px widths, personal-site → portfolio → personal-site navigation, independent theme/style state, complete bilingual case studies, archive category counts and scoped search, disclosure content/source links, language persistence and explicit URL precedence, keyboard navigation, loaded-font overflow, all 20 works readable without JavaScript, metadata, CMS outage states, and safe API failures. Screenshots/traces are in ignored `test-results/` and `playwright-report/` folders.

Unit/component tests exercise input boundaries, mass-assignment prevention, trusted admin claims, public credential handling, CMS fallbacks, the shared Markdown renderer's XSS defense, case-study integrity, filters, navigation, and theme persistence. Async Server Components are verified through browser journeys, following [Next.js testing guidance](https://nextjs.org/docs/app/guides/testing/vitest).

Tests without credentials do not verify deployed RLS, email delivery, authenticated uploads, or production Core Web Vitals. See [VERIFICATION.md](docs/VERIFICATION.md) for actual results and [SECURITY.md](docs/SECURITY.md) for staging checks.

Local mobile Lighthouse runs after the collection redesign, before the subsequent Chinese copy polish and featured-project expansion, scored 93 Performance for `/portfolio?lang=zh-TW` and 91 for `/projects?lang=en`, with 100 Accessibility/Best Practices/SEO on both pages. These are single local lab measurements, not production field performance. Screenshots, timestamps and limitations are recorded in [VERIFICATION.md](docs/VERIFICATION.md).

## CI and Vercel

`.github/workflows/ci.yml` runs on pull requests, pushes to `main`, and manual dispatch. It installs the lockfile, runs lint/typecheck/unit tests/build, then Chromium smoke tests without production secrets. Browser reports are retained for seven days.

Keep Vercel's Next.js preset, select Node.js 24, set the environment above, and build with `npm run build`. Standalone output also supports Docker without replacing Vercel's adapter. This work does not automatically deploy or overwrite the remote branch.

The existing cron remains `0 3 * * *`: **03:00 UTC / 11:00 Asia/Taipei**. Set `CRON_SECRET` so Vercel supplies its bearer token. Three small published-post reads generate activity. Missing config returns `503`, wrong authentication `401`, and database failure `502`. This cannot resume a paused project and does not guarantee free-plan availability.

## Docker

The multistage Dockerfile installs from the lockfile, builds standalone output, and runs as an unprivileged user. `.dockerignore` excludes credentials, repository metadata, dependencies, and test artifacts.

```bash
# Public portfolio, no database:
docker build -t portfolio .
docker run --rm --name portfolio -p 3000:3000 portfolio
```

To enable the existing CMS, provide its **public** values at build time and the same values in the runtime environment file; keep the server-only cron secret in the latter:

```bash
docker build -t portfolio \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY \
  --build-arg NEXT_PUBLIC_SITE_URL=https://your-domain.example .
docker run --rm --name portfolio -p 3000:3000 --env-file .env.local portfolio
```

Rebuild after changing public environment values. The container listens on `0.0.0.0:3000` and has a `/projects` health check. Docker does not run Vercel cron schedules; configure an authenticated scheduler with your host if needed. Docker CLI was unavailable during implementation, so a container build/run remains an operator verification step.

## Maintaining content

The existing admin now includes **作品工作室** at `/admin/projects`: edit all 20 existing works or add a new one, with bilingual copy, sections, diagrams, media, placement, draft preview, and separate publish/unpublish actions. Apply `supabase-projects.sql` to the existing Supabase project to enable durable storage. See [Project Studio setup and publishing](docs/PROJECT_STUDIO.md). Public pages use published snapshots; saving a draft does not overwrite the current public version.

Read [CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) before adding a case study. Keep individual contributions separate from team implementation, cite source evidence, and include only real media and verified links. Run `npm test` before publishing.

- [Architecture and real API contracts](docs/ARCHITECTURE.md)
- [Original repository audit](docs/PORTFOLIO_AUDIT.md)
- [Project research and evidence gaps](docs/PROJECT_INVENTORY.md)
- [Content guide](docs/CONTENT_GUIDE.md)
- [Security and deployment](docs/SECURITY.md)
- [Verification results](docs/VERIFICATION.md)

## Dependency security

The original Next.js 16.1.4 had critical/high advisories. Next.js and its ESLint configuration were upgraded together to 16.4.0, followed by compatible transitive fixes without forced major changes. See the [Next.js image-optimization advisory](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4).

On 2026-10-10, `npm audit` still reports seven entries: five high in the build/lint `braces → micromatch → fast-glob → eslint-config-next` chain and two moderate in the typography CSS parser chain. These paths process build inputs rather than an exposed application API; this scope assessment does not mean the findings are fixed. Compatible upstream fixes remain pending. Do not use `npm audit fix --force`: it suggests an incompatible Next.js-14 ESLint downgrade. Track the [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) and [selector-parser advisory](https://github.com/advisories/GHSA-rj75-hqrm-r3gf).
