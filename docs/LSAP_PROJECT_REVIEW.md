# LSAP 2025: evidence review for additional portfolio cases

Reviewed 10 October 2026 against the supplied resume, public source, authored commit diffs, and the complete 38-page final presentation. This is an editorial inventory, not a claim that the historical services still run. No remote repository, deployment, registry, webhook, or service was changed or invoked.

## Recommendation

There is enough material for **two distinct engineering cases**: a personally implemented Jenkins delivery pipeline, and a narrowly attributed PDF-export contribution to the team’s HedgeDoc fork. The Linux deployment and benchmarking assignments are useful supporting work. They should not be combined into a single fictional production system: the pipeline, HedgeDoc, multiplayer-game benchmark, and wiki-assistant deployment concern different applications.

The earlier inventory understated HedgeDoc because the personal fork is an unmodified upstream snapshot. The substantive code is in the team repository, `IM-LaoSAPi/hedgedoc`. A fork badge alone does not describe the contribution.

## Source map and pinned revisions

| Source                                                                                                                | Revision / location                        | What was inspected                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| [LSAP2025 coursework](https://github.com/CdyTim630/LSAP2025/tree/0045b2c2182056c73531c2778fa6ef6a940890a7)            | `0045b2c2182056c73531c2778fa6ef6a940890a7` | Final presentation, HW6 report, HW4 deployment/benchmark report, HW5 Docker report, HW1 shell files.                               |
| [CI/CD application](https://github.com/CdyTim630/lsap-cicd-example-app/tree/d649e5d218d0e985ab43d910c9c2d9dab4701b1d) | `d649e5d218d0e985ab43d910c9c2d9dab4701b1d` | Jenkinsfile, Dockerfile, app, package scripts, tests, deploy configuration, and personal commit history beyond the course starter. |
| [Personal HedgeDoc fork](https://github.com/CdyTim630/hedgedoc/tree/6aa16f4956176318d19b4965c784da5cc9a0ed52)         | `6aa16f4956176318d19b4965c784da5cc9a0ed52` | Default branch snapshot and parent repository relationship. This branch does not contain the student work.                         |
| [Team HedgeDoc repository](https://github.com/IM-LaoSAPi/hedgedoc/tree/ef59d580c0dcc0fa03ec945676ca5361eeb6e387)      | `ef59d580c0dcc0fa03ec945676ca5361eeb6e387` | PDF UI, renderer hook, print styles, authored changes, and merged PR.                                                              |
| User-provided resume                                                                                                  | `/Users/cdytim/Desktop/CV/resume.pdf`      | Personal account of the course, delivery work, load testing, and grades; supplied by the user, not independent confirmation.       |

## Candidate 1: Jenkins CI/CD with Docker promotion and failure notifications

**Suggested portfolio framing:** “A course delivery pipeline that builds a development image, verifies its health, and promotes a selected image into production.” Role: individual coursework implementation on an Express starter, rather than author of the starter application or Jenkins itself.

The history contains 11 CdyTim630-authored commits after the course starter. The implementation changes five files: Jenkinsfile, Dockerfile, application, package scripts, and deployment tag configuration. The [initial pipeline commit](https://github.com/CdyTim630/lsap-cicd-example-app/commit/3e9292ff8fddef8be049e010b0501cf54d87e981), [health endpoint addition](https://github.com/CdyTim630/lsap-cicd-example-app/commit/4d7ab2df769ed3ae61e61af4b6498f2dbd0bf6e6), and [promotion revert](https://github.com/CdyTim630/lsap-cicd-example-app/commit/d649e5d218d0e985ab43d910c9c2d9dab4701b1d) establish concrete personal work and a reviewable iteration history.

Verified flow from the [pinned Jenkinsfile](https://github.com/CdyTim630/lsap-cicd-example-app/blob/d649e5d218d0e985ab43d910c9c2d9dab4701b1d/Jenkinsfile):

- Static analysis installs dependencies and runs the lint script.
- The development branch builds and pushes a `dev-${BUILD_NUMBER}` Docker image, replaces the development container, and checks its `/health` endpoint through the container’s IP.
- The main branch reads a selected image tag from `deploy.config`, pulls that image, retags it with the production build number, and replaces the production container. This promotes an existing artifact rather than rebuilding the app for production.
- A failure handler sends build context to Discord. The [HW6 report](https://github.com/CdyTim630/LSAP2025/blob/0045b2c2182056c73531c2778fa6ef6a940890a7/HW6/B13705020_lsap_hw6.pdf) identifies the student and includes a screenshot of failure notifications. It also links a [demonstration video](https://youtu.be/8M0vogI3yhI); the video’s current availability and contents were not verified in this review.

Useful engineering decisions: reusing a built image for promotion; a dedicated HTTP health endpoint; debugging container connectivity; explicit configuration history for promotion and revert; failure visibility outside Jenkins.

**Boundaries to keep in the case:** the Jenkinsfile does not run the existing Jest tests, so describe automated lint and smoke checking rather than comprehensive automated testing. There is no production health check, blue/green deployment, automatic rollback, or verified zero-downtime behavior. Discord integration posts failures, not a full deployment-status ChatOps interface. The Dockerfile uses Node 14 and a simple single-stage image; these are historical implementation limitations, not a current recommended baseline.

The public Jenkinsfile also contains a hardcoded Discord webhook. Do not embed its value, copy the whole file into the portfolio, or send a test notification. Rotation and Jenkins credential binding are a concrete improvement to discuss before operating this pipeline again. Docker Hub credentials already use Jenkins credential binding.

**Outcome that can be published:** “Implemented and iterated a branch-aware Docker pipeline with development smoke checks, artifact promotion, and Discord failure notifications.” No measured deployment-time reduction or production availability claim is supported.

## Candidate 2: reliable PDF export in a collaborative Markdown editor

**Suggested portfolio framing:** “Contributed browser-based PDF export and print-layout fixes to a team-maintained HedgeDoc fork.” This is a specific feature contribution to an existing open-source application, not authorship of HedgeDoc’s complete editor, collaboration engine, authentication, or deployment stack.

The [final presentation](https://github.com/CdyTim630/LSAP2025/blob/0045b2c2182056c73531c2778fa6ef6a940890a7/Final%20Project/LSAP%E6%9C%9F%E6%9C%AB%E5%B0%88%E6%A1%88%E7%B0%A1%E5%A0%B1_%E7%AC%AC%E4%B8%83%E7%B5%84.pdf), page 37, explicitly assigns **陳鼎元: PDF Export Function and Slides Design**. Other teammates own the UI theme, GitHub synchronization, OAuth integration, and AI summary / VM deployment. Pages 18–22 show the PDF feature; pages 30–31 explain its iterations and design tradeoff.

The [CdyTim630-authored feature commit](https://github.com/IM-LaoSAPi/hedgedoc/commit/c13154eeb9280f6397d77b0b6561561041af1c0e) independently supports the narrow attribution. It adds the PDF sidebar entry, a renderer-aware export hook, and print-layout changes. The [merged PDF branch](https://github.com/IM-LaoSAPi/hedgedoc/pull/11) and [merge commit](https://github.com/IM-LaoSAPi/hedgedoc/commit/c5113141ed52a000a36c749e44d7b2c2898e1bf7) connect that work to the team codebase.

Verified implementation:

- The [PDF export hook](https://github.com/IM-LaoSAPi/hedgedoc/blob/ef59d580c0dcc0fa03ec945676ca5361eeb6e387/frontend/src/components/editor-page/utils/export-to-pdf.ts) checks renderer readiness and the iframe window before requesting print mode through the existing renderer communicator.
- The hook opens the browser print dialog, where the user saves a PDF, then resets print mode. This is browser-assisted export, not a server-side PDF-generation API.
- The [new sidebar entry](https://github.com/IM-LaoSAPi/hedgedoc/blob/ef59d580c0dcc0fa03ec945676ca5361eeb6e387/frontend/src/components/editor-page/sidebar/specific-sidebar-entries/export-sidebar-menu/entries/export-pdf-sidebar-entry.tsx) connects a translated PDF label and icon to that hook.
- The [print stylesheet](https://github.com/IM-LaoSAPi/hedgedoc/blob/ef59d580c0dcc0fa03ec945676ca5361eeb6e387/frontend/global-styles/print.scss) hides the table of contents, adjusts page breaks, constrains images, and sets an A4 page layout. These changes address the presentation’s examples of clipped images and unwanted print content.

The presentation describes an initially considered Puppeteer API approach and a choice to reuse browser rendering because server rendering could diverge in fonts/styles and consume constrained VM resources. Treat this as the team’s reported design rationale, not a measured resource benchmark. Existing renderer messaging and print infrastructure remain upstream components; the feature reuses them.

**Boundaries to keep in the case:** fixed timers coordinate print mode; the code does not wait for a print lifecycle event or all media/fonts. No dedicated PDF regression tests or browser-comparison results were found. “Reliable export” should therefore describe the intended UX improvement, with the demonstrated fixes and untested cases stated, not a guarantee for every document/browser. The final screenshot comparison is evidence of the submitted feature, not a production adoption metric.

Good portfolio visuals are the actual export menu, before/after document examples, and a newly drawn diagram labeled “renderer print flow.” If reusing slide screenshots, preserve the source and team attribution. HedgeDoc source is AGPL-3.0-only; link source and keep attribution on any excerpt.

## Supporting Linux assignments: keep their applications explicit

The [HW4 original report](https://github.com/CdyTim630/LSAP2025/blob/0045b2c2182056c73531c2778fa6ef6a940890a7/HW4/LSAP%20HW%204%20-%20original.pdf) deploys the upstream `minimal-shooter-game` application. It documents a systemd service with restart behavior, Nginx reverse proxying with WebSocket upgrade headers, Selenium trials, and WebSocket load generation up to 1,000 simulated clients. This is useful evidence of Linux operations and benchmark interpretation; it is **not a HedgeDoc capacity test**.

Report tables and graphs were inspected, but the experiment was not rerun. At least one row has inconsistent upper-percentile ordering, and the report’s CPU bottleneck explanation is an inference rather than a demonstrated profiler result. Avoid promoting the report’s approximate capacity recommendation to a verified “supports N concurrent users” headline. A stronger future writeup would include the runnable generator, environment, duration, raw samples, percentile calculation, and failure criteria.

The [HW5 setup report](https://github.com/CdyTim630/LSAP2025/blob/0045b2c2182056c73531c2778fa6ef6a940890a7/HW5/B13705020-setup.pdf) covers a separate wiki-assistant Docker/Nginx deployment, including WebSocket forwarding. HW1 contains shell recycle-bin and restore utilities with scheduled cleanup. These establish breadth, but do not by themselves imply a single integrated platform.

## Resume claims and publication decision

| Resume statement                              | Review result                                                                                                      | Portfolio treatment                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Jenkins CI/CD, Docker, notifications          | Personally authored source plus named HW6 report support a specific implementation.                                | Publish with the exact checks and failure-only notification scope.                                       |
| HedgeDoc frontend/backend customization       | Team work is real, but final contribution table and personal diff support PDF export / print styles most strongly. | Feature the PDF contribution; describe other features as teammates’ work.                                |
| HTTPS and WebSockets                          | Team presentation describes Caddy/TLS; separate Linux reports show reverse proxy / WebSocket configuration.        | Attribute the system context and identify which assignment each example belongs to.                      |
| Concurrent load benchmarking                  | Detailed report exists for the multiplayer-game assignment.                                                        | Publish methodology and limitations; do not transfer capacity numbers to HedgeDoc.                       |
| Final project 96.8, highest team; course 97.1 | Found in the supplied resume only, not independently corroborated by a grade sheet or course announcement.         | Omit from verified result badges, or explicitly identify as self-reported if the user wants it included. |

**Editorial priority:** the Jenkins case adds delivery/operations depth missing from the current portfolio; the HedgeDoc case adds an unusually concrete UI/rendering tradeoff with independently attributable code. Both merit full cases when the site is ready to add them. The collection of Linux assignments can then appear as supporting coursework, without diluting their distinct contexts.
