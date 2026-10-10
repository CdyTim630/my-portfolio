# Portfolio audit

Audit date: 2026-10-10 (Asia/Taipei). Initial checkout: `main` at `2df1aa3`; working tree clean. Work is isolated on `feat/engineering-portfolio`. No remote push, production deployment, or database mutation is part of this change.

## Updated scope after owner review

The owner requested that the original personal homepage stay at `/` and the engineering redesign be available at `/portfolio`. The implementation now keeps both: the original greeting, portrait, personal sections and visual style remain on the root route; a **View portfolio** entry opens the engineering showcase; **Personal website** returns to the root. Project index/case studies remain `/projects` and `/projects/[slug]`. Personal CSS/theme state is isolated from the engineering UI.

The baseline findings below describe the original audit. The initial choice to replace the root homepage was superseded by this correction; evidence, project case studies, backend hardening, and engineering-quality work remain applicable to the separate portfolio.

A subsequent owner review requested a full visual redesign of the engineering section. Its current direction uses expressive purple/blue accents, rounded cards, and Archivo/Space Grotesk typography while retaining the original personal experience at `/`. Earlier design measurements are historical and do not validate this redesign.

The owner subsequently requested English/Traditional Chinese only for the engineering portfolio. The implementation now includes a scoped language switch, complete translations for all three cases, and bilingual additional project summaries. The original homepage, Blog and existing CMS wording remain unchanged.

The latest review asked for less text and complexity. The landing page and case-study cards are simplified, while the additional-work archive is organized into explicit categories with short teasers and native detail disclosures. Full contribution/evidence text remains available. The language links now use a compact control. Earlier performance reports do not validate this layout revision.

## Existing architecture

- Next.js **16.1.4**, React **19.2.3**, TypeScript **5.9.3**, Tailwind **4.1.18** (lockfile versions); App Router, strict TypeScript, npm lockfile.
- Server-rendered home and Blog read Supabase directly through `@supabase/ssr` 0.8.0 / Supabase JS 2.91.0. Client components handle filters, comments, theme, editors and admin interactions.
- `/blog`, `/blog/[id]`, `/login`, `/admin` plus post, category, experience, resume, comments, diary and analytics management are present. Diaries can be published as posts; Markdown, Spotify and image uploads are supported.
- Existing tables: posts, categories, comments, diaries, experiences, site_settings and page_views. SQL is maintained as setup files rather than a migration framework. Preserve existing rows and schemas.
- API routes: `/api/admin/posts`, `/api/admin/experiences`, `/api/admin/experiences/[id]`, `/api/admin/settings/resume`, `/api/track`, `/api/cron/supabase-keepalive`.
- Vercel daily keepalive cron: `0 3 * * *` (UTC). Existing deployment and cron remain supported.
- Existing light/color/dark theme uses CSS variables, localStorage and animated ambient backgrounds. Home is 428 lines; CSS 719 lines. Navigation, Reveal and several utilities are shared with Blog. The original personal visual direction is retained at `/`; the separate engineering direction applies to `/portfolio` and project pages.

## Baseline findings

| Area          | Finding                                                                                                     | Change                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Positioning   | Generic web-development hero, no project routes or engineering case studies                                 | Preserve the personal hero; add focused engineering positioning at `/portfolio` and project cases    |
| Content       | Local mock Blog includes unsupported career claims; legacy experience fallback includes an expected role    | Never expose those mock files as real content; keep live CMS data                                   |
| Resilience    | Missing public Supabase variables throws before rendering                                                   | Safe public readers and explicit unavailable states; static projects independent of Supabase        |
| Authorization | Signup plus broad authenticated-user RLS can give any account site editing rights; admin layout unguarded   | Trusted admin claim, server/API guards, separate reviewed RLS hardening SQL                         |
| Validation    | Broad request bodies, unchecked resume URLs, inconsistent JSON errors                                       | Bounded explicit fields and http(s) URL checks                                                      |
| Privacy       | Diary images use a public bucket                                                                            | Document existing limitation; no silent relocation/deletion of assets                               |
| XSS           | Public Markdown does not execute raw HTML; React escapes comments                                           | Preserve that behavior and test validation boundaries                                               |
| Secrets       | No service-role key found; no local env files present                                                       | No production secrets needed for build/tests                                                        |
| Accessibility | Missing menu expanded state/Escape/skip link; hidden theme buttons focusable; some content hidden before JS | Semantic navigation, native disclosure, visible keyboard focus, reduced motion, SSR-visible content |
| Performance   | Google CSS imports duplicate Next font downloads; original portrait not optimized; ornamental animations    | Self-hosted fonts, next/image portrait, reduced-motion support; restrained transitions in portfolio |
| SEO           | Basic root metadata only; no sitemap/robots/project metadata                                                | Canonicals, Open Graph, sitemap, robots, structured data                                            |
| Quality       | No tests, CI, Docker or env example; README mostly starter text                                             | Focused unit/component/content and E2E tests, CI, standalone multi-stage image, operational docs    |

## Baseline verification

- `npm run lint`: **failed**, 5 pre-existing explicit-any errors and 11 warnings.
- `npx tsc --noEmit --incremental false`: **failed** due to damaged installed type packages (`@types/* 2` directories), not yet a reliable source-code verdict. Reinstall from the lockfile before rechecking.
- No baseline tests configured. Node 24.20.0 / npm 11.19.0 available.
- Public source and deployed site inspected; GitHub project research is recorded independently in [PROJECT_INVENTORY.md](PROJECT_INVENTORY.md).

## Design and implementation decisions

1. Retain Next.js/Tailwind/Supabase. The initial design used Once UI as typography, spacing and border inspiration ([site](https://once-ui.com/), [documentation](https://docs.once-ui.com/)); owner review replaced that visual direction with a more expressive portfolio. Do not add Once UI Core: a second token/component system adds integration cost to the existing Tailwind CMS without a required capability. No package compatibility or license assumption is needed because none is installed or copied.
2. Add typed, versioned TypeScript project content. This supports source review, static routes, honest evidence and no mandatory database migration. Do not embed unverified awards, metrics or demo links.
3. Use server components for project text/cards and lightweight client interaction for filters/navigation/theme. Render architecture diagrams as semantic HTML/CSS so mobile and assistive technology can read them without a diagram runtime.
4. `/portfolio` order: positioning → projects → expertise → existing experiences → background → writing → contact. Keep the original personal homepage at `/`, preserving its portrait, greeting, personal sections, email, resume setting and social destinations. Add reciprocal navigation and isolate styles/theme preferences.
5. English and Traditional Chinese are available throughout the engineering interface and complete case studies, following the owner's language request. The preference is scoped to portfolio routes, with explicit URLs taking precedence over a saved cookie. Existing CMS posts and experiences retain their original language.
6. Preserve backend workflows; harden access without rebuilding the database. Database policy changes must be reviewed/applied by the project operator before considering direct Supabase writes protected.

## Verification and handoff

Final executed checks and limitations belong in [VERIFICATION.md](VERIFICATION.md). Operational details are in [ARCHITECTURE.md](ARCHITECTURE.md), content rules in [CONTENT_GUIDE.md](CONTENT_GUIDE.md), and security rollout in [SECURITY.md](SECURITY.md).

Initial Lighthouse homepage scores describe the earlier engineering design while it occupied `/`, before the section moved to `/portfolio`. They must not be presented as scores for the restored root homepage, the route split, or subsequent portfolio redesigns. Post-split browser checks explicitly exercise both landing pages and their navigation/theme isolation.
