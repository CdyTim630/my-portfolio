# Resume projects and source review

Reviewed **10 October 2026 (Asia/Taipei)**. The owner supplied a resume last updated 8 July 2026, explicitly authorized including its linked work and the Uni-President competition, and later supplied the public SIGmile repository. The resume is a valid source for the owner's account of their participation and awards; it is not presented as independent award verification.

The PDF was read locally and its embedded links extracted with Poppler. It was not copied into `public/`, uploaded, or linked from the project catalog. Contact details, student identifiers and unrelated certificate links are excluded. Public source was inspected in temporary clones, and later authorized private source was reviewed read-only without publishing private URLs or copying source/assets. No external application, solver, migration, webhook or deployment was run.

## Catalog coverage

`lib/project-archive.ts` includes the six implementations reviewed in [ADDITIONAL_PROJECT_REVIEW.md](ADDITIONAL_PROJECT_REVIEW.md), five resume-linked or resume-described activities, and two narrowly attributed LSAP implementations from [LSAP_PROJECT_REVIEW.md](LSAP_PROJECT_REVIEW.md). Subsequent source reviews add ToMyBaby, One More Time, Internship Radar and the Yaoshun dashboard, bringing the archive to 17 entries. See [PROJECT_INVENTORY.md](PROJECT_INVENTORY.md) for the complete ledger.

| Entry                           | Source and personal role                                                                                                | Public framing                                                                 |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| SIGmile                         | Supplied resume plus newly supplied public source; authored navigation, urgent-dispatch and emergency-rerouting commits | Team competition prototype; champion claim explicitly attributed to the resume |
| PDAO 2026                       | Resume: authored four problems, statements, constraints, examples and C++ reference solutions                           | Contest problem setting, not a deployed product                                |
| NTU IM website                  | Resume: Information Department member contributing design, maintenance and content coordination                         | Student-association service; no sole ownership or framework claim              |
| 2025 orientation camp           | Resume: deputy general coordinator, including website-development coordination                                          | Event/website collaboration; no claim to have coded every page                 |
| Network & System Administration | Resume plus public coursework tree                                                                                      | Linux/network labs; no production-infrastructure claim                         |
| Jenkins delivery pipeline       | Personal source changes beyond a course starter and named coursework report                                             | Branch-aware Docker delivery with specific checks and failure notifications    |
| HedgeDoc PDF export             | Team allocation, personal feature commit and merged team PR                                                             | A specific browser-print contribution to a team fork                           |

Resume-only contribution statements use the visible bilingual source label **“From my résumé” / “履歷所載”**. Later source-backed work on NTUIM now uses the narrower service-role label; PDAO identifies both private-source review and résumé-derived role. SIGmile now has source-backed implementation evidence, so its narrower label is **“Award from my résumé” / “獎項依履歷所載”**. A public code repository is not required to describe owner-provided work; missing URLs remain absent rather than becoming fabricated links.

## SIGmile: source now located and reviewed

Repository: [goodmorning1226/SIGmile](https://github.com/goodmorning1226/SIGmile). Inspected revision: [`169c0ba7ca49c3b3087336e13ccebb88f9113772`](https://github.com/goodmorning1226/SIGmile/tree/169c0ba7ca49c3b3087336e13ccebb88f9113772). This supersedes the earlier inventory's “no matching source located” finding. It is distinct from the convenience-store meal optimizer.

### What the source establishes

- [Web dependencies](https://github.com/goodmorning1226/SIGmile/blob/169c0ba7ca49c3b3087336e13ccebb88f9113772/apps/web/package.json) and [driver dependencies](https://github.com/goodmorning1226/SIGmile/blob/169c0ba7ca49c3b3087336e13ccebb88f9113772/apps/driver_app/pubspec.yaml) establish a Next.js/TypeScript manager interface and API, Flutter/Riverpod/go_router driver application, Supabase adapters and TomTom integration. The catalog no longer needs to infer Next.js/Flutter from the resume's general skills section.
- [The OR service](https://github.com/goodmorning1226/SIGmile/blob/169c0ba7ca49c3b3087336e13ccebb88f9113772/apps/web/src/lib/services/or-planning-service.ts) assembles planning data and a duration matrix, spawns Python through a JSON stdin/stdout contract, processes solver output and supports draft/publication workflows. It also implements an explicitly identified mock fallback.
- [The Gurobi model](https://github.com/goodmorning1226/SIGmile/blob/169c0ba7ca49c3b3087336e13ccebb88f9113772/or-engine/vrp_gurobi.py) is an actual MTVRP formulation with driver/shift compatibility, visit/flow constraints, capacity per trip, linked trip timing, working-time/overtime costs and optional workload/box-balance terms. [The wrapper](https://github.com/goodmorning1226/SIGmile/blob/169c0ba7ca49c3b3087336e13ccebb88f9113772/or-engine/solver_main.py) returns routes, driver workloads, solve status, bound and gap. Those output fields do not themselves establish benchmark results or optimality on every run.
- [Driver route handling](https://github.com/goodmorning1226/SIGmile/blob/169c0ba7ca49c3b3087336e13ccebb88f9113772/apps/driver_app/lib/services/tomtom_routes_service.dart) parses routing instructions and lane information. Driver pages and authenticated APIs implement starting work, arriving, completing stops and reporting exceptions. [Bearer authentication](https://github.com/goodmorning1226/SIGmile/blob/169c0ba7ca49c3b3087336e13ccebb88f9113772/apps/web/src/lib/auth/bearer-auth.ts) validates Supabase users and looks up the driver role.

### Personal contribution evidence

The reachable history contains six CdyTim commits and seventeen goodmorning1226 commits. Treat the whole platform and mathematical model as team work. The strongest specific personal evidence is:

1. [`98dc27a`](https://github.com/goodmorning1226/SIGmile/commit/98dc27a1e4b3bd19664459861a020d037bfdda1a): TomTom driver route service, map integration, turn instructions, lane guidance and external-navigation fallback.
2. [`9118f72`](https://github.com/goodmorning1226/SIGmile/commit/9118f72c1e2e6c4f203412655ba4aa7c30b152dc): manager insights, urgent-dispatch ranking and emergency rerouting. Current [urgent dispatch](https://github.com/goodmorning1226/SIGmile/blob/169c0ba7ca49c3b3087336e13ccebb88f9113772/apps/web/src/lib/services/urgent-dispatch-service.ts) and [emergency routing](https://github.com/goodmorning1226/SIGmile/blob/169c0ba7ca49c3b3087336e13ccebb88f9113772/apps/web/src/lib/services/emergency-reroute-service.ts) use interpretable scoring and insertion heuristics with capacity/shift/temperature considerations.
3. [`3da45f9`](https://github.com/goodmorning1226/SIGmile/commit/3da45f91ba68ae60ede3bf3f5db97e04a89548e3): aligns stop metadata with the schema and creates a task when an eligible urgent-dispatch driver has no existing task.

These commits explicitly preserve an AI coding co-author credit. The portfolio should not claim unaided authorship. An earlier natural-language assistant and OR testbed appear in commit history but their files are absent from the inspected final tree; do not list them as current delivered features.

The resume additionally describes MTVRP/backend integration and manager-driver workflows. Source inspection corroborates the team platform's existence; the catalog favors the narrower personally authored navigation/dispatch work over a claim of sole solver authorship.

### Award, maturity and publication boundaries

The supplied resume describes **Champion, 4th Uni-President Business Competition, J-Sheng Transportation Track, May 2026**. Publish it as the owner's team achievement with the resume source label. The repository does not independently certify the placement, and no official results document was supplied in this review.

The project is an MVP/prototype. The [README](https://github.com/goodmorning1226/SIGmile/blob/169c0ba7ca49c3b3087336e13ccebb88f9113772/README.md) refers to Supabase migrations and seed files, but no `supabase/` directory is tracked at this revision; therefore database/RLS completeness cannot be certified from this tree. [Demo instructions](https://github.com/goodmorning1226/SIGmile/blob/169c0ba7ca49c3b3087336e13ccebb88f9113772/DEMO.md) explicitly describe a refresh-based dashboard rather than push updates. [AI analysis](https://github.com/goodmorning1226/SIGmile/blob/169c0ba7ca49c3b3087336e13ccebb88f9113772/apps/web/src/lib/services/ai-service.ts) and [insights](https://github.com/goodmorning1226/SIGmile/blob/169c0ba7ca49c3b3087336e13ccebb88f9113772/apps/web/src/lib/services/ai-insights-service.ts) are mock/rule-based services, not a verified LLM integration. Urgent requests include an in-memory store. Solver and map-provider failures have fallbacks.

No runtime, cost-saving percentage, production adoption, verified capacity, blanket security or always-optimal claim is added. No live demo URL was identified, so none is invented. Company-route inputs, driver/location records, credentials and raw operational matrices are not copied into the portfolio.

## Resume-only and resume-led entries

### PDAO 2026

The resume supports four authored problems covering grid reasoning, shortest-path graph DP, functional-graph binary lifting and number-theoretic optimization, with C++ reference solutions and calibrated constraints/edge cases. It supplies no problem-set, repository or contest URL. The archive contains the role and topics without a fabricated link. A later authorized private-source review corroborates C++/Python solutions, generators, validators/checkers, optimization batch-scoring tools, and CdyTim-authored statement/judging-page fixes. Its label now states “Private repository reviewed; role from résumé”; the exact four-problem personal scope still comes from the résumé. The private repository URL is omitted. No claim that solutions were independently rerun, used by a particular number of contestants, or published under a specific license is added.

### NTU IM Student Association website

The PDF's actual link annotation is [https://ntu.im](https://ntu.im). The fetched site identifies the NTU IM Student Association; the retrieval tool receives its JavaScript-required shell, which does not establish implementation ownership. The resume supports assistance with design, page consistency, maintenance and content coordination. A later [public repository review](https://github.com/cpcap1214/NTUIM) verifies React 18, React Router, Material UI and i18next. [The authored contribution](https://github.com/cpcap1214/NTUIM/commit/7f146c1734c99dedd45225ab201441af9b669693) supports upload-guideline dialogs; other reviewed commits support branding updates. The archive now links that source and names those concrete contributions, while the Information Department service title remains résumé-attributed. No sole-developer claim is added.

### 2025 orientation camp

The PDF's exact link is [https://www.ntupipcamp2025.com/](https://www.ntupipcamp2025.com/), including `www`. The resume supports deputy general coordination and website-development coordination alongside program/logistics work. Although a similarly named GitHub fork appears in the owner's inventory, this review does not establish that fork's authored changes; the archive links the supplied website instead. The web retrieval attempt returned 502, so current availability is not promised. Participant count and event duration are unnecessary for the concise project card and are omitted.

### Network & System Administration

The exact PDF link is [CdyTim630/NASA2025-fall](https://github.com/CdyTim630/NASA2025-fall). The [inspected public tree](https://github.com/CdyTim630/NASA2025-fall/tree/63800df44c594d3d4e743d823e7ca77762215ce5) contains homework/lab PDFs, C exercises and shell judging scripts. The resume supplies the broader Linux, storage, networking, VM/container and troubleshooting account. Keep that account labeled as coursework from the resume; this pass did not reproduce each lab or establish production operations experience.

## LSAP entries with stronger personal evidence

The two archive cards follow [LSAP_PROJECT_REVIEW.md](LSAP_PROJECT_REVIEW.md):

- **Jenkins delivery pipeline:** [pinned implementation](https://github.com/CdyTim630/lsap-cicd-example-app/blob/d649e5d218d0e985ab43d910c9c2d9dab4701b1d/Jenkinsfile), personal commits beyond the Express starter, development health checking, selected-image promotion and Discord failure notifications. Do not claim that the pipeline runs Jest, performs automatic rollback or guarantees zero downtime. Do not reproduce or invoke the historical webhook embedded in the source.
- **HedgeDoc PDF export:** [personal feature commit](https://github.com/IM-LaoSAPi/hedgedoc/commit/c13154eeb9280f6397d77b0b6561561041af1c0e) plus the team presentation's explicit assignment of PDF export and slide design. Use the actual team repository, not the unchanged personal upstream fork. The implementation coordinates browser printing and print CSS; it is not a server PDF service or authorship of HedgeDoc's collaboration engine.

The resume's LSAP grade and highest-team claims remain owner-provided and are not needed in these technical cards. The reviewed materials support specific implementation stories without those score badges.
