import { featuredProductCases } from "./featured-product-cases";
import { featuredEngineeringCases } from "./featured-engineering-cases";
import { waterMapCase } from "./water-map-case";

export type ProjectCategory =
  "Backend" | "Data" | "AI" | "Full-stack" | "Frontend";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  year: number;
  role: string;
  team: string;
  stack: string[];
  category: ProjectCategory[];
  featured: boolean;
  repository: string;
  demo?: string;
  images: { src: string; alt: string; caption?: string }[];
  video?: {
    src: string;
    poster?: string;
    caption: string;
    transcript?: string;
  };
  sections: {
    id: string;
    title: string;
    paragraphs: string[];
    bullets?: string[];
    code?: { language: string; content: string; caption?: string };
  }[];
  evidence: { label: string; url: string; detail: string }[];
  architecture: { label: string; detail: string }[];
  status: string;
  contribution: string;
  visual:
    | "employa"
    | "atlas"
    | "pipeline"
    | "portfolio"
    | "sigmile"
    | "tomybaby"
    | "algorithms"
    | "delivery";
};

const employaRepo = "https://github.com/CdyTim630/ytp_hackathon_2026";
const employaSource = `${employaRepo}/blob/7cd74747a1cb1a923b90cdfffd9c9e9afd7f7506`;
const atlasRepo = "https://github.com/CdyTim630/ntu-grading";
const atlasSource = `${atlasRepo}/blob/e620e5b`;
const miningRepo = "https://github.com/CdyTim630/Text-Mining2025";
const miningReport = `${miningRepo}/blob/a3cbb90/${encodeURIComponent("文字探勘初論第15組期末報告.pdf")}`;
const miningSlides = `${miningRepo}/blob/a3cbb90/${encodeURIComponent("文字探勘初論第 15 組期末報告簡報.pdf")}`;

/** Reviewed public evidence, not live CMS data. See docs/PROJECT_INVENTORY.md. */
export const projects: Project[] = [
  {
    slug: "employa",
    title: "EmploYA",
    summary:
      "Connecting young people with career resources through contextual AI and a path to human support.",
    year: 2026,
    role: "Backend API & AI / RAG contributor",
    team: "Five-person YTP Hackathon team",
    stack: [
      "Next.js",
      "TypeScript",
      "Gemini API",
      "RAG",
      "Supabase",
      "Flutter integration",
    ],
    category: ["Backend", "AI"],
    featured: true,
    repository: employaRepo,
    images: [],
    status: "Team hackathon prototype",
    contribution:
      "Co-developed backend APIs, retrieval and Gemini integration, with contributions to chat memory, fallback behavior and client–API integration.",
    visual: "employa",
    architecture: [
      {
        label: "Youth app",
        detail: "Flutter sends profile, swipe and chat requests over HTTP.",
      },
      {
        label: "API & AI services",
        detail:
          "Next.js coordinates persona context, retrieval and Gemini responses.",
      },
      {
        label: "Knowledge & storage",
        detail:
          "Resource chunks and an in-memory store, with optional Supabase persistence.",
      },
      {
        label: "Counselor & policy views",
        detail:
          "Shared backend data supports team-built handoff and dashboard interfaces.",
      },
    ],
    sections: [
      {
        id: "overview",
        title: "Overview",
        paragraphs: [
          "Career resources are useful only when a young person can connect them to a practical next step. EmploYA is a team prototype for Taipei youth that brings profile exploration, career planning, resource-aware conversation and counselor handoff into one workflow.",
          "The product spans a Flutter youth client and Next.js counselor and policy interfaces. My work focused on the backend and AI integration that connect these experiences.",
        ],
      },
      {
        id: "my-role",
        title: "My role",
        paragraphs: [
          "The team README credits me and 許晉誠 for backend APIs, and me and 宋宇倫 for AI / RAG. My public commits include retrieval and knowledge APIs, chat history, source links, an in-memory rate guard, Gemini fallback and AI-assisted to-do generation.",
          "Flutter product development, the counselor interface, policy dashboard and presentation materials had separate owners. The architecture described here is a team result; I do not claim sole authorship of those interfaces.",
        ],
      },
      {
        id: "problem-and-constraints",
        title: "Problem & constraints",
        paragraphs: [
          "A useful answer needs personal context and a traceable resource, while a hackathon demo must also survive missing credentials or an unavailable model. The system therefore supports local answers and an in-memory store alongside optional external services.",
          "The public implementation is a prototype. Policy eligibility can change, retrieval scores are heuristics, and memory-based caches and rate limits do not coordinate across server instances.",
        ],
      },
      {
        id: "architecture",
        title: "Architecture",
        paragraphs: [
          "Flutter calls Next.js route handlers. Service modules handle persona generation, plan generation, intent classification, question normalization and retrieval. Knowledge sources carry categories, eligibility notes and source URLs; optional Supabase helpers persist selected application data.",
          "The counselor and policy interfaces consume the same backend domain. Counselor-reviewed FAQ records can be loaded into the knowledge base, with a short refresh interval to recover them after a serverless cold start.",
        ],
      },
      {
        id: "data-flow",
        title: "Data flow",
        paragraphs: [
          "A chat request is checked, associated with its user and conversation, and evaluated against the request limit. The route restores available conversation history, reads profile and persona context, and classifies the message before choosing a reply path.",
          "For a retrieval response, the service enriches the query, ranks knowledge chunks, computes a heuristic confidence score and handoff signal, and supplies those chunks to Gemini. The result exposes its provider and retrieved sources; model failure can fall back to a local response.",
        ],
      },
      {
        id: "technical-implementation",
        title: "Technical implementation",
        paragraphs: [
          "Retrieval uses locally hashed token vectors, cosine similarity, token overlap and intent metadata. This is a lightweight lexical retrieval implementation, not a learned embedding model or a hosted vector database.",
          "The generation layer includes recent conversation turns and resource URLs. It removes generated Markdown links that do not match a retrieved source and tries fallback models for selected upstream errors. These safeguards improve traceability without guaranteeing factual correctness.",
        ],
        code: {
          language: "typescript",
          content:
            "const vectorScore = cosineSimilarity(queryEmbedding, chunk.embedding);\nconst overlapScore = tokenOverlap(queryTokens, sourceTokens);\nconst boost = metadataBoost(intent, source, intentQuestion);\nconst score = Math.min(1, vectorScore * 0.68 + overlapScore * 0.24 + boost);",
          caption:
            "Source excerpt: backend/src/engines/rag.ts, searchKnowledge. Weights are implementation choices, not evaluated accuracy metrics.",
        },
      },
      {
        id: "engineering-decisions",
        title: "Engineering decisions",
        paragraphs: [
          "A local retrieval index kept setup small enough for the competition and made scoring inspectable. Explicit source metadata allowed the response layer to distinguish an actual resource from a general directory page.",
          "Chat caching includes user, mode, persona and conversation-history context, so repeated text in different conversations does not automatically share an answer. This is a practical prototype boundary; a shared cache and stronger cache-key design would be needed at larger scale.",
        ],
      },
      {
        id: "challenges-and-tradeoffs",
        title: "Challenges & trade-offs",
        paragraphs: [
          "A model can produce a fluent answer with an unsupported link. The code combines grounding instructions with link filtering, while keeping the answer text available when a link is rejected. This favors a usable conversation but still requires answer-quality evaluation.",
          "Local state and model fallbacks simplify demonstrations, but persistence can diverge after failures and process-local limits can reset. Production hardening would require durable state, distributed quotas, explicit request timeouts and a tested handoff policy.",
        ],
      },
      {
        id: "results-and-evidence",
        title: "Results & evidence",
        paragraphs: [
          "The public repository contains the integrated client and backend, knowledge-source definitions, API examples and a recorded team demonstration. The contribution history links my work to specific retrieval, chat reliability and integration changes.",
          "The team placed second in the youth division of the 2026 YTP Hackathon, as listed in my résumé. No production user count, retrieval benchmark or latency improvement is claimed.",
        ],
      },
      {
        id: "lessons-learned",
        title: "Lessons learned",
        paragraphs: [
          "The most useful engineering boundary is between a generated answer, the evidence behind it and the action that follows. Returning provider and source information makes failures easier to explain and future evaluation easier to design.",
          "My next steps would be a labeled retrieval test set, answer-grounding checks, durable ingestion with resource freshness tracking, and integration tests for model failure, cold starts and counselor handoff. These are proposed improvements, not completed features.",
        ],
      },
    ],
    evidence: [
      {
        label: "Team scope & ownership",
        url: `${employaSource}/README.md#團隊與分工`,
        detail:
          "The README assigns backend and AI / RAG work jointly and names the other interface owners.",
      },
      {
        label: "Retrieval implementation",
        url: `${employaSource}/backend/src/engines/rag.ts`,
        detail:
          "Chunking, hashed token vectors, ranked retrieval, source-link filtering and generation fallback.",
      },
      {
        label: "Chat integration",
        url: `${employaSource}/backend/src/app/api/chat/messages/route.ts`,
        detail:
          "Conversation ownership, optional history persistence, rate limiting and reply orchestration.",
      },
      {
        label: "Contribution: chat reliability",
        url: `${employaRepo}/commit/565538335333c3c78536db521ffca06b3b346a18`,
        detail:
          "CdyTim commit covering memory, source links, rate guard and Gemini fallback; commit also records AI assistance.",
      },
      {
        label: "Contribution: retrieval & APIs",
        url: `${employaRepo}/commit/ae183b8046ee1c5fa470f97ace5f66a269bda179`,
        detail:
          "CdyTim commit introducing RAG, knowledge routes and client–backend integration.",
      },
      {
        label: "Recorded team demo",
        url: `${employaSource}/video1_ejDZQrM7.mp4`,
        detail:
          "Repository-hosted demonstration video. This is a recording, not a live service.",
      },
    ],
  },
  {
    slug: "ntu-grade-atlas",
    title: "NTU Grade Atlas",
    summary:
      "Turning fragmented public grade distributions into searchable, traceable course information.",
    year: 2026,
    role: "Full-stack developer",
    team: "Personal MVP; public changes authored by CdyTim",
    stack: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Playwright",
      "Recharts",
    ],
    category: ["Data", "Backend", "Full-stack"],
    featured: true,
    repository: atlasRepo,
    demo: "https://ntu-grade-atlas.vercel.app/",
    images: [
      {
        src: "/projects/ntu-grade-atlas.png",
        alt: "NTU Grade Atlas home page with course search and dataset summary",
        caption:
          "Live MVP homepage captured 10 October 2026. Counts reflect that snapshot, not usage metrics.",
      },
    ],
    status: "Public-data MVP",
    contribution:
      "Built the public-source ingestion flow, relational course model, query APIs and grade-distribution interface; iterated on duplicate records and search normalization.",
    visual: "atlas",
    architecture: [
      {
        label: "Public sources",
        detail:
          "CSV, JSON and publicly accessible HTML tables enter the importer.",
      },
      {
        label: "Normalize & persist",
        detail:
          "Source adapters write courses, offerings and grades through Prisma.",
      },
      {
        label: "Explore distributions",
        detail:
          "Next.js pages and read APIs expose PostgreSQL data and Recharts views.",
      },
      {
        label: "Contribution intake",
        detail:
          "An external Google Form collects submissions; its public sheet is an ingestion source.",
      },
    ],
    sections: [
      {
        id: "overview",
        title: "Overview",
        paragraphs: [
          "NTU Grade Atlas organizes course-level grade distributions so students can compare available public information without accessing individual student records. It is an MVP for exploration, not an official transcript service or a claim of production-scale adoption.",
          "The engineering work centers on making inconsistent source records useful: mapping columns, normalizing course and instructor identifiers, preserving provenance and presenting missing data honestly.",
        ],
      },
      {
        id: "my-role",
        title: "My role",
        paragraphs: [
          "I developed the Next.js application, PostgreSQL model and ingestion scripts. The public commit history records my changes to dynamic database queries, duplicate offerings, instructor-name normalization and invalid course-name handling.",
          "This case study describes the implementation available in the public repository. The live deployment is linked for inspection, but uptime and current data completeness are not guaranteed by the repository.",
        ],
      },
      {
        id: "problem-and-constraints",
        title: "Problem & constraints",
        paragraphs: [
          "Public grade data arrives as tables and spreadsheets with inconsistent headers, missing course codes and instructor names mixed with class numbers. Treating every row as a new course creates duplicate or misleading results.",
          "The project limits collection to publicly accessible sources and course-level distributions. The documented policy excludes login-only systems and personal grades. Source availability, permission and data quality still need review for each newly configured URL.",
        ],
      },
      {
        id: "architecture",
        title: "Architecture",
        paragraphs: [
          "The ingestion script reads configured public URLs, fetches CSV or JSON directly, and uses Playwright with Cheerio for HTML tables. Prisma writes normalized entities to PostgreSQL. Next.js server pages and read-only course APIs query those records for the UI.",
          "The schema separates Course, Instructor, Offering and GradeDistribution. ScrapeJob records import state; a Submission model exists, but the current submission page delegates intake to a Google Form rather than implementing an internal moderation workflow.",
        ],
      },
      {
        id: "data-flow",
        title: "Data flow",
        paragraphs: [
          "Each configured source creates a scrape job. The importer maps source-specific fields, normalizes semesters and course codes, separates instructor names from class numbers, and rejects empty or numeric-only course titles before upserting entities.",
          "An offering keeps its source URL and source type. The course query then normalizes search text, converts counts to percentages where enrollment is available, ranks duplicate records and paginates the displayed results. Charts consume the stored distributions.",
        ],
      },
      {
        id: "technical-implementation",
        title: "Technical implementation",
        paragraphs: [
          "Compound uniqueness expresses the difference between a course and a particular teaching offering. Upserts can revisit the same source without creating a new offering for every import. Grade distributions have their own offering-and-grade key.",
          "The importer also maps exported Google Form sheets and public Google Sheets URLs. Source jobs report failure when no reliable records can be parsed, though a successful job currently does not expose per-row rejection counts.",
        ],
        code: {
          language: "prisma",
          content:
            "// Offering\n@@unique([courseId, instructorId, semester, classNo])\n\n// GradeDistribution\n@@unique([offeringId, grade])",
          caption:
            "Two source schema excerpts: prisma/schema.prisma. Comments identify their models.",
        },
      },
      {
        id: "engineering-decisions",
        title: "Engineering decisions",
        paragraphs: [
          "A relational schema makes the course–instructor–semester relationship explicit, while source URLs keep a path back to the input. Dynamic database queries let the deployed interface reflect imported changes without generating a new static dataset.",
          "The MVP uses source-specific rules and application-side deduplication to repair visible data issues quickly. That keeps behavior understandable at small scale, but it also creates a clear future need for stronger normalization at ingestion.",
        ],
      },
      {
        id: "challenges-and-tradeoffs",
        title: "Challenges & trade-offs",
        paragraphs: [
          "Missing course codes require synthetic identifiers, which are not authoritative university identifiers. The confidence value stored during import is a fixed source heuristic; it is not a calibrated probability of correctness.",
          "The current query loads offerings before filtering, deduplicating, sorting and slicing in memory. This is a scale limitation, not database-level pagination. A next iteration should move appropriate filters into indexed queries and measure latency against a representative dataset.",
        ],
      },
      {
        id: "results-and-evidence",
        title: "Results & evidence",
        paragraphs: [
          "The repository provides three read APIs: /api/courses, /api/courses/[id] and /api/stats, alongside a deployed exploration interface, import scripts and database migrations. Commit history shows fixes for search and record quality after the initial MVP.",
          "Three parser unit tests cover percentage strings, empty values and grade columns. They demonstrate a testing starting point, not full ingestion or end-to-end coverage. No adoption, throughput or performance figures are claimed.",
        ],
      },
      {
        id: "lessons-learned",
        title: "Lessons learned",
        paragraphs: [
          "Data cleaning is part of the product experience: a duplicate offering or a malformed instructor name changes how useful a search result is. The commit history makes that connection visible through concrete fixes.",
          "The next steps are import fixtures covering source variations, per-row validation reports, transactional writes, versioned provenance and database query measurements. A complete review workflow and scheduled ingestion also need implementation and verification.",
        ],
      },
    ],
    evidence: [
      {
        label: "MVP scope & data policy",
        url: `${atlasSource}/README.md`,
        detail:
          "Public-source scope, setup, available APIs and the documented roadmap.",
      },
      {
        label: "Relational data model",
        url: `${atlasSource}/prisma/schema.prisma`,
        detail:
          "Course, instructor, offering, grade, submission and scrape-job records.",
      },
      {
        label: "Source ingestion",
        url: `${atlasSource}/scripts/scrape-public-sources.ts`,
        detail:
          "CSV / JSON / HTML adapters, normalization, Prisma upserts and scrape-job state.",
      },
      {
        label: "Query & deduplication",
        url: `${atlasSource}/lib/course-query.ts`,
        detail:
          "Search normalization, ranking of duplicates and application-side pagination.",
      },
      {
        label: "Parser tests",
        url: `${atlasSource}/tests/parser.test.ts`,
        detail: "The public suite contains three parser-focused test cases.",
      },
      {
        label: "Iteration history",
        url: `${atlasRepo}/commits/main/`,
        detail:
          "CdyTim-authored fixes for dynamic queries, duplicates and search behavior.",
      },
      {
        label: "Current submission flow",
        url: `${atlasSource}/app/submit/page.tsx`,
        detail:
          "External Google Form intake; do not confuse the schema with a completed moderation product.",
      },
    ],
  },
  {
    slug: "social-media-text-mining",
    title: "Social Media Text Mining",
    summary:
      "Studying how social discussion about AI products differs across Reddit and X.",
    year: 2025,
    role: "NLP pipeline contributor",
    team: "Four-person course research project",
    stack: ["Python", "PRAW", "Selenium", "RoBERTa", "Gensim LDA", "spaCy"],
    category: ["Data", "AI"],
    featured: false,
    repository: miningRepo,
    images: [],
    status: "Course research · report available",
    contribution:
      "My résumé describes work on text cleaning, sentence-level filtering, ambiguity handling and transformer-based sentiment classification. The public report documents the team pipeline, without establishing sole authorship of its code.",
    visual: "pipeline",
    architecture: [
      {
        label: "Collect & clean",
        detail:
          "The report describes Reddit and X collection, English text cleaning and sentence selection.",
      },
      {
        label: "Classify & model",
        detail:
          "Reported methods combine sentiment classification, disambiguation and LDA topics.",
      },
      {
        label: "Compare & interpret",
        detail:
          "Monthly sentiment summaries and platform comparisons appear in the team report.",
      },
    ],
    sections: [
      {
        id: "overview",
        title: "Overview",
        paragraphs: [
          "This course study compares discussion of ChatGPT, Gemini, Claude and Perplexity across Reddit and X. The team investigated sentiment, topic changes and their relationship to estimated product visits.",
          "The public repository contains a written report and presentation, not a runnable pipeline or released dataset. The architecture here summarizes the reported method.",
        ],
      },
      {
        id: "my-role",
        title: "My role",
        paragraphs: [
          "My résumé describes my work on the NLP pipeline: text cleaning, sentence-level filtering, ambiguity handling and transformer-based sentiment classification.",
          "The presentation lists me, 陳羿廷, 劉起佑 and 詹孟瑾 as the four team members. The public report establishes our shared research workflow; it does not assign every stage or establish full code authorship, so this remains a collaborative course project.",
        ],
      },
      {
        id: "problem-and-constraints",
        title: "Problem & constraints",
        paragraphs: [
          "A post may discuss several models, include quoted text or use “Gemini” to mean a zodiac sign. Sentiment analysis without target selection can attribute the wrong opinion to a product.",
          "Historical API availability, platform sampling and English-only processing limit representativeness. The report also identifies a narrow time-of-day bias in its X collection strategy.",
        ],
      },
      {
        id: "architecture",
        title: "Architecture",
        paragraphs: [
          "The documented pipeline has collection, cleaning, sentence selection, disambiguation, sentiment classification, topic modeling and aggregate analysis stages. It is a batch research workflow rather than a deployed service.",
          "The report names PRAW for Reddit, Selenium for X, transformer sentiment models, spaCy and NLTK preprocessing, and Gensim LDA. These are report-supported methods; their source implementation is not publicly available.",
        ],
      },
      {
        id: "data-flow",
        title: "Data flow",
        paragraphs: [
          "Collected text is cleaned and split into sentences, then filtered to retain relevant model context. Rules and a zero-shot classifier disambiguate AI-related Gemini discussion from astrology.",
          "Sentiment labels feed monthly positive-to-negative ratios. A separate tokenization and noun-selection flow builds the topic-model input, after which the team compares platforms and time periods.",
        ],
      },
      {
        id: "technical-implementation",
        title: "Technical implementation",
        paragraphs: [
          "The report compares Cardiff Twitter RoBERTa, DistilBERT SST-2 and an nlptown BERT model against a small manually labeled sentence set. It selects the Cardiff model based on the reported balance of overall performance and neutral-class recall.",
          "Topic analysis uses vocabulary-frequency filtering and Gensim LDA, with spaCy, NLTK and WordNet supporting preprocessing. The available evidence does not establish use of the Gemini API; Gemini is one of the studied product names.",
        ],
      },
      {
        id: "engineering-decisions",
        title: "Engineering decisions",
        paragraphs: [
          "Sentence-level selection reduces contamination when a long post discusses multiple products. Comparing candidate sentiment models on manually labeled examples gives a concrete basis for model selection.",
          "The topic pipeline focuses on nouns and proper nouns to surface recurring subjects. This narrows the representation and can discard useful context, so topics require qualitative interpretation.",
        ],
      },
      {
        id: "challenges-and-tradeoffs",
        title: "Challenges & trade-offs",
        paragraphs: [
          "The report uses only 100 manually labeled sentences for classifier evaluation. That is useful for an initial comparison but insufficient to establish general performance across products, platforms and time.",
          "Removing non-ASCII text excludes language communities, and dropping neutral sentiment from the positive-to-negative ratio changes what the metric measures. Correlations with estimated visits do not demonstrate causation.",
        ],
      },
      {
        id: "results-and-evidence",
        title: "Results & evidence",
        paragraphs: [
          "The deliverables are the public team report and slide deck. They document model comparisons, monthly sentiment analysis, topic interpretation and methodological limitations.",
          "No benchmark is presented here as independently reproduced, and no production performance is claimed. The report contains evaluation tables, but the missing code, labels and dataset prevent a reproducibility check.",
        ],
      },
      {
        id: "lessons-learned",
        title: "Lessons learned",
        paragraphs: [
          "Sampling decisions and target ambiguity can matter as much as classifier choice. A useful research result should expose those assumptions alongside its findings.",
          "A stronger engineering version would publish permitted, de-identified fixtures, a reproducible environment, annotation guidelines, split definitions and evaluation scripts.",
        ],
      },
    ],
    evidence: [
      {
        label: "Research report",
        url: miningReport,
        detail:
          "Methods, the small human-labeled evaluation, LDA analysis and explicit sampling limitations.",
      },
      {
        label: "Team presentation",
        url: miningSlides,
        detail:
          "The title page names Ding-Yuan Chen as a member of the four-person team.",
      },
      {
        label: "Published artifacts",
        url: `${miningRepo}/tree/a3cbb90`,
        detail:
          "The inspected revision contains two PDFs and no executable analysis code.",
      },
    ],
  },
  ...featuredProductCases,
  ...featuredEngineeringCases,
  waterMapCase,
];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
