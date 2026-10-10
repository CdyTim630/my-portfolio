# Additional authenticated repository review

Reviewed 2026-10-10 (Asia/Taipei). At the owner's request, a read-only GitHub API inventory included owned, collaborator and organization-member repositories, rather than only the public profile. It returned 34 accessible repositories. The catalog remains curated: forks, duplicate team mirrors, homework bundles and test/image-only repositories are not each presented as separate products.

This review inspected repository metadata, README files, root file inventories, selected source-path inventories, and commits attributed to `CdyTim630`. It did not run applications, access deployed user data, or independently reproduce README test/deployment claims. Private source contents and private repository URLs are not published here.

## New catalog entries

### Internship Radar

- **Source status:** private personal repository, reviewed with authorized access. No public source or demo link is added.
- **Supported scope:** the README describes a personal internship search/application platform with public-job ingestion, explainable matching, a Next.js web client, FastAPI, PostgreSQL, Redis/Celery and SwiftUI clients. The file inventory includes API/web applications, native-client files, migrations/deployment documentation and workflow configuration.
- **Personal evidence:** authenticated commit history attributes changes to expired-listing recommendations, login feedback, native connection and source freshness to CdyTim. This supports a personal MVP entry and continued iteration; it does not establish usage, scale or independently reproduced test results.
- **Boundary:** private deployment and personal records are not inspected or exposed. No performance metrics are copied from internal documentation.

### Yaoshun Operations Dashboard

- **Public source:** [cpcap1214/IM2008](https://github.com/cpcap1214/IM2008).
- **Supported scope:** a React/TypeScript team dashboard for orders, delivery, payment confirmation, customer history and an AI-advisor interface. Its README documents shared Firestore data contracts with a separate LINE bot.
- **Personal evidence:** [CdyTim's payment/data-contract commit](https://github.com/cpcap1214/IM2008/commit/1b6bb6a0151e) adds pending payment confirmation, paid timestamps, merge writes, seed controls and Firestore rules/indexes. Other attributed commits add a customer-name picker, delivery-address fields, dashboard workflow changes, Firebase integration and AI-advisor UI.
- **Boundary:** this is team work, not sole authorship of the dashboard or LINE bot. The README leaves authentication/rules deployment as unfinished work; the catalog therefore labels it an application prototype and makes no production-security or adoption claim. The metadata's hosted URL was not independently validated and is omitted from the entry.

## Existing entries with stronger evidence

### NTU Information Management Student Association website

- **Public source:** [cpcap1214/NTUIM](https://github.com/cpcap1214/NTUIM), whose README identifies it as the NTU IMSA website.
- **Stack evidence:** `package.json` lists React 18, React Router, Material UI and i18next.
- **Personal evidence:** [upload-guideline change](https://github.com/cpcap1214/NTUIM/commit/7f146c1734c99dedd45225ab201441af9b669693) replaces a broken PDF download with an in-app guidelines dialog. [Brand asset contribution](https://github.com/cpcap1214/NTUIM/commit/22b1d18d7f5ea17539d74314c190a5a6e78608a0) and related interface commits are also attributed to CdyTim.
- **Catalog treatment:** strengthen the existing campus-website entry with public source evidence; do not add a duplicate project or imply sole ownership of the site.

### PDAO 2026

- **Source status:** a private team repository, reviewed with authorized collaborator access. Its repository URL and source code remain unlinked.
- **Supported scope:** the file inventory contains C++/Python solutions, problem statements, generators, validators, checkers, optimization solvers and batch scoring/judging tools.
- **Personal evidence:** commits attributed to CdyTim update problem descriptions and correct a judging-related page issue. The broader event role remains based on the owner's résumé; the repository does not assign every solution or tooling stage to an individual.
- **Catalog treatment:** update the existing PDAO entry's evidence status. Do not duplicate it or convert team tooling into a claim of sole authorship.

## Coverage decision

The review also confirmed accessible sources already represented by the detailed cases or archive, including SIGmile, ToMyBaby, One More Time, the water-risk map, optimization coursework, visualization/game projects and systems-course contributions. Other accessible items were test assets, course exercises, upstream forks or duplicate team mirrors without a distinct, verified portfolio narrative. Accessibility alone is not treated as proof of personal implementation.
