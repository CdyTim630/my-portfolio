# Maintaining portfolio content

## Personal website and engineering portfolio

The original personal website remains at `/`, composed from `components/personal/`. Its **View portfolio** link opens the engineering landing page at `/portfolio`. The engineering navigation links back with **Personal website** and keeps project discovery at `/projects`.

Maintain the two visual experiences separately: personal rules stay under `.personal-site`; engineering rules live in `components/portfolio/portfolio.css` and `projects.css`, scoped to `.portfolio-theme`. Both offer Light/Dark/Color modes with independent persisted preferences. Updating project copy, featured cards, or engineering positioning must not replace the personal hero or move the root route again. The original personal page retains its Supabase experiences. Portfolio experience highlights and team awards are bilingual summaries from the owner-supplied résumé; writing and resume-link settings are shared CMS data.

## Two content sources

- `lib/projects.ts` is the versioned source of engineering case studies. Changes receive TypeScript checks and content tests before deployment. It has no Supabase dependency.
- Supabase remains the CMS for published Blog posts, categories, experiences, resume settings, comments and private diaries. Edit these in the existing authenticated admin UI after completing [security setup](SECURITY.md). Do not move live rows into sample files.

The engineering UI supports English and Traditional Chinese through the EN/中文 switch on `/portfolio`, `/projects`, and case pages. Each full case has a corresponding entry in the translation registry; the four promoted cases keep their English and Chinese content together in `lib/featured-product-cases.ts` and `lib/featured-engineering-cases.ts`, imported by `lib/projects.ts` and `lib/project-translations.ts`; additional projects use bilingual fields in `lib/project-archive.ts`. The personal website retains its original labels, and stored CMS content keeps the author's original language. Do not apply the portfolio language setting to the root homepage, Blog, or administrator interface.

## Adding a project

Copy an existing `Project` object in `lib/projects.ts`. Supply a unique kebab-case `slug` and all required typed fields:

| Field                                | Meaning                                                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `title`, `summary`, `year`, `status` | Concrete problem statement, year supported by evidence, and prototype/MVP/coursework status                               |
| `role`, `team`, `contribution`       | Personal ownership, collaborators, and concise contribution suitable for a card                                           |
| `stack`, `category`, `featured`      | Technologies verified in source; supported filters; whether to feature on `/portfolio`                                   |
| `repository`, optional `demo`        | Existing public destinations; omit unknown or broken demo links                                                           |
| `images`                             | Local image source, descriptive alt text, caption and provenance. Empty is valid.                                         |
| `architecture`                       | Component labels and descriptions grounded in the code; describe branches in Data Flow                                    |
| `sections`                           | Ten ordered editorial sections with stable unique anchor IDs and paragraphs; optional bullets and attributed code excerpt |
| `evidence`                           | Source label, direct public URL and what the source proves                                                                |
| `visual`                             | Visual treatment for the fallback component diagram                                                                       |

The ten sections cover Overview, My Role, Problem & Constraints, Architecture, Data Flow, Technical Implementation, Engineering Decisions, Challenges & Trade-offs, Results & Evidence, and Lessons Learned. The architecture section ID must be `architecture` for the component diagram to appear. Keep section IDs different from the reserved `evidence` anchor used by source references.

`ProjectFilter` filters server-rendered cards through client slots. All project article text, source links and diagrams render on the server. `generateStaticParams`, metadata and sitemap are derived from the same project list. No manual route registration is needed.

Add or update the matching Traditional Chinese entry in `lib/project-translations.ts` whenever you change a case. Translate the complete summary, role, team, contribution, status, architecture labels/details, all section paragraphs and bullets, evidence descriptions, image alt/captions, and code captions. Keep slugs, section IDs, source URLs, image paths, and the code itself identical. Preserve uncertainty and individual/team attribution in both languages. Translation parity tests reject incomplete coverage.

For portfolio navigation use `portfolioHref(path, locale)` so links retain the explicit `?lang=en` or `?lang=zh-TW` selection, including before a section hash. The helper intentionally leaves personal/Blog/external links unchanged. The cookie is a convenience preference; a shared URL's explicit language takes precedence.

## Additional project archive

Keep full bilingual summaries, contributions, technologies and source URLs in `lib/project-archive.ts`. Add exactly one primary category and a concise English/Traditional Chinese teaser for each ID in `lib/project-collections.ts`. Category membership is explicit editorial metadata, not inferred from keywords or duplicated across multiple groups. The catalog tests catch missing/orphaned assignments.

The homepage highlights six projects, each linking to a dedicated case at `/projects/<slug>`. The first two are selected through `featured` in the case registry; the four promoted archive projects are selected through `featuredAdditionalProjectIds` in `lib/project-archive.ts`. Every selected ID must resolve to a complete bilingual case. Their archive disclosures also link to the case. Existing `/projects?open=<id>#<id>` links remain supported for native archive details, including without JavaScript.

The archive shows short teasers and a few technology tags for scanning. Full content remains in native **Details / 專案詳情** disclosures, including attribution and source status. Do not shorten the underlying evidence to match the teaser or move source links outside the disclosure without updating accessibility tests. Category selection and bilingual search work together; clearing the query keeps the current category. With JavaScript disabled, all entries and their native disclosures must still be readable.

## Additional projects

`lib/project-archive.ts` contains concise bilingual records for further work. Include a specific contribution and project maturity; repository ownership alone is insufficient attribution. Omit public source links for private repositories and use an explicit source-status label. Keep repository/demo/evidence URLs real, and do not copy private assets into the public site. The archive is a separate browsing view; four of its entries also have full ten-section cases; its search covers names, descriptions and technologies in both languages.

## Writing rules

1. Start with the user's problem. Explain what changed in the system and why the change matters.
2. Separate repository capabilities from personal work. A team README or commit supports attribution; repository ownership alone does not prove sole authorship.
3. Distinguish implemented behavior, author-reported results, inferred reasoning and proposed improvements. Use “the source implements…” or “a next step would be…” where appropriate.
4. Attribute résumé-only awards explicitly to the owner-supplied résumé. Do not imply independent verification or turn coursework into employment. Public source code verifies implementation, not competition placement. Record evidence levels in [PROJECT_INVENTORY.md](PROJECT_INVENTORY.md).
5. Do not claim production traffic, accuracy or speedup without a reproducible source, evaluation setup and limitations. Small report tables are not deployment benchmarks.
6. Prefer links pinned to the inspected commit so future upstream changes cannot silently invalidate the narrative. Keep screenshots and excerpts attributed.
7. Avoid unsupported expertise levels. Link capability summaries to a relevant case study or source repository.

## Images, diagrams and demos

Place approved media under `public/projects/`, with descriptive names. Optimize image dimensions/filesize and record the source, capture date, and whether it is an actual UI screenshot or a diagram. The site uses `next/image` for the portrait and case images. External image hosting requires a deliberately scoped `remotePatterns` entry in `next.config.ts`; local media is simpler.

Empty `images` renders a clearly labeled system overview using the source-backed architecture nodes. It is a schematic, not a claimed product screenshot. The larger architecture component is a semantic HTML list so it remains readable on small screens and without JavaScript.

For a short demo, prefer an existing source `demo` URL. Do not invent a running demo from a README's placeholder URL. If adding an embedded recording, use a local licensed MP4/WebM, native controls, `preload="metadata"`, no autoplay, an accessible label, and captions/transcript for spoken information. Keep the original recording link in evidence. The current initial cases use actual screenshots or source diagrams; no unverified recording is embedded.

## Experiences, resume and Blog

- Original personal-site experiences display from Supabase, sorted by `sort_order`. The portfolio has a separate, bilingual selection based on the supplied résumé in `app/portfolio/page.tsx`: calculus teaching assistant, student association information team and orientation-camp coordination. Update both languages together when the owner provides changes; do not silently write these highlights into the CMS. Dates and awards reflect the supplied résumé, not a fresh employment or award verification.
- Resume links come from `site_settings`, with the original Google Drive link as fallback. Only HTTP(S) links are accepted. A Google Drive viewer may require an extra download action; the site opens it safely rather than claiming the HTML `download` attribute can force a cross-origin download.
- Published posts remain Markdown through `react-markdown`; raw HTML is not enabled. Avoid adding raw HTML plugins without revisiting XSS tests and the threat model.
- When the CMS is unavailable, display an honest unavailable state. Never expose `lib/blog-data.ts` mock career stories or the unconfirmed role in `lib/experience-data.ts` as fallback content.

## Review commands

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Review the new project on a narrow phone and desktop, check its section links, filter categories, source destinations, image alt text, theme contrast and personal attribution before deployment. Also follow `/` → `/portfolio` → `/` and confirm that navigation, the original personal styling, and both independent theme preferences remain intact.
