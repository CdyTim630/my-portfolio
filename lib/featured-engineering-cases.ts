import type { Project } from "./projects";
import type { ProjectTranslation } from "./project-translations";

const algorithmRepo = "https://github.com/CdyTim630/algorithm-visualizer";
const algorithmSource = `${algorithmRepo}/blob/b900deddb45b3516094ba3451086a092257fd2fc`;
const deliveryRepo = "https://github.com/CdyTim630/lsap-cicd-example-app";
const deliverySource = `${deliveryRepo}/blob/d649e5d218d0e985ab43d910c9c2d9dab4701b1d`;

const algorithmLinks = {
  modules: `${algorithmSource}/src/App.tsx`,
  sorting: `${algorithmSource}/src/modules/Sorting/SortingModule.tsx`,
  controls: `${algorithmSource}/src/components/ControlBar.tsx`,
  pseudocode: `${algorithmSource}/src/components/PseudocodeDisplay.tsx`,
  dynamicProgramming: `${algorithmSource}/src/modules/DynamicProgramming/DPModule.tsx`,
  graph: `${algorithmSource}/src/modules/Graph/GraphModule.tsx`,
  dijkstra: `${algorithmSource}/src/modules/Dijkstra/DijkstraModule.tsx`,
  pivotCommit: `${algorithmRepo}/commit/f89d6f7aeac2107cf21d294423170de050ee24ca`,
  inputCommit: `${algorithmRepo}/commit/251cb77855895b6b5234d942aa7681d251d40dd2`,
};

const deliveryLinks = {
  pipeline: `${deliverySource}/Jenkinsfile`,
  health: `${deliverySource}/app.js`,
  image: `${deliverySource}/Dockerfile`,
  package: `${deliverySource}/package.json`,
  config: `${deliverySource}/deploy.config`,
  initialCommit: `${deliveryRepo}/commit/3e9292ff8fddef8be049e010b0501cf54d87e981`,
  healthCommit: `${deliveryRepo}/commit/4d7ab2df769ed3ae61e61af4b6498f2dbd0bf6e6`,
  revertCommit: `${deliveryRepo}/commit/d649e5d218d0e985ab43d910c9c2d9dab4701b1d`,
};

const stepExcerpt =
  "description: string;\npseudocodeLine: number;\ncomparisons: number;\nswaps: number;\nround: number;";
const promotionExcerpt =
  'sh "docker pull ${IMAGE_NAME}:${targetTag}"\nsh "docker tag ${IMAGE_NAME}:${targetTag} ${IMAGE_NAME}:${prodTag}"\nsh "docker push ${IMAGE_NAME}:${prodTag}"';

/** Source-reviewed cases; external applications and pipelines were not executed. */
export const featuredEngineeringCases: Project[] = [
  {
    slug: "algorithm-visualizer",
    title: "Algorithm Visualizer",
    summary:
      "An interactive algorithm lab that connects each change in state to a diagram, an explanation and a line of pseudocode.",
    year: 2026,
    role: "Frontend development & learning interactions",
    team: "Personal project",
    stack: ["React", "TypeScript", "Vite", "Framer Motion", "Tailwind CSS"],
    category: ["Frontend", "Data"],
    featured: false,
    repository: algorithmRepo,
    demo: "https://cdytim630.github.io/algorithm-visualizer/",
    images: [],
    status: "Interactive learning tool",
    contribution:
      "Implemented the lesson interfaces and step playback, then added custom examples, selectable quicksort pivots, graph editing and theme refinements.",
    visual: "algorithms",
    architecture: [
      {
        label: "Choose an example",
        detail:
          "Lesson controls accept arrays, knapsack parameters or an editable graph.",
      },
      {
        label: "Generate steps",
        detail:
          "Algorithm functions record state snapshots, explanations and pseudocode positions.",
      },
      {
        label: "Control playback",
        detail:
          "React state selects the current step; shared controls support stepping, reset and speed.",
      },
      {
        label: "See the reasoning",
        detail:
          "Bars, tables and graphs render alongside the highlighted pseudocode line.",
      },
    ],
    sections: [
      {
        id: "overview",
        title: "Overview",
        paragraphs: [
          "A finished sorted array hides the comparisons and decisions that produced it. This project makes those intermediate states visible, so a learner can pause, move backward and connect the diagram to the algorithm’s instructions.",
          "The React application includes sorting, dynamic programming, graph traversal, binary search, Dijkstra, topological sorting and a complexity lesson. It is a browser-based learning tool; no classroom adoption or measured learning improvement is claimed.",
        ],
      },
      {
        id: "my-role",
        title: "My role",
        paragraphs: [
          "I built and iterated the frontend and teaching interactions. My public commits show the initial application, merge-sort visualization, selectable quicksort pivots, custom DP and graph controls, and later light-theme fixes for graph nodes and DP cells.",
        ],
      },
      {
        id: "problem-and-constraints",
        title: "Problem & constraints",
        paragraphs: [
          "An animation is difficult to follow if its diagram, explanation and pseudocode drift apart. The interface needs a consistent step boundary, controls that pause at meaningful decisions, and inputs small enough to remain readable.",
          "The lessons run entirely in the browser and store generated steps in memory. The design favors small, inspectable examples over large input processing; the comparison and swap counters describe the illustrated run rather than a runtime benchmark.",
        ],
      },
      {
        id: "architecture",
        title: "Architecture",
        paragraphs: [
          "A Vite/React shell selects a lesson and provides theme and teaching-mode contexts. Each lesson owns its input, step generator and visualization, while ControlBar and PseudocodeDisplay supply common playback and code-highlighting interfaces.",
          "For sorting, each SortStep carries an array snapshot, highlighted indices, an explanation and a pseudocode line. Merge sort adds tree snapshots; quicksort adds partition and pivot-selection state. Framer Motion animates the rendered state changes.",
        ],
      },
      {
        id: "data-flow",
        title: "Data flow",
        paragraphs: [
          "Choosing an algorithm or changing its input regenerates the lesson’s steps. A current-step index drives the visual state, text and pseudocode highlight together. Play advances that index on a timer; previous, next and reset provide direct control.",
          "Manual quicksort pauses when a partition needs a pivot. A click records the chosen index for that range, regenerates steps using the accumulated choices, and continues toward the next unresolved partition. This turns the pivot from a hidden implementation choice into an interactive decision.",
        ],
      },
      {
        id: "technical-implementation",
        title: "Technical implementation",
        paragraphs: [
          "Sorting covers bubble, selection, merge and quicksort. Step records copy the current array and include comparison/swap counts; merge-tree snapshots expose the split-and-merge structure. PseudocodeDisplay receives the selected step’s line number rather than running a separate animation timeline.",
          "The DP lesson includes stair counting and 0/1 knapsack, with one- and two-dimensional knapsack views. The graph lesson supports editable nodes and edges, directed/undirected traversal, and adjacency views. These inputs let learners explore examples beyond a fixed recording.",
        ],
        code: {
          language: "typescript",
          content: stepExcerpt,
          caption:
            "Fields excerpted from SortStep in SortingModule.tsx. The full type also stores the array and highlighted indices; these fields keep explanations and playback aligned.",
        },
      },
      {
        id: "engineering-decisions",
        title: "Engineering decisions",
        paragraphs: [
          "Recording snapshots makes previous-step navigation straightforward: the view selects an earlier state instead of reversing every operation. It also gives the visualizer and pseudocode a shared reference point, at the cost of storing copies of intermediate data.",
          "Reusable controls keep the lessons familiar while allowing algorithm-specific views. Manual pivots and editable examples make alternative decisions visible; the source does not establish whether those interactions improve learning outcomes.",
        ],
      },
      {
        id: "challenges-and-tradeoffs",
        title: "Challenges & trade-offs",
        paragraphs: [
          "The lesson components contain both algorithm generation and interface state. This makes a small prototype easy to navigate, but extracting pure generators would make invariants and edge cases easier to test. No automated test suite was found in the reviewed tree.",
          "Precomputed array and table snapshots grow with the number of steps. The Dijkstra lesson also selects the next node by scanning the nodes, not with a heap. Its educational implementation should not be presented as an optimized graph-processing engine.",
        ],
      },
      {
        id: "results-and-evidence",
        title: "Results & evidence",
        paragraphs: [
          "The public source contains the lesson modules, reusable controls and pseudocode renderer, with commits showing the pivot and custom-input iterations. The repository declares a GitHub Pages demo. This review inspected source and history without running the application or measuring correctness, performance or learning outcomes.",
        ],
      },
      {
        id: "lessons-learned",
        title: "Lessons learned",
        paragraphs: [
          "Making an algorithm explainable requires more than moving shapes: each frame needs enough state to explain what changed and why. Treating that state as an explicit step record is the central design choice in this tool.",
          "A next iteration would extract pure step generators, test final results and intermediate invariants, check keyboard and screen-reader interaction, and measure memory use on larger examples. Those are proposed improvements, not completed validation.",
        ],
      },
    ],
    evidence: [
      {
        label: "Application & lesson modules",
        url: algorithmLinks.modules,
        detail: "Lesson selection, shared contexts and the actual module list.",
      },
      {
        label: "Sorting step model",
        url: algorithmLinks.sorting,
        detail: "Snapshots, merge-tree state and interactive quicksort pivots.",
      },
      {
        label: "Playback controls",
        url: algorithmLinks.controls,
        detail: "Previous/next, play/pause, reset and playback speed.",
      },
      {
        label: "Pseudocode synchronization",
        url: algorithmLinks.pseudocode,
        detail: "Highlights the line supplied by the current lesson state.",
      },
      {
        label: "Dynamic programming examples",
        url: algorithmLinks.dynamicProgramming,
        detail: "Stair counting and editable 0/1 knapsack in 1D and 2D views.",
      },
      {
        label: "Editable graphs",
        url: algorithmLinks.graph,
        detail: "Node/edge editing, direction controls and traversal steps.",
      },
      {
        label: "Dijkstra implementation",
        url: algorithmLinks.dijkstra,
        detail:
          "Inspect the linear minimum-node selection and distance updates.",
      },
      {
        label: "My pivot-selection commit",
        url: algorithmLinks.pivotCommit,
        detail: "CdyTim-authored change adding quicksort pivot choice.",
      },
      {
        label: "My custom-input commit",
        url: algorithmLinks.inputCommit,
        detail: "CdyTim-authored iteration on DP and graph customization.",
      },
    ],
  },
  {
    slug: "lsap-jenkins-pipeline",
    title: "Jenkins Delivery Pipeline",
    summary:
      "A course pipeline that builds a development image, checks its HTTP health endpoint and promotes a selected Docker image through versioned configuration.",
    year: 2025,
    role: "CI/CD pipeline & container deployment",
    team: "Individual coursework on a provided Express starter",
    stack: ["Jenkins", "Groovy", "Docker", "Node.js", "Express", "Discord"],
    category: ["Backend"],
    featured: false,
    repository: deliveryRepo,
    images: [],
    status: "Course delivery pipeline",
    contribution:
      "Implemented the Jenkinsfile, Docker packaging, health endpoint and deployment configuration, then iterated container connectivity, image promotion and failure notifications.",
    visual: "delivery",
    architecture: [
      {
        label: "Branch & configuration",
        detail:
          "The branch selects the flow; deploy.config identifies the image to promote.",
      },
      {
        label: "Jenkins checks",
        detail:
          "Static analysis runs first; the dev branch builds and publishes a Docker image.",
      },
      {
        label: "Container deployment",
        detail:
          "Development deployment receives a health check; main deploys a selected image.",
      },
      {
        label: "Failure visibility",
        detail:
          "The pipeline’s failure handler sends build context to Discord.",
      },
    ],
    sections: [
      {
        id: "overview",
        title: "Overview",
        paragraphs: [
          "This Linux System Administration Practice assignment turns an Express starter into a branch-aware delivery exercise. Jenkins builds a development image, deploys it for a smoke check, and uses a separate configuration-driven path to promote an existing image.",
          "The project demonstrates a concrete release workflow and its failure signals. Development and production are the assignment’s environment names; the case does not claim a live production service or verified availability.",
        ],
      },
      {
        id: "my-role",
        title: "My role",
        paragraphs: [
          "I extended the course-provided application with a Jenkinsfile, Dockerfile, lint command, health endpoint and deployment-tag configuration. My commits record fixes for pipeline syntax, notification formatting and container connectivity, followed by promotion and configuration-revert changes. The Express starter predates my work.",
        ],
      },
      {
        id: "problem-and-constraints",
        title: "Problem & constraints",
        paragraphs: [
          "The workflow needs to distinguish building a candidate from selecting a release. It also needs to detect an unreachable development container and make failures visible without requiring someone to keep the Jenkins page open.",
          "The implementation assumes a Jenkins agent with Node.js, Docker access, registry credentials and connectivity to the containers. It replaces containers on a single Docker host; it does not implement an orchestrator or a zero-downtime rollout.",
        ],
      },
      {
        id: "architecture",
        title: "Architecture",
        paragraphs: [
          "A declarative Jenkins pipeline runs static analysis, then chooses a branch-specific stage. The dev branch builds and pushes a dev-build-number image to Docker Hub before replacing the development container. Registry authentication uses Jenkins credential binding.",
          "The main branch reads deploy.config, pulls the selected image, retags and pushes it with a production build tag, then replaces the production container. A post-failure handler sends the job, build, branch and status context to Discord.",
        ],
      },
      {
        id: "data-flow",
        title: "Data flow",
        paragraphs: [
          "On dev, npm install and npm run lint precede the image build. After deployment, the pipeline waits five seconds, obtains the container’s Docker-network IP and calls /health with curl -f. A failing request fails the build; the endpoint itself only returns HTTP 200 with OK.",
          "On main, a committed image tag determines what is pulled and promoted. The application is not rebuilt in the promotion stage. The configuration history includes a move to dev-13 and a revert to dev-12, showing an explicit release selection rather than an automatic recovery mechanism.",
        ],
      },
      {
        id: "technical-implementation",
        title: "Technical implementation",
        paragraphs: [
          "Jenkins when conditions separate the dev and main paths. Development deploys the Express container on host port 8081; the production-named container uses 8082. Docker inspect supplies the internal address for the development health request.",
          "Promotion is a pull–retag–push sequence driven by deploy.config. The Discord integration is limited to the failure handler. Although the starter includes Jest/Supertest material, this Jenkinsfile runs lint and the development smoke check, not a Jest test stage.",
        ],
        code: {
          language: "groovy",
          content: promotionExcerpt,
          caption:
            "The promotion commands from Jenkinsfile. targetTag comes from deploy.config; this stage reuses an existing image rather than rebuilding it.",
        },
      },
      {
        id: "engineering-decisions",
        title: "Engineering decisions",
        paragraphs: [
          "Separating image construction from promotion makes the selected artifact explicit and keeps release changes reviewable in Git. The configuration can also be reverted, but that requires an intentional change and pipeline run; it is not automatic rollback.",
          "A small HTTP endpoint makes connectivity observable without coupling the check to the page content. It remains a process-level smoke check, not a test of dependencies or complete application behavior. Failure notifications complement the Jenkins logs rather than replacing them.",
        ],
      },
      {
        id: "challenges-and-tradeoffs",
        title: "Challenges & trade-offs",
        paragraphs: [
          "A fixed five-second wait can be too short or unnecessarily long, and the production path has no equivalent health gate. Removing the old container before starting the new one also allows interruption. Image tags are configurable rather than digest-pinned, and promotion does not independently require a recorded successful development check.",
          "The historical image uses Node 14 and a single-stage Dockerfile. The public pipeline also embeds a Discord webhook value, unlike its credential-bound registry login. Reusing this setup would first require rotating that webhook, moving it into Jenkins credentials and updating the runtime; no credential value is reproduced here.",
        ],
      },
      {
        id: "results-and-evidence",
        title: "Results & evidence",
        paragraphs: [
          "The repository and authored commits document a complete course workflow: lint, development image build and smoke checking, selected-image promotion, and failure notification. The health and promotion-revert commits make the iterations inspectable. This review did not run Jenkins or contact a registry or webhook; no deployment-time reduction, production uptime or test-pass metric is claimed.",
        ],
      },
      {
        id: "lessons-learned",
        title: "Lessons learned",
        paragraphs: [
          "A deployment command finishing is different from the application being ready. This exercise made that distinction concrete through the health endpoint and container-network debugging, while versioned release selection made the intended image easier to trace.",
          "A next iteration would use a supported runtime, reproducible dependency installation, a real test stage, bounded readiness retries and a production health gate. Digest-pinned promotion and an explicitly tested recovery path would strengthen release control. These are proposed improvements beyond the submitted pipeline.",
        ],
      },
    ],
    evidence: [
      {
        label: "Branch-aware pipeline",
        url: deliveryLinks.pipeline,
        detail:
          "Lint, development build/check, main-branch promotion and failure-only notification.",
      },
      {
        label: "Health endpoint",
        url: deliveryLinks.health,
        detail: "The Express /health route returns a simple HTTP 200 response.",
      },
      {
        label: "Historical container image",
        url: deliveryLinks.image,
        detail: "Single-stage Node 14 packaging; a documented limitation.",
      },
      {
        label: "Application scripts",
        url: deliveryLinks.package,
        detail: "Start/lint scripts and a placeholder test command.",
      },
      {
        label: "Selected release tag",
        url: deliveryLinks.config,
        detail: "deploy.config supplies the image tag for promotion.",
      },
      {
        label: "My initial pipeline commit",
        url: deliveryLinks.initialCommit,
        detail:
          "Introduces the personal pipeline work beyond the course starter.",
      },
      {
        label: "My health-check contribution",
        url: deliveryLinks.healthCommit,
        detail: "Adds the endpoint used by the development smoke check.",
      },
      {
        label: "Configuration revert",
        url: deliveryLinks.revertCommit,
        detail: "Reverts an image-selection change; not automatic rollback.",
      },
    ],
  },
];

export const featuredEngineeringTranslations: Record<
  string,
  ProjectTranslation
> = {
  "algorithm-visualizer": {
    title: "演算法互動視覺化",
    summary:
      "把演算法的每一步變化，連到圖形、文字說明與虛擬碼，讓抽象流程可以操作、停下來觀察。",
    role: "前端開發與教學互動設計",
    team: "個人專案",
    status: "互動學習工具",
    contribution:
      "我開發教學介面與步驟播放功能，陸續加入自訂範例、快速排序的 pivot 選擇、圖形編輯，以及主題樣式調整。",
    images: [],
    architecture: [
      {
        label: "設定範例",
        detail: "輸入陣列、調整背包問題參數，或編輯圖的節點與邊。",
      },
      {
        label: "產生步驟",
        detail: "演算法記錄每一步的狀態快照、說明與對應的虛擬碼位置。",
      },
      {
        label: "控制播放",
        detail: "以 React 狀態選取目前步驟，支援逐步操作、重置與速度調整。",
      },
      {
        label: "觀察推導過程",
        detail: "同步呈現長條圖、表格或圖形，並標示正在執行的虛擬碼。",
      },
    ],
    sections: [
      {
        id: "overview",
        title: "專案介紹",
        paragraphs: [
          "只看排序完成的陣列，很難理解中間做了哪些比較與選擇。這個專案把過程拆成可觀察的步驟，讓使用者暫停、往回看，再把圖形變化對照到演算法指令。",
          "React 應用包含排序、動態規劃、圖形走訪、二分搜尋、Dijkstra、拓樸排序與複雜度教學。目前定位是瀏覽器互動學習工具，沒有課堂使用或學習成效量測可供引用。",
        ],
      },
      {
        id: "my-role",
        title: "我的工作",
        paragraphs: [
          "我負責前端與教學互動的開發及迭代。公開提交紀錄包含初版應用、合併排序視覺化、快速排序的 pivot 選擇、自訂 DP 與圖形操作，以及後續針對亮色模式的節點與 DP 表格修正。",
        ],
      },
      {
        id: "problem-and-constraints",
        title: "問題與限制",
        paragraphs: [
          "如果圖形、文字說明與虛擬碼各自播放，使用者很容易跟丟進度。因此，介面需要一致的步驟切分、能在關鍵選擇停下來的控制，以及小到足以清楚呈現的範例。",
          "所有教學都在瀏覽器執行，產生的步驟也保存在記憶體。設計重點是看懂小型範例，而非處理大量輸入；畫面上的比較與交換次數描述的是該次示範，不能當成執行效能測試。",
        ],
      },
      {
        id: "architecture",
        title: "系統架構",
        paragraphs: [
          "Vite／React 主介面負責切換教學模組，並共用主題與教學模式的 Context。各模組管理自己的輸入、步驟產生器與視覺化，ControlBar 和 PseudocodeDisplay 則提供共用的播放控制與程式碼標示。",
          "排序模組以 SortStep 記錄陣列快照、強調顯示的位置、文字說明與虛擬碼行號。合併排序另外保存樹狀結構，快速排序則記錄分區與 pivot 選擇狀態，再由 Framer Motion 呈現畫面的轉換。",
        ],
      },
      {
        id: "data-flow",
        title: "資料處理流程",
        paragraphs: [
          "切換演算法或修改輸入後，模組會重新產生步驟。畫面、說明與虛擬碼都讀取同一個步驟索引；自動播放透過計時器推進，也能用上一步、下一步和重置直接操作。",
          "快速排序的手動模式會在需要選 pivot 時暫停。使用者點選後，系統記錄該分區的選擇，再依累積的選擇重新產生步驟，繼續往下一個待決定的分區前進，讓原本藏在程式裡的決策變成可操作的過程。",
        ],
      },
      {
        id: "technical-implementation",
        title: "實作重點",
        paragraphs: [
          "排序模組涵蓋泡沫、選擇、合併與快速排序。每一步會複製陣列狀態，記錄比較與交換次數；合併排序另以樹狀快照呈現拆分及合併。虛擬碼直接使用目前步驟的行號，不另外維護一條動畫時間軸。",
          "DP 模組包含爬樓梯與 0/1 背包，背包可切換一維與二維解法。圖形模組能編輯節點與邊，切換有向、無向走訪，並查看相鄰關係。使用者可以修改範例，而不只觀看固定的動畫。",
        ],
        code: {
          language: "typescript",
          content: stepExcerpt,
          caption:
            "節錄自 SortingModule.tsx 的 SortStep 欄位。完整型別另含陣列與標示位置，讓說明、虛擬碼及播放進度保持一致。",
        },
      },
      {
        id: "engineering-decisions",
        title: "技術選擇",
        paragraphs: [
          "保存狀態快照後，回到上一步只需選取較早的紀錄，不必反向還原每個操作。圖形與虛擬碼也因此有共同依據；代價是需要保留多份中間資料。",
          "共用控制列讓不同教學維持熟悉的操作方式，同時保留各演算法適合的呈現。手動 pivot 和自訂範例能展示不同選擇的結果，但目前沒有研究證明這些互動能提升學習成效。",
        ],
      },
      {
        id: "challenges-and-tradeoffs",
        title: "挑戰與取捨",
        paragraphs: [
          "目前演算法步驟與介面狀態放在同一個教學元件內，小型原型容易追查，但若把步驟產生器抽成純函式，就能更方便地測試不變條件與邊界案例。檢視的版本尚未包含自動化測試。",
          "預先保存的陣列與表格快照，會隨步驟增加而占用更多記憶體。Dijkstra 模組也是逐一掃描節點來找最小距離，並未使用 heap；這是教學用實作，不能視為經過效能最佳化的圖運算引擎。",
        ],
      },
      {
        id: "results-and-evidence",
        title: "成果與紀錄",
        paragraphs: [
          "公開原始碼包含教學模組、共用控制列與虛擬碼元件，提交紀錄也能追查 pivot 選擇及自訂輸入的迭代。儲存庫提供 GitHub Pages 展示網址；本次僅檢視原始碼與歷史，未執行應用，也未量測正確性、效能或學習成效。",
        ],
      },
      {
        id: "lessons-learned",
        title: "心得與後續方向",
        paragraphs: [
          "讓演算法容易理解，不只是把圖形動起來。每個畫面都要有足夠資訊，說明改了什麼、為什麼改；將這些資訊整理成明確的步驟紀錄，是這個工具最核心的設計。",
          "下一步是抽出純函式的步驟產生器，測試最終結果與中間狀態，檢查鍵盤和螢幕閱讀器操作，並量測較大範例的記憶體使用。這些目前仍是後續規劃。",
        ],
      },
    ],
    evidence: [
      {
        label: "應用與教學模組",
        url: algorithmLinks.modules,
        detail: "查看教學切換、共用 Context 與實際包含的模組。",
      },
      {
        label: "排序步驟模型",
        url: algorithmLinks.sorting,
        detail: "包含狀態快照、合併樹與快速排序的互動 pivot 選擇。",
      },
      {
        label: "播放控制",
        url: algorithmLinks.controls,
        detail: "提供上一步、下一步、播放、暫停、重置與速度調整。",
      },
      {
        label: "虛擬碼同步",
        url: algorithmLinks.pseudocode,
        detail: "依目前教學步驟傳入的行號，標示對應的虛擬碼。",
      },
      {
        label: "動態規劃範例",
        url: algorithmLinks.dynamicProgramming,
        detail: "包含爬樓梯與可調整的一維、二維 0/1 背包範例。",
      },
      {
        label: "圖形編輯",
        url: algorithmLinks.graph,
        detail: "包含節點與邊的編輯、方向設定，以及走訪步驟。",
      },
      {
        label: "Dijkstra 實作",
        url: algorithmLinks.dijkstra,
        detail: "可查看逐一掃描最小距離節點與更新距離的過程。",
      },
      {
        label: "我的提交：pivot 選擇",
        url: algorithmLinks.pivotCommit,
        detail: "加入快速排序的 pivot 選擇操作。",
      },
      {
        label: "我的提交：自訂範例",
        url: algorithmLinks.inputCommit,
        detail: "擴充 DP 與圖形模組的自訂操作。",
      },
    ],
  },
  "lsap-jenkins-pipeline": {
    title: "Jenkins 自動化部署流程",
    summary:
      "從開發映像建置、HTTP 健康檢查，到用版本設定選擇 Docker 映像部署，完成一套課程部署流程。",
    role: "CI/CD 流程與容器部署",
    team: "個人課程實作，基於課程提供的 Express 範例",
    status: "課程部署實作",
    contribution:
      "我實作 Jenkinsfile、Docker 打包、健康檢查端點與部署設定，並修正容器連線、指定版本上線及失敗通知的問題。",
    images: [],
    architecture: [
      {
        label: "分支與版本設定",
        detail: "依分支選擇流程，由 deploy.config 指定要部署的映像。",
      },
      {
        label: "Jenkins 檢查",
        detail: "先執行靜態分析，再由 dev 分支建置並發布 Docker 映像。",
      },
      {
        label: "容器部署",
        detail: "開發環境部署後檢查健康端點，main 分支則部署指定映像。",
      },
      {
        label: "失敗通知",
        detail: "流程失敗時，將建置資訊傳送到 Discord。",
      },
    ],
    sections: [
      {
        id: "overview",
        title: "專案介紹",
        paragraphs: [
          "這份 Linux 系統管理實務作業，以課程提供的 Express 範例練習依分支自動部署。Jenkins 先建置開發映像、部署並檢查服務，再透過獨立的設定流程，選擇既有映像進行部署。",
          "專案重點是具體的發布流程與失敗訊號。開發環境與正式環境是作業中的命名，不代表已有正式營運服務，也沒有可用率量測可供引用。",
        ],
      },
      {
        id: "my-role",
        title: "我的工作",
        paragraphs: [
          "我在課程範例上加入 Jenkinsfile、Dockerfile、lint 指令、健康檢查端點與部署標籤設定。提交紀錄保留了流程語法、通知格式、容器連線的修正，以及後續的版本上線和設定還原。Express 範例本身是課程提供的起點。",
        ],
      },
      {
        id: "problem-and-constraints",
        title: "問題與限制",
        paragraphs: [
          "部署流程需要分開處理「產生候選版本」與「選擇發布版本」，也要能發現開發容器無法連線，並在失敗時主動通知，而不必一直盯著 Jenkins 頁面。",
          "這份實作假設 Jenkins agent 已有 Node.js、Docker 存取權、映像倉庫憑證，且能連到容器。部署是在單一 Docker 主機上替換容器，沒有容器編排或不中斷服務的更新機制。",
        ],
      },
      {
        id: "architecture",
        title: "系統架構",
        paragraphs: [
          "宣告式 Jenkins pipeline 先執行靜態分析，再依分支進入不同階段。dev 分支用建置編號產生映像標籤，推送到 Docker Hub 後替換開發容器；倉庫登入使用 Jenkins 的憑證綁定。",
          "main 分支讀取 deploy.config，拉取指定映像，重新標記並推送正式版本標籤，再替換正式環境容器。流程失敗時，post failure 區塊會把工作、建置、分支與狀態資訊送到 Discord。",
        ],
      },
      {
        id: "data-flow",
        title: "資料處理流程",
        paragraphs: [
          "dev 分支先執行 npm install 與 npm run lint，再建置映像。部署後等待五秒，取得容器在 Docker 網路中的 IP，並以 curl -f 呼叫 /health；請求失敗就讓建置失敗。這個端點只回傳 HTTP 200 與 OK，屬於基本存活檢查。",
          "main 分支依提交的映像標籤決定發布版本，上線階段不重新建置應用。設定歷史中可看到選用 dev-13 後又還原為 dev-12，呈現的是明確的版本選擇，而非自動故障回復。",
        ],
      },
      {
        id: "technical-implementation",
        title: "實作重點",
        paragraphs: [
          "Jenkins 的 when 條件區分 dev 與 main 流程。開發容器對應主機的 8081 埠，正式環境容器使用 8082；開發環境的健康檢查則透過 Docker inspect 取得容器內部位址。",
          "版本上線由 deploy.config 驅動，依序執行 pull、重新標記與 push。Discord 只通知失敗事件；雖然原始範例包含 Jest／Supertest 相關檔案，這份 Jenkinsfile 只執行 lint 和開發環境基本檢查，沒有 Jest 測試階段。",
        ],
        code: {
          language: "groovy",
          content: promotionExcerpt,
          caption:
            "節錄自 Jenkinsfile 的指定版本上線指令。targetTag 來自 deploy.config，這個階段沿用既有映像，不重新建置應用。",
        },
      },
      {
        id: "engineering-decisions",
        title: "技術選擇",
        paragraphs: [
          "把映像建置與發布選擇分開，能明確指定要部署的版本，也讓變更保留在 Git 紀錄中。設定可以還原，但仍需主動修改並執行流程，並非自動回復。",
          "獨立的 HTTP 端點讓連線檢查不必依賴首頁內容。不過，它只能確認服務程序有回應，無法驗證相依服務或完整功能。Discord 失敗通知則補足提醒，詳細原因仍要回到 Jenkins 紀錄查看。",
        ],
      },
      {
        id: "challenges-and-tradeoffs",
        title: "挑戰與取捨",
        paragraphs: [
          "固定等待五秒可能不夠，也可能造成多餘等待；正式環境更沒有對應的健康檢查。先刪除舊容器再啟動新容器，也可能中斷服務。此外，版本以可變動的標籤指定，尚未固定映像 digest，上線時也不會另外確認開發環境是否曾檢查成功。",
          "這份歷史實作用 Node 14 與單階段 Dockerfile 打包。倉庫登入已綁定 Jenkins 憑證，但 Discord webhook 仍直接寫在公開流程檔中；若要重新使用，應先更換 webhook、改用憑證管理並更新執行環境。本案例不轉載任何憑證值。",
        ],
      },
      {
        id: "results-and-evidence",
        title: "成果與紀錄",
        paragraphs: [
          "公開程式碼與提交紀錄呈現了完整的課程流程：lint、開發映像建置與基本檢查、指定指定版本上線，以及失敗通知。健康端點與設定還原的提交，也保留了迭代過程。本次未執行 Jenkins，也未連接倉庫或 webhook，因此不宣稱部署時間改善、正式環境可用率或測試通過數據。",
        ],
      },
      {
        id: "lessons-learned",
        title: "心得與後續方向",
        paragraphs: [
          "部署指令完成，不等於應用已經能用。健康端點與容器網路的除錯，讓我具體理解這個差別；把發布版本寫進設定檔，也讓預期部署的映像更容易追查。",
          "下一步是更新到仍受支援的執行環境、固定依賴安裝方式、加入真正的測試階段，並用有限次數的就緒重試取代固定等待。正式環境健康檢查、以 digest 固定映像與經過測試的回復流程，也都是尚待完成的改進。",
        ],
      },
    ],
    evidence: [
      {
        label: "分支部署流程",
        url: deliveryLinks.pipeline,
        detail: "包含 lint、開發環境建置與檢查、main 分支部署，以及失敗通知。",
      },
      {
        label: "健康檢查端點",
        url: deliveryLinks.health,
        detail: "Express 的 /health 路由回傳簡單的 HTTP 200 回應。",
      },
      {
        label: "歷史容器設定",
        url: deliveryLinks.image,
        detail: "以 Node 14 單階段打包，是這份實作仍待更新的部分。",
      },
      {
        label: "應用指令",
        url: deliveryLinks.package,
        detail: "可查看 start、lint，以及尚未接上實際測試的指令。",
      },
      {
        label: "發布版本設定",
        url: deliveryLinks.config,
        detail: "deploy.config 指定要部署的映像標籤。",
      },
      {
        label: "我的提交：初版流程",
        url: deliveryLinks.initialCommit,
        detail: "在課程範例上加入個人實作的部署流程。",
      },
      {
        label: "我的提交：健康檢查",
        url: deliveryLinks.healthCommit,
        detail: "加入開發環境基本檢查使用的端點。",
      },
      {
        label: "設定還原紀錄",
        url: deliveryLinks.revertCommit,
        detail: "還原映像版本的選擇，不代表已實作自動回復。",
      },
    ],
  },
};
