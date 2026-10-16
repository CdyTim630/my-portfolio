# Verification record

## 2026-10-16 — detailed descriptions and real screenshots

Started from clean `main` at `d865d4d`. All 20 project pages now have detailed bilingual content: eight ten-section cases and twelve six-section project explanations. NTU Water Risk Map includes the original final report, presentation, route implementation and explicit team allocation. Nine actual screenshots across seven works are registered with source/date captions; report-backed pages have a direct report action.

| Check | Result |
| --- | --- |
| `npm ci` | Passed, 564 packages. Reinstalled from the unchanged lockfile after cloud-synced duplicate/dataless dependency files blocked build reads. The prior dependency directory was preserved beside the workspace. |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | **188 passed in 21 files** |
| `npm run build` | **Passed with default Turbopack**, 51 eligible pages generated |
| `npm run test:e2e` | **36 passed in 45.4 seconds** against the final standalone production build |
| `git diff --check` | Passed |

The expanded existing browser journeys read all 20 project detail pages in both languages, including native navigation without JavaScript. They verify report/source destinations, loaded screenshots and captions, disclosure behavior, section/architecture bounds and existing personal/portfolio behavior at 360/390/768/1440px. No external project executable, solver or authenticated public-demo flow was run. No remote deployment, CMS publication, database change or local owner publication edit was made.

Inspected views (water-map captures from the final production build; the meal-page capture from local development with the same starting content):

- [Water-map case, desktop](verification/water-map-detailed-desktop.png)
- [Water-map explanation, mobile](verification/water-map-detailed-mobile.png)
- [Expanded real water-map screenshots](verification/water-map-screenshots.png)
- [Meal-project detail, desktop](verification/meal-project-detailed-desktop.png)

Source and implementation notes: [PROJECT_NARRATIVES.md](PROJECT_NARRATIVES.md), [image provenance](../public/projects/captures/SOURCE.md). Historical measurements below describe earlier designs and do not score these new pages. The dependency audit still reports seven existing entries; this content work did not force dependency upgrades.

## Historical verification — 2026-10-10

Verified on **2026-10-10**, on the local `feat/engineering-portfolio` branch. The starting checkout was clean at `2df1aa3`. No remote branch, production deployment, Supabase account, database row, policy, or storage object was changed.

## Executed checks

Environment: macOS arm64, Node 24.20.0, npm 11.19.0, Next.js 16.4.0, Chromium through Playwright 1.64.0. Public and browser checks used **no Supabase credentials**. They demonstrate the usable portfolio and safe missing-configuration behavior, not live CMS integration.

| Command / check | Actual result |
| --- | --- |
| `npm ci` | Passed; repaired the initially damaged local dependency installation |
| `npm run lint` | Passed, zero errors or warnings |
| `npm run typecheck` | Passed, including Next.js route type generation |
| `npm test` | **63 tests passed in 12 files** |
| `npm run build` | Passed; build prerendered 33 eligible pages. `/portfolio`, `/projects`, and all seven cases render per request to resolve language. |
| `npm run test:e2e` | **36 passed in 15.6 seconds** against the final standalone production build, including six featured-to-case links, all seven complete bilingual cases, frontend filtering, five collection filters, scoped search and no-JavaScript reading/navigation. |
| `node --check scripts/start-standalone.mjs` | Passed; production standalone startup also exercised by E2E and Lighthouse |
| `git diff --check` | Passed |
| `npm audit` | Exits 1: **7 remaining findings**, 5 high and 2 moderate; no critical. See dependency limitations below |
| Docker image build/run | **Not executed**: Docker CLI is unavailable in this environment |
| GitHub Actions | Workflow authored; equivalent commands passed locally. Remote CI has not run because this branch was not pushed |

Unit and component coverage includes input bounds, URL validation, immutable-field rejection, trusted administrator claims, missing/public credential configuration, legacy CMS row normalization, query-failure fallbacks, Markdown XSS cases, project evidence integrity, filtering, one-category-per-project invariants, language-control semantics, navigation, and theme persistence.

The browser suite runs nine journeys at **360×800, 390×844, 768×1024, and 1440×1000**. It checks the restored personal homepage and separate portfolio, independent theme preferences, all seven complete cases in English and Traditional Chinese, the 17-entry bilingual archive, search/clear/no-results behavior, filters, language cookie/query precedence, original Blog wording, source destinations, section anchors, light/dark layouts, loaded-font horizontal overflow, keyboard navigation, missing-CMS states, admin denial, 404s, no-JavaScript reading/language navigation, sitemap/robots, API validation, foreign-origin rejection and cron authentication. Direct article/section/architecture bounds checks catch content clipped by an ancestor's overflow rule, while allowing code examples to scroll internally. These are Chromium tests, not a claim of full Safari/Firefox coverage.

## Visual and Lighthouse results

The homepage now features six projects: EmploYA, NTU Grade Atlas, SIGmile, ToMyBaby, Algorithm Visualizer and the Jenkins deployment pipeline. Its responsive grid uses three columns on desktop, two on tablet and one on mobile. Five visual folder links lead to the categorized directory, followed by a compact biography/timeline, team awards and contact. The directory has seven compact case-study previews and 17 additional works grouped into five collections. Cards show a short teaser; their full bilingual content and links remain available through native disclosures. All six homepage cards now link directly to dedicated ten-section case pages. The four promoted projects retain their archive entries, whose disclosures also link to the complete case; the catalog still represents 20 distinct works.

Traditional Chinese copy was polished throughout the homepage, category labels, 17-entry archive and all seven complete case studies. Technical claims, contribution boundaries and source links were preserved. The EmploYA teaser now correctly describes youth career exploration, and both case-study languages use the résumé's second-place award wording.

Screenshots inspected from the final standalone build with the four new cases:

- [SIGmile case, desktop / Traditional Chinese](verification/sigmile-case-desktop.png)
- [ToMyBaby case, desktop / Traditional Chinese](verification/tomybaby-case-desktop.png)
- [Algorithm Visualizer case, desktop / Traditional Chinese](verification/algorithm-visualizer-case-desktop.png)
- [Jenkins case, desktop / Traditional Chinese](verification/lsap-jenkins-pipeline-case-desktop.png)
- [Jenkins header, mobile / Traditional Chinese](verification/jenkins-case-mobile.png)
- [Jenkins architecture, mobile](verification/jenkins-architecture-mobile.png)

The following homepage views were captured before the promoted projects gained dedicated case pages; their layout remains unchanged:

- [Six featured projects, desktop / Traditional Chinese](verification/featured-six-desktop.png)
- [Portfolio with polished Chinese, desktop](verification/portfolio-copy-desktop.png)
- [Portfolio with polished Chinese, mobile](verification/portfolio-copy-mobile.png)

The following collection views were inspected before the latest copy polish and featured-project expansion:

- [Five collection tabs and cards, desktop](verification/collections-desktop.png)
- [Collection tabs, mobile](verification/collections-mobile.png)
- [Full project directory, desktop](verification/project-collections-desktop.png)
- [Data collection with SIGmile details expanded](verification/collection-details-desktop.png)

Additional browser inspection verified the language switch at 112px on desktop and 92px on mobile in both light/dark themes, a visible keyboard focus outline, and a zero-duration pill transition when reduced motion is enabled. No page errors or horizontal overflow were observed. All four E2E viewport sizes passed. The original personal homepage and separate theme preferences remain covered by that suite.

**Lighthouse 13.5.0 measured before the latest Chinese copy polish, six-project homepage expansion and four new case pages**, simulated mobile, single local measurement per page at `127.0.0.1:3200`:

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/portfolio?lang=zh-TW` | **93** | **100** | **100** | **100** | 3.1 s | 0 | 10 ms |
| `/projects?lang=en` | **91** | **100** | **100** | **100** | 3.3 s | 0 | 10 ms |

[Machine-readable results and timestamps](verification/lighthouse-collections-summary.json). These are local lab runs without live CMS data, not production field measurements or a full WCAG audit. The previous 93/93 results and earlier screenshots describe the design before this layout simplification; their historical report is retained in [lighthouse-redesign-summary.json](verification/lighthouse-redesign-summary.json).

An initial redesign measurement revealed insufficient muted-label contrast and unnecessary font loading. The final build darkens the affected text, prioritizes the portrait, uses system monospace within the portfolio and avoids an unused global font preload. Portfolio-only Latin font subsets reduce Archivo/Space Grotesk files from 155,120 to 108,556 bytes; original personal-site font files remain intact. The final portfolio run requests only its three custom font files (about 110 KB transferred), versus approximately 299 KB in the initial redesign run. Fonts retain original ASCII advances and vertical metrics. Provenance and licenses: [font source note](../public/fonts/portfolio/SOURCE.md).

The initial 95/98/95 performance scores below were for the earlier design. They are retained only as history and do not score the restored personal page or current portfolio.

### Historical initial measurements

Initial screenshots, retained as historical artifacts:

- [Desktop homepage, 1440px](verification/home-desktop.png)
- [Mobile homepage, 390px](verification/home-mobile.png)
- [Tablet projects, 768px](verification/projects-tablet.png)
- [Dark case-study header, 360px](verification/case-mobile-dark.png)

Full-page screenshots for all four widths are generated in ignored `test-results/` by `npm run test:e2e`. Open the browser report with `npx playwright show-report`.

Lighthouse **13.5.0**, simulated mobile throttling, local production server at `127.0.0.1:3200`:

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | **95** | **100** | **100** | **100** | 2.9 s | 0 |
| `/projects` | **98** | **100** | **100** | **100** | 2.5 s | 0.014 |
| `/projects/employa` | **95** | **100** | **100** | **100** | 2.9 s | 0.013 |

All three measured total blocking time at 0 ms. [Machine-readable scores and timestamps](verification/lighthouse-summary.json) are retained. These are individual local lab measurements, not production Core Web Vitals or a guarantee of identical future scores. Live CMS content, hosting/network latency, third-party embeds, and deployment caching can change results. An automated accessibility score does not replace a full WCAG audit. Home was rerun after the final build; the two project reports were captured before the last shared Blog Markdown change, which did not change those project routes.

To repeat a measurement after `npm run build`, run the standalone server and use a locally installed Chrome:

```sh
PORT=3200 HOSTNAME=127.0.0.1 npm run start:standalone
# In a second terminal:
npx lighthouse@13.5.0 http://127.0.0.1:3200/ \
  --chrome-flags='--headless' \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=html --output-path=/tmp/portfolio-lighthouse.html
```

## Defects caught and corrected

- A long Jenkins code excerpt widened the case article's implicit grid track on mobile, clipping its paragraphs despite a passing document-overflow check. An explicit shrinking grid column, bounded sections and wrapping architecture text keep the article within its container; code scrolling stays inside the code example. Direct element-bounds assertions now cover all seven cases in both languages.
- The baseline lint errors and broken installed type packages were resolved before final checks.
- A project loading boundary caused server-streamed case text to stay hidden when JavaScript was disabled. The unnecessary boundary was removed; all four no-JavaScript journeys now pass.
- After the local font loaded, a code block's minimum grid width could push the 360px case page beyond the viewport. Explicit shrinkable grid tracks and child minimum widths fixed it. Browser assertions now wait for fonts and inspect all cases in both themes.
- Legacy experience rows with null or malformed skill arrays now normalize safely rather than crashing the public homepage.
- Raw HTML and unsafe Markdown URL schemes are rejected consistently across the public article and editor previews, with three focused regression tests.
- Portfolio language selection now remains scoped to its routes, and all cases and archive entries have complete bilingual copy. The archive supports English/Chinese and combined technology keywords; empty results and clear/focus restoration are verified.
- A malformed canonical-site environment value now falls back safely. Project heading levels, the navbar's accessible name, and the nested Blog error theme were also corrected during review.

## Remaining deployment and evidence gaps

1. **Live Supabase behavior is not verified.** No credentials were available, so signed-in editing, mail delivery, uploads, direct Data API access, and actual deployed policies were not exercised. Existing Blog, diary, comments, experiences, resume, and analytics code paths are retained. Their live operation must be checked in a configured staging project.
2. **Authorization rollout is required.** Set the existing owner's trusted `app_metadata.portfolio_admin` claim, inspect existing policy/function names, apply the reviewed additive `supabase-security-hardening.sql`, and execute the actor matrix in [SECURITY.md](SECURITY.md). Until then, old broad direct-database permissions may still exist. The new app denies admin access without the claim. This SQL is supplied but deliberately not executed against production.
3. **Existing media and abuse limits remain.** Diary image URLs use a public bucket; anonymous comment and analytics inserts lack a durable abuse-control service. Diary-to-post publishing is not transactional. These are documented limitations, not claimed fixes.
4. **Dependency audit is not clean.** Five high findings remain in the build/lint `braces → micromatch → fast-glob → eslint-config-next` chain, and two moderate findings remain in the typography selector-parser chain. The original Next.js security findings were addressed by upgrading Next.js and its ESLint configuration to 16.4.0. No forced incompatible downgrade was applied. See [README](../README.md#dependency-security).
5. **Docker and remote CI remain unexecuted.** The standalone output and asset layout passed locally; the Dockerfile still needs a real container build/run on a Docker host. Vercel deployment is also intentionally unexecuted.
6. **Evidence has different levels.** The owner supplied the actual public SIGmile and ToMyBaby repositories and authorized private-project review. The catalog now presents 7 complete cases and a 17-entry archive (four works appear in both views), drawn from the résumé and 34 accessible repositories. Team competition awards are explicitly résumé-sourced; source code does not independently certify placements. Private projects have original summaries without private source links/assets. Text Mining now reflects the résumé’s specific NLP tasks while retaining team/report attribution. External projects were inspected, not executed or benchmarked. See [PROJECT_INVENTORY.md](PROJECT_INVENTORY.md).
7. **Language scope is portfolio only.** All seven full case narratives and the additional archive have English/Traditional Chinese versions. Original personal, Blog and administrator wording remains unchanged. Stored posts retain their author’s language.

Local run, Vercel configuration, Docker commands, environment variables, and the exact deployment order are in [README](../README.md) and [SECURITY.md](SECURITY.md).
