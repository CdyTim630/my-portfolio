# Detailed project descriptions and UI captures

Updated 2026-10-16 (Asia/Taipei), starting from clean commit `d865d4d` on `main`.

All 20 built-in project pages now have substantive bilingual descriptions. Eight projects have full ten-section cases; the other twelve have six sections adapted to their actual work: purpose, features/workflow, implementation, personal contribution, scope/trade-offs and lessons. Event coordination and problem setting are described as such, rather than padded into fictitious software architectures.

## Content sources

- Existing seven cases retain their detailed narratives and individual/team attribution.
- `lib/water-map-case.ts` promotes NTU Water Risk Map to a full case, based on the current public revision `87cce94ba07d3977733b61992ee9c44905348cb1`, its ten-page `report/report.pdf`, the presentation and actual route implementation. The report explicitly assigns project integration and route-planning algorithms to the owner. The current edge-cost implementation supersedes the older simplified formula in the report/README. Forecasting remains rule-based; no unverified outcome numbers were added.
- `lib/archive-project-narratives.ts` adds the remaining twelve detailed descriptions. Sources are the pinned public repositories and the previously documented résumé/private-source reviews in `ADDITIONAL_PROJECT_REVIEW.md`, `AUTHENTICATED_PROJECT_REVIEW.md`, `LSAP_PROJECT_REVIEW.md`, `ONE_MORE_TIME_PROJECT_REVIEW.md` and `RESUME_PROJECT_REVIEW.md`. Public repository heads and relevant report/source files were rechecked. Private source URLs, assets, credentials and personal records remain absent.
- `lib/project-narrative.ts` keeps section structure and references aligned across English/Traditional Chinese.

The new content supplies starting documents to the existing project CMS. Published snapshots, drafts and unpublish tombstones still take precedence. The existing local EmploYA draft/publication was inspected for its slug and section count and was not modified. No remote publication, database operation or deployment was performed.

## Real UI imagery

Nine new screenshots across seven works are registered in `lib/project-media.ts`: NTU Water Risk Map (two), Algorithm Visualizer, ToMyBaby, NTU IM website, 2048, the meal optimizer (two), and Laughing Jianghu. Five were captured from public deployed pages on 2026-10-16; four come from committed report/game screenshots. Image provenance and boundaries are recorded in [SOURCE.md](../public/projects/captures/SOURCE.md).

Images are local WebP files (maximum 1440px wide), with descriptive alt text and bilingual captions. The first image becomes the project cover. A native screenshot disclosure exposes larger captures and provenance without requiring JavaScript. Report-backed projects also receive a direct **Read full report / 閱讀完整報告** action.

The camp website did not resolve, so no error-page image was used. Private project imagery was not copied. Public pages were viewed without signing in, submitting a water report or requesting AI/TTS services. Report/sample screenshots are labeled as demonstrations. No external repository code, optimization solver or game executable was run.

## Verification

- Content validation covers all 20 publishable bilingual documents, section parity, report/source links, local media files and private-source boundaries.
- Browser journeys read all 20 detailed pages in both languages, including without JavaScript, verify report destinations, expand screenshot disclosures, check loaded images/captions and measure layout bounds at desktop/tablet/mobile sizes.
- The project count remains 20, archive count 17 and homepage selection six. The main detailed-project index expands from seven to eight to include the water map.

Final check outcomes and screenshots are recorded in [VERIFICATION.md](VERIFICATION.md).
