import type { Project } from "./projects";
import type { ProjectTranslation } from "./project-translations";

const sigmileRepo = "https://github.com/goodmorning1226/SIGmile";
const sigmileSource = `${sigmileRepo}/blob/169c0ba7ca49c3b3087336e13ccebb88f9113772`;
const tomybabyRepo = "https://github.com/ntu-im-WebApp/sigma";
const tomybabySource = `${tomybabyRepo}/blob/02b325bf6c40ffbbc21ed9a1b5f7219196a00d98`;

/** Source-backed case studies. Personal scope and maturity follow the project reviews. */
export const featuredProductCases: Project[] = [
  {
    slug: "sigmile",
    title: "SIGmile",
    summary:
      "Connecting route planning, driver navigation and exception handling in a logistics competition prototype.",
    year: 2026,
    role: "Driver navigation & dispatch contributor",
    team: "Uni-President Business Competition team",
    stack: [
      "Next.js",
      "TypeScript",
      "Flutter",
      "Supabase",
      "TomTom",
      "Python",
      "Gurobi",
    ],
    category: ["Full-stack", "Backend", "Data"],
    featured: false,
    repository: sigmileRepo,
    images: [],
    status: "Team competition prototype",
    contribution:
      "Implemented TomTom navigation, urgent-dispatch ranking and emergency rerouting, then fixed task creation and stop-data integration within the team.",
    visual: "sigmile",
    architecture: [
      {
        label: "Manager workspace",
        detail:
          "Next.js presents route plans, dispatch candidates and delivery exceptions.",
      },
      {
        label: "Planning & dispatch",
        detail:
          "TypeScript services coordinate Python/Gurobi planning and rule-based route insertion.",
      },
      {
        label: "Tasks & identity",
        detail:
          "Supabase stores shared task data and supplies authenticated driver identity.",
      },
      {
        label: "Driver navigation",
        detail:
          "Flutter connects assigned stops, TomTom guidance and delivery-status updates.",
      },
    ],
    sections: [
      {
        id: "overview",
        title: "Overview",
        paragraphs: [
          "A delivery plan has to remain useful after a driver starts work. SIGmile connects a manager's route-planning workspace with a Flutter driver app, then adds ways to handle urgent shipments and a driver who can no longer finish a route.",
          "The team built the prototype for the 4th Uni-President Business Competition's J-Sheng Transportation track. My main contribution was the connection between the planned route and the navigation and dispatch decisions made during delivery.",
        ],
      },
      {
        id: "my-role",
        title: "My role",
        paragraphs: [
          "I implemented TomTom route parsing and map integration, including turn instructions, lane guidance and an external-navigation fallback. I also contributed urgent-dispatch ranking, emergency rerouting and the manager views that expose these workflows.",
          "A later change aligned stop metadata with the database schema and created a delivery task when the selected urgent-dispatch driver had none. These are authored contributions within a team platform; the Gurobi model is team work, and my commits retain AI coding co-author credits.",
        ],
      },
      {
        id: "problem-and-constraints",
        title: "Problem & constraints",
        paragraphs: [
          "Dispatch involves more than the closest driver. Vehicle capacity, temperature requirements, shifts and existing stops all affect whether an additional delivery is practical. A manager also needs an explanation for a recommendation and a way to handle stops that cannot be reassigned.",
          "The competition prototype had to work with configured mapping and solver services while remaining demonstrable when those services were unavailable. Its mock fallbacks, estimated driver positions and refresh-based dashboard are useful for a demo, but limit claims about live operations.",
        ],
      },
      {
        id: "architecture",
        title: "Architecture",
        paragraphs: [
          "The Next.js application hosts the manager interface and backend API. Supabase adapters connect driver profiles, delivery tasks and stops. The Flutter app consumes authenticated task APIs and uses TomTom to turn stop coordinates into navigation instructions.",
          "For daily planning, a TypeScript service builds the input and travel-time matrix, invokes the team's Python/Gurobi MTVRP solver through JSON stdin/stdout, and processes the resulting route plans. Urgent dispatch and emergency rerouting use separate heuristic services rather than rerunning the complete mathematical model for every decision.",
        ],
      },
      {
        id: "data-flow",
        title: "Data flow",
        paragraphs: [
          "An urgent shipment is compared with active drivers and their assigned stops. The service returns ranked candidates, estimated added distance and reasons such as available capacity or a temperature mismatch. After the manager chooses a driver, a separate apply step inserts the stop into that driver's task.",
          "When a driver becomes unavailable, the rerouting service reads the remaining stops, proposes assignments and separates unassignable stops for manual handling. Planning does not write those changes immediately; the manager confirms a plan before the apply endpoint updates the task records.",
        ],
      },
      {
        id: "technical-implementation",
        title: "Technical implementation",
        paragraphs: [
          "The TomTom adapter maps provider maneuver values into typed Dart instructions and associates lane information with route-point ranges. The resulting route session carries the polyline, estimated duration, distance and an explicit flag distinguishing a real route from the geometric fallback.",
          "Urgent-dispatch ranking combines distance, remaining capacity, shift and temperature matches, pending workload and urgency. Route insertion estimates the extra geographic distance between neighboring stops. Emergency rerouting filters incompatible candidates and records a reason when no driver can take a stop; these are inspectable heuristics, not learned AI predictions.",
        ],
      },
      {
        id: "engineering-decisions",
        title: "Engineering decisions",
        paragraphs: [
          "Keeping recommendations separate from application makes the manager's decision explicit. A ranked list can show trade-offs, while an emergency plan can retain unresolved stops instead of silently losing them or pretending every request has a feasible assignment.",
          "The navigation adapter also keeps provider-specific responses outside the main driver UI. For planning, the JSON process boundary lets TypeScript coordinate a Python solver without embedding optimization details in the web interface. These boundaries made distinct team contributions easier to integrate.",
        ],
      },
      {
        id: "challenges-and-tradeoffs",
        title: "Challenges & trade-offs",
        paragraphs: [
          "The exception-handling services estimate position from known stops and insertion cost from geographic distance. They do not establish live vehicle tracking or traffic-aware arrival guarantees. Urgent ranking also exposes mismatches as scores and reasons, so it should not be described as a complete feasibility guarantee.",
          "Urgent requests currently include in-memory state, and the reviewed repository does not contain the Supabase migrations referenced by its README. Reproducible database setup, durable request state and tests for concurrent dispatch updates remain necessary before a production rollout.",
        ],
      },
      {
        id: "results-and-evidence",
        title: "Results & evidence",
        paragraphs: [
          "The published source contains the manager and driver applications, the solver integration and my navigation and exception-handling changes. The demo guide documents the intended manager-to-driver workflow; no public live deployment or measured cost-saving result is claimed here.",
          "Our team won the J-Sheng Transportation track of the 4th Uni-President Business Competition in May 2026, as recorded in my résumé. The award is a team achievement; it is separate from any claim about the prototype's runtime performance or production adoption.",
        ],
      },
      {
        id: "lessons-learned",
        title: "Lessons learned",
        paragraphs: [
          "Connecting a recommendation to an actual delivery task exposed details that an isolated algorithm misses: a driver may have no task yet, stop data may live in another table, and some requests need manual intervention. I learned to treat those state transitions as part of the feature itself.",
          "My next step would be repeatable dispatch scenarios that check distance units, insertion order, capacity limits and plan-to-apply consistency, followed by a shared transaction boundary for task changes. Those checks would make future optimization comparisons meaningful.",
        ],
      },
    ],
    evidence: [
      {
        label: "Project scope & setup",
        url: `${sigmileSource}/README.md`,
        detail:
          "Manager/driver architecture, solver integration and documented mock behavior at the reviewed revision.",
      },
      {
        label: "My contribution: driver navigation",
        url: `${sigmileRepo}/commit/98dc27a1e4b3bd19664459861a020d037bfdda1a`,
        detail:
          "Authored TomTom integration, route guidance and navigation UI; the commit records AI assistance.",
      },
      {
        label: "My contribution: dispatch & rerouting",
        url: `${sigmileRepo}/commit/9118f72c1e2e6c4f203412655ba4aa7c30b152dc`,
        detail:
          "Authored manager insights, urgent-dispatch and emergency-rerouting workflows within the team project.",
      },
      {
        label: "My contribution: task-data integration",
        url: `${sigmileRepo}/commit/3da45f91ba68ae60ede3bf3f5db97e04a89548e3`,
        detail:
          "Aligns stop fields with the schema and creates a missing task for urgent dispatch.",
      },
      {
        label: "Urgent-dispatch implementation",
        url: `${sigmileSource}/apps/web/src/lib/services/urgent-dispatch-service.ts`,
        detail:
          "Candidate scoring, explanatory reasons, geographic insertion estimates and task updates.",
      },
      {
        label: "Emergency-rerouting implementation",
        url: `${sigmileSource}/apps/web/src/lib/services/emergency-reroute-service.ts`,
        detail:
          "Separate plan/apply operations, compatibility checks and explicit unassignable stops.",
      },
      {
        label: "Team solver integration",
        url: `${sigmileSource}/apps/web/src/lib/services/or-planning-service.ts`,
        detail:
          "Travel-time input, Python process contract, route-plan handling and identified mock fallback.",
      },
      {
        label: "Driver route adapter",
        url: `${sigmileSource}/apps/driver_app/lib/services/tomtom_routes_service.dart`,
        detail:
          "Typed maneuver and lane parsing, route sessions and fallback provenance.",
      },
    ],
  },
  {
    slug: "tomybaby",
    title: "ToMyBaby",
    summary:
      "A conversation-practice app connecting personal history, multi-session feedback and a speaking animated character.",
    year: 2026,
    role: "Authentication, reports & speech integration contributor",
    team: "NTU Information Management Web App course team",
    stack: [
      "React",
      "TypeScript",
      "Express",
      "PostgreSQL",
      "Gemini",
      "Web Audio",
      "Live2D",
    ],
    category: ["Full-stack", "Backend", "AI"],
    featured: false,
    repository: tomybabyRepo,
    demo: "https://tomybaby.vercel.app",
    images: [],
    status: "Team course project",
    contribution:
      "Implemented authentication, user-scoped history, multi-session reports and speech-to-Live2D integration; refined conversation setup and AI-status feedback.",
    visual: "tomybaby",
    architecture: [
      {
        label: "Practice interface",
        detail:
          "React manages profiles, scenarios, conversation turns and feedback views.",
      },
      {
        label: "Conversation API",
        detail:
          "Express connects Gemini, analysis, authentication and speech generation.",
      },
      {
        label: "Personal history",
        detail:
          "User-scoped repository methods support JSON or PostgreSQL persistence and reports.",
      },
      {
        label: "Voice & character",
        detail:
          "Browser playback and Web Audio amplitude drive Live2D mouth movement.",
      },
    ],
    sections: [
      {
        id: "overview",
        title: "Overview",
        paragraphs: [
          "ToMyBaby lets a user configure a conversation partner, choose a scenario and practice a dialogue before reviewing feedback. The course-team application combines text conversation, a speaking character and reports that bring several practice sessions together.",
          "The engineering challenge was making those features behave as one experience: a conversation belongs to the right user, repeated sessions become useful history, and the character's speech remains connected to the audio the user actually hears.",
        ],
      },
      {
        id: "my-role",
        title: "My role",
        paragraphs: [
          "I implemented registration and login, user-scoped history access, repository interfaces and initial JSON/PostgreSQL adapters. I also added multi-session report aggregation and the speech pipeline that connects the backend TTS proxy, browser audio and Live2D mouth movement.",
          "Later work included AI-status feedback, model-parameter compatibility and a fix for conversations where the user should speak first. Teammates also developed database, backend and chat features. The character models are third-party assets; my contribution is their integration, not their creation.",
        ],
      },
      {
        id: "problem-and-constraints",
        title: "Problem & constraints",
        paragraphs: [
          "A practice app needs continuity across sessions without mixing one user's records with another's. It also depends on services with different failure modes: a language model can be unavailable, a speech request can fail, and a character model may use different parameter names.",
          "The project supports local mock behavior for development and an HTTP backend for integrated use. Its six-axis feedback and trend labels are application heuristics; they have not been validated as measures of real-world communication ability.",
        ],
      },
      {
        id: "architecture",
        title: "Architecture",
        paragraphs: [
          "A React/TypeScript client calls an Express API for conversation, analysis, authentication and TTS. The active client selector chooses the HTTP service when configured and otherwise uses a local mock. Gemini integration sits behind the backend routes.",
          "History routes call repository interfaces instead of reading a storage format directly. The repository factory chooses PostgreSQL when DATABASE_URL is configured and JSON files otherwise. Report statistics and generated narrative are separate steps, while voice playback sends amplitude data to the Live2D renderer.",
        ],
      },
      {
        id: "data-flow",
        title: "Data flow",
        paragraphs: [
          "After login, history requests carry a bearer token. Authentication middleware resolves the user identity, and list, read, save and delete operations pass that identity into user-scoped repository methods. Saved analyses are grouped by conversation partner to build a report across sessions.",
          "For voiced replies, the browser requests audio from the TTS endpoint, receives a blob and starts playback through an audio element. A Web Audio analyser reads the signal during playback; its amplitude value is consumed by the character renderer on each animation frame.",
        ],
      },
      {
        id: "technical-implementation",
        title: "Technical implementation",
        paragraphs: [
          "The report aggregator sorts sessions by time, calculates per-axis averages and best scores, compares early and late sessions, and collects recurring observations. A separate request generates the report narrative, keeping the numerical aggregation inspectable without requiring another model call.",
          "For speech animation, the voice service averages low-frequency audio energy and maps it to a bounded mouth-opening signal. The renderer writes both modern and legacy Live2D mouth parameter names. This is amplitude-driven animation; the browser waits for the audio blob rather than playing an end-to-end live stream.",
        ],
      },
      {
        id: "engineering-decisions",
        title: "Engineering decisions",
        paragraphs: [
          "User identity is part of the repository method contract, so a history route cannot rely only on hiding another user's records in the interface. The same contract supports lightweight local storage and a PostgreSQL adapter without rewriting each route.",
          "Separating statistics from generated prose makes the report easier to reason about. For the conversation itself, I also treated the opening turn as explicit state: when the user chooses to speak first, the app leaves the conversation empty and withholds suggested replies until a real message exists.",
        ],
      },
      {
        id: "challenges-and-tradeoffs",
        title: "Challenges & trade-offs",
        paragraphs: [
          "Fallback visibility is still incomplete. The HTTP client does not carry the backend's fallback header into its status display, so a successful rule-based response may appear to be model output. A configured remote TTS request that fails also does not automatically retry with browser synthesis.",
          "JSON storage and localStorage bearer tokens simplify a course demo but need a different durability and session strategy for production. The reviewed tree also lacks a project test suite, so the next reliability work should exercise cross-user access, failed AI/TTS requests and repeated playback rather than assume the integrated flow is fully covered.",
        ],
      },
      {
        id: "results-and-evidence",
        title: "Results & evidence",
        paragraphs: [
          "The public repository includes the working feature code, authored contribution history, course report and screenshots of conversation and report views. These artifacts show what the team implemented; sample scores and session counts are not adoption or learning-outcome metrics.",
          "The repository advertises a Vercel demo, and its frontend shell was reachable during the October 2026 review. Login, live Gemini, speech and persistence were not exercised in that review, so the linked demo is not a claim that every service is currently available.",
        ],
      },
      {
        id: "lessons-learned",
        title: "Lessons learned",
        paragraphs: [
          "Integration details determine whether an AI feature feels coherent: whose history is loaded, who speaks first, when audio starts, and whether a fallback is labeled honestly. These questions led to clearer boundaries between identity, storage, generated content and presentation.",
          "I would next make fallback provenance part of the response contract, add deterministic tests for report aggregation and user-scoped access, and cover audio cancellation and retry behavior. Evaluating the usefulness of the feedback would require a separate study with users, not just higher scores in the app.",
        ],
      },
    ],
    evidence: [
      {
        label: "Project scope & setup",
        url: `${tomybabySource}/README.md`,
        detail:
          "Course application, user workflow and advertised demo; the case describes the checked implementation where documentation differs.",
      },
      {
        label: "My contribution: authentication & history",
        url: `${tomybabyRepo}/commit/dcc51c546b381cc9c9a6b90425ea9d6cb192d0fe`,
        detail:
          "Adds login, JWT authentication, user-scoped history and repository adapters; teammates subsequently extend persistence.",
      },
      {
        label: "My contribution: speech & Live2D",
        url: `${tomybabyRepo}/commit/b4b0de62e0fe1b2bd53c29eb747cf273eae92f83`,
        detail:
          "Adds the TTS proxy, browser voice service, character voice profiles and audio-driven mouth movement.",
      },
      {
        label: "My contribution: multi-session reports",
        url: `${tomybabyRepo}/commit/e4cbe17f711432443a747299ca18f71312ba3176`,
        detail:
          "Adds aggregation, report types, the report page and navigation from history and analysis.",
      },
      {
        label: "Report aggregation",
        url: `${tomybabySource}/src/utils/reportAggregation.ts`,
        detail:
          "Deterministic score summaries, session comparisons, recurring observations and scenario recommendations.",
      },
      {
        label: "Voice playback implementation",
        url: `${tomybabySource}/src/services/voice.ts`,
        detail:
          "Audio-blob playback, Web Audio analysis, cancellation and the current remote-error behavior.",
      },
      {
        label: "My contribution: opening-turn fix",
        url: `${tomybabyRepo}/commit/02b325bf6c40ffbbc21ed9a1b5f7219196a00d98`,
        detail:
          "Prevents an AI opener and premature suggestions when the user should speak first.",
      },
      {
        label: "Repository screenshots & asset credits",
        url: `${tomybabyRepo}/tree/02b325bf6c40ffbbc21ed9a1b5f7219196a00d98/docs/screenshots`,
        detail:
          "Actual product captures; external character and background credits are recorded in public/assets/CREDITS.md.",
      },
    ],
  },
];

export const featuredProductTranslations: Record<string, ProjectTranslation> = {
  sigmile: {
    title: "SIGmile",
    summary:
      "串接路線規劃、司機導航與異常處理，讓物流派遣從規劃延伸到配送現場。",
    role: "司機導航與派遣功能開發",
    team: "統一企業商業競賽團隊",
    status: "團隊競賽作品原型",
    contribution:
      "負責 TomTom 司機導航、急件派遣排序與緊急改派，並修正任務建立和停靠點資料串接問題。",
    images: [],
    architecture: [
      {
        label: "管理端介面",
        detail: "以 Next.js 呈現路線計畫、派遣候選人與配送異常。",
      },
      {
        label: "規劃與派遣服務",
        detail:
          "TypeScript 串接 Python／Gurobi 規劃，以及依規則執行的路線插入。",
      },
      {
        label: "任務與身分資料",
        detail: "透過 Supabase 共用配送任務，並確認司機登入身分。",
      },
      {
        label: "司機導航",
        detail: "Flutter 串起指派站點、TomTom 導航與配送狀態回報。",
      },
    ],
    sections: [
      {
        id: "overview",
        title: "專案介紹",
        paragraphs: [
          "配送計畫在司機出發後，仍需要能因應現場變化。SIGmile 將管理端的路線規劃與 Flutter 司機 App 串在一起，並加入急件派遣及司機無法繼續配送時的緊急改派流程。",
          "這是團隊參加第四屆統一企業商業競賽捷盛運輸組的作品。我主要負責把已規劃的路線接到實際配送流程，讓司機能導航，也讓主管能在途中調整派遣。",
        ],
      },
      {
        id: "my-role",
        title: "我的工作",
        paragraphs: [
          "我實作 TomTom 路線資料解析與地圖整合，包含轉彎提示、車道指引，以及開啟外部導航的備用方式；也參與急件派遣排序、緊急改派服務與管理端的操作介面。",
          "後續我修正停靠點資料與資料庫欄位的對應，並補上急件選定的司機尚未有配送任務時，自動建立任務的流程。這些是我在團隊中的具體貢獻；Gurobi 模型是團隊成果，我的提交也保留了 AI 程式協作紀錄。",
        ],
      },
      {
        id: "problem-and-constraints",
        title: "問題與限制",
        paragraphs: [
          "派車不能只看誰離得最近。車輛容量、配送溫層、班別與既有站點，都會影響司機是否適合接下新任務。主管也需要看懂推薦理由，並知道哪些站點仍需人工安排。",
          "競賽原型需要串接地圖與求解服務，也要能在服務未設定或無法使用時展示。因此系統保留模擬備援、位置估算與手動重新整理儀表板的方式；這些設計適合展示，尚不能視為正式營運能力。",
        ],
      },
      {
        id: "architecture",
        title: "系統架構",
        paragraphs: [
          "Next.js 同時提供管理端介面與後端 API，透過 Supabase 串接司機資料、配送任務及停靠點。Flutter App 呼叫需要登入驗證的任務 API，再透過 TomTom 將站點座標轉成導航指示。",
          "每日路線規劃由 TypeScript 服務整理輸入與行車時間矩陣，再以 JSON stdin/stdout 呼叫團隊的 Python／Gurobi MTVRP 求解器，處理回傳的路線方案。急件與緊急改派則由獨立的啟發式服務處理，不會每次都重新求解完整數學模型。",
        ],
      },
      {
        id: "data-flow",
        title: "資料處理流程",
        paragraphs: [
          "收到急件後，服務會比對可派遣司機與既有站點，回傳候選排序、預估增加的距離，以及容量是否充足、溫層是否相符等理由。主管選定司機後，再由另一個套用步驟把急件插入該司機的任務。",
          "司機無法繼續配送時，改派服務先讀取剩餘站點，提出分配方案，並將無法指派的站點列出供人工處理。規劃階段不立即改寫任務，而是等主管確認後，再由套用 API 更新紀錄。",
        ],
      },
      {
        id: "technical-implementation",
        title: "實作重點",
        paragraphs: [
          "TomTom 轉接層將導航動作轉成具型別的 Dart 指令，並依路線點的索引範圍對應車道資訊。路線結果包含折線、預估時間與距離，也明確標示資料來自真實路線服務，或只是幾何估算的備援結果。",
          "急件排序綜合考量距離、剩餘容量、班別、溫層、待配送工作量與急迫程度，再以相鄰站點間增加的地理距離估算插入成本。緊急改派會排除不符合條件的候選人，並記錄無人可接的原因。這些都是可檢查的啟發式規則，並非訓練出的 AI 預測。",
        ],
      },
      {
        id: "engineering-decisions",
        title: "技術選擇",
        paragraphs: [
          "我將提出建議與套用結果分開，保留主管做決定的步驟。候選清單可以呈現不同取捨，改派方案也能留下尚未解決的站點，避免系統看似完成指派，卻漏掉實際無法配送的任務。",
          "導航轉接層讓司機介面不必直接處理 TomTom 的原始回應；JSON 程序介面則讓 TypeScript 能協調 Python 求解器，不必把最佳化細節放進網頁元件。明確的介面也讓團隊不同部分更容易整合。",
        ],
      },
      {
        id: "challenges-and-tradeoffs",
        title: "挑戰與取捨",
        paragraphs: [
          "異常處理服務以已知站點估算司機位置，並用地理距離估算插入成本，尚未達到即時車輛追蹤或考量路況的到站時間保證。急件排序也會把不符條件的情況反映在分數與理由中，因此排名靠前不代表所有配送條件都已通過驗證。",
          "目前部分急件狀態仍存在記憶體中，公開版本也未包含 README 提及的 Supabase migration 檔案。正式上線前，仍需補齊可重建的資料庫設定、可靠的急件保存方式，以及多位主管同時派遣時的測試。",
        ],
      },
      {
        id: "results-and-evidence",
        title: "成果與紀錄",
        paragraphs: [
          "公開原始碼包含管理端、司機 App、求解器串接，以及我負責的導航與異常處理功能。展示文件也記錄了主管到司機的操作流程；目前沒有公開線上展示，也尚未提供可引用的成本節省量測。",
          "團隊於 2026 年 5 月獲得第四屆統一企業商業競賽捷盛運輸組冠軍，獲獎紀錄見個人履歷。這是團隊共同的成果，不代表原型已通過正式營運或效能驗證。",
        ],
      },
      {
        id: "lessons-learned",
        title: "心得與後續方向",
        paragraphs: [
          "把建議接到真正的配送任務後，才會遇到單獨寫演算法時容易忽略的細節：司機可能還沒有任務、站點資料可能存在另一張表，也可能真的找不到人接單。我因此更重視這些狀態轉換，而不只看排序結果。",
          "下一步我會建立可重複執行的派遣情境，檢查距離單位、插入順序、容量限制，以及規劃到套用之間的一致性，再將任務更新整合到同一個交易流程。先有這些基礎，後續比較最佳化效果才有意義。",
        ],
      },
    ],
    evidence: [
      {
        label: "專案範圍與設定",
        url: `${sigmileSource}/README.md`,
        detail: "記錄管理端、司機端、求解器串接，以及此版本的模擬備援方式。",
      },
      {
        label: "我的提交：司機導航",
        url: `${sigmileRepo}/commit/98dc27a1e4b3bd19664459861a020d037bfdda1a`,
        detail: "TomTom 串接、路線指引與導航介面；提交也保留 AI 協作紀錄。",
      },
      {
        label: "我的提交：派遣與改派",
        url: `${sigmileRepo}/commit/9118f72c1e2e6c4f203412655ba4aa7c30b152dc`,
        detail: "團隊專案中的管理端資訊、急件派遣與緊急改派流程。",
      },
      {
        label: "我的提交：任務資料串接",
        url: `${sigmileRepo}/commit/3da45f91ba68ae60ede3bf3f5db97e04a89548e3`,
        detail: "修正站點欄位對應，並補上急件派遣時缺少配送任務的情況。",
      },
      {
        label: "急件派遣實作",
        url: `${sigmileSource}/apps/web/src/lib/services/urgent-dispatch-service.ts`,
        detail: "候選評分、推薦理由、地理距離插入估算與任務更新。",
      },
      {
        label: "緊急改派實作",
        url: `${sigmileSource}/apps/web/src/lib/services/emergency-reroute-service.ts`,
        detail: "分開規劃與套用，檢查相容條件，並列出無法指派的站點。",
      },
      {
        label: "團隊求解器串接",
        url: `${sigmileSource}/apps/web/src/lib/services/or-planning-service.ts`,
        detail:
          "行車時間輸入、Python 程序介面、路線計畫處理與明確標示的模擬備援。",
      },
      {
        label: "司機路線轉接層",
        url: `${sigmileSource}/apps/driver_app/lib/services/tomtom_routes_service.dart`,
        detail: "具型別的轉彎與車道解析、路線資料，以及真實與備援來源的區分。",
      },
    ],
  },
  tomybaby: {
    title: "ToMyBaby",
    summary:
      "結合個人對話紀錄、多次練習的回饋與會說話的動畫角色，打造情境對話練習 App。",
    role: "登入、報告與語音整合開發",
    team: "台大資管 Web App 課程團隊",
    status: "團隊課程專題",
    contribution:
      "實作登入、個人對話紀錄與多次練習報告，串接語音和 Live2D，並改善對話開場與 AI 狀態提示。",
    images: [],
    architecture: [
      {
        label: "對話練習介面",
        detail: "React 管理角色設定、練習情境、對話輪次與回饋畫面。",
      },
      {
        label: "對話 API",
        detail: "Express 串接 Gemini、分析、登入驗證與語音生成。",
      },
      {
        label: "個人歷史紀錄",
        detail: "依使用者隔離資料存取，以 JSON 或 PostgreSQL 保存紀錄與報告。",
      },
      {
        label: "語音與角色",
        detail: "瀏覽器播放語音，透過 Web Audio 音量訊號驅動 Live2D 嘴型。",
      },
    ],
    sections: [
      {
        id: "overview",
        title: "專案介紹",
        paragraphs: [
          "ToMyBaby 讓使用者設定對話對象、選擇情境，完成練習後再查看回饋。這個課程團隊專題結合文字對話、會說話的動畫角色，以及彙整多次練習的綜合報告。",
          "實作上的挑戰，是讓這些功能串成一致的體驗：對話紀錄要屬於正確的使用者，多次練習要能累積成有用的歷史，而角色說話時的嘴型，也要跟使用者聽到的聲音連動。",
        ],
      },
      {
        id: "my-role",
        title: "我的工作",
        paragraphs: [
          "我實作註冊與登入、依使用者隔離的歷史紀錄存取，以及資料儲存介面和初版 JSON／PostgreSQL 實作。我也加入多次練習的報告彙整，並串接後端 TTS 代理、瀏覽器音訊與 Live2D 嘴型。",
          "後續工作包含 AI 狀態提示、不同模型參數命名的相容處理，以及使用者選擇先開口時的對話修正。資料庫、後端與聊天功能也有其他成員共同開發；角色模型來自第三方素材，我負責的是整合，而非模型創作。",
        ],
      },
      {
        id: "problem-and-constraints",
        title: "問題與限制",
        paragraphs: [
          "對話練習需要保留前後脈絡，又不能混用不同使用者的紀錄。同時，外部服務可能以不同方式失敗：語言模型無法回應、語音請求失敗，或角色模型採用另一套參數名稱。",
          "專案提供本機模擬模式供開發，並可透過 HTTP 串接後端。六項回饋分數與趨勢標籤來自應用程式的評分規則，目前尚未驗證它們能否反映真實生活中的溝通能力。",
        ],
      },
      {
        id: "architecture",
        title: "系統架構",
        paragraphs: [
          "React／TypeScript 前端呼叫 Express API，處理對話、分析、登入驗證與 TTS。現有的服務選擇器會在完成設定時使用 HTTP 後端，否則採用本機模擬；Gemini 則由後端路由串接。",
          "歷史紀錄路由透過資料存取介面操作，不直接依賴檔案格式。設定 DATABASE_URL 時使用 PostgreSQL，否則使用 JSON 檔案。報告統計與文字生成分成兩個步驟，語音播放則將音量訊號交給 Live2D 繪製元件。",
        ],
      },
      {
        id: "data-flow",
        title: "資料處理流程",
        paragraphs: [
          "登入後，歷史紀錄請求會附帶 bearer token。驗證中介層確認使用者身分，再將使用者 ID 傳入列表、讀取、儲存與刪除方法。已保存的分析結果依對話對象分組，用來產生跨次練習的報告。",
          "播放語音回覆時，瀏覽器向 TTS 端點取得音訊 blob，再透過 audio 元素播放。Web Audio 分析器在播放期間讀取訊號，角色繪製元件則在每一幀使用這個音量值更新嘴型。",
        ],
      },
      {
        id: "technical-implementation",
        title: "實作重點",
        paragraphs: [
          "報告彙整器依時間排序練習紀錄，計算各項平均與最佳分數，比較前後期表現，並整理重複出現的觀察。報告文字由另一個請求生成，因此不必再次呼叫模型，也能檢查數值是怎麼算出來的。",
          "語音服務計算低頻音訊能量的平均值，再轉成限定範圍內的嘴巴開合訊號。Live2D 元件同時寫入新舊兩套嘴型參數名稱，支援不同模型。這是依音量驅動的動畫；瀏覽器會等音訊 blob 下載完成後才播放，並非端到端即時串流。",
        ],
      },
      {
        id: "engineering-decisions",
        title: "技術選擇",
        paragraphs: [
          "我將使用者身分納入資料存取方法的必要參數，讓歷史紀錄的隔離不只依賴畫面隱藏。同一套介面也能支援本機檔案與 PostgreSQL，不必為了更換儲存方式重寫每條路由。",
          "把統計與生成文字分開，讓報告的結果更容易釐清。對話流程中，我也將誰先開口視為明確的狀態：使用者選擇先說話時，畫面應維持空白，等真正收到訊息後才顯示建議回覆。",
        ],
      },
      {
        id: "challenges-and-tradeoffs",
        title: "挑戰與取捨",
        paragraphs: [
          "目前備援狀態的呈現還不完整：HTTP 客戶端沒有將後端的 fallback header 帶到狀態提示，因此規則產生的成功回應可能被顯示成模型輸出。已設定的遠端 TTS 若請求失敗，也不會自動改用瀏覽器語音重試。",
          "JSON 儲存與放在 localStorage 的 bearer token 降低了課程展示的設定成本，但正式上線需要更可靠的資料保存與登入狀態管理。公開版本也缺少完整測試，因此後續應優先檢查跨使用者存取、AI／TTS 失敗與反覆播放等流程。",
        ],
      },
      {
        id: "results-and-evidence",
        title: "成果與紀錄",
        paragraphs: [
          "公開儲存庫保留功能實作、個人提交紀錄、課程報告，以及對話和綜合報告畫面的截圖。這些資料呈現團隊完成的功能；畫面中的範例分數與練習次數，不代表使用人數或學習成效。",
          "儲存庫提供 Vercel 展示網址，2026 年 10 月檢視時可讀取前端頁面。當時未操作登入、即時 Gemini、語音與資料保存流程，因此這個連結不代表所有服務目前都能完整使用。",
        ],
      },
      {
        id: "lessons-learned",
        title: "心得與後續方向",
        paragraphs: [
          "AI 功能能否形成連貫體驗，往往取決於整合細節：讀到誰的紀錄、由誰先說話、音訊何時開始，以及是否如實標示備援結果。這些問題讓我更清楚區分身分、資料保存、生成內容與畫面呈現的責任。",
          "下一步我會把備援來源納入 API 回應格式，補上報告統計與個人資料存取的可重複測試，並測試音訊取消和重試流程。至於回饋是否真的有幫助，需要另外進行使用者研究，不能只看 App 裡的分數變高。",
        ],
      },
    ],
    evidence: [
      {
        label: "專案範圍與設定",
        url: `${tomybabySource}/README.md`,
        detail:
          "課程專題、使用流程與展示網址；文件與程式不同之處，以本案例檢視的實作為準。",
      },
      {
        label: "我的提交：登入與歷史紀錄",
        url: `${tomybabyRepo}/commit/dcc51c546b381cc9c9a6b90425ea9d6cb192d0fe`,
        detail:
          "加入登入、JWT 驗證、個人歷史紀錄與資料存取介面；後續儲存功能也有隊友參與。",
      },
      {
        label: "我的提交：語音與 Live2D",
        url: `${tomybabyRepo}/commit/b4b0de62e0fe1b2bd53c29eb747cf273eae92f83`,
        detail: "加入 TTS 代理、瀏覽器語音服務、角色音色設定與音訊驅動的嘴型。",
      },
      {
        label: "我的提交：多次練習報告",
        url: `${tomybabyRepo}/commit/e4cbe17f711432443a747299ca18f71312ba3176`,
        detail: "加入統計彙整、報告型別、報告頁，以及歷史紀錄與分析頁的入口。",
      },
      {
        label: "報告統計實作",
        url: `${tomybabySource}/src/utils/reportAggregation.ts`,
        detail: "依固定規則計算分數摘要、前後期比較、重複觀察與練習情境建議。",
      },
      {
        label: "語音播放實作",
        url: `${tomybabySource}/src/services/voice.ts`,
        detail:
          "音訊 blob 播放、Web Audio 分析、取消流程與目前的遠端錯誤處理。",
      },
      {
        label: "我的提交：對話開場修正",
        url: `${tomybabyRepo}/commit/02b325bf6c40ffbbc21ed9a1b5f7219196a00d98`,
        detail: "使用者應先開口時，不讓 AI 搶先發話，也不提早顯示建議回覆。",
      },
      {
        label: "實際畫面與素材來源",
        url: `${tomybabyRepo}/tree/02b325bf6c40ffbbc21ed9a1b5f7219196a00d98/docs/screenshots`,
        detail:
          "儲存庫提供的產品截圖；角色與背景的第三方來源記錄於 public/assets/CREDITS.md。",
      },
    ],
  },
};
