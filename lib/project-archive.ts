/** Evidence and attribution: docs/PROJECT_INVENTORY.md and its linked project reviews. */
export type AdditionalProject = {
  id: string;
  title: { en: string; zh: string };
  summary: { en: string; zh: string };
  contribution: { en: string; zh: string };
  kind: { en: string; zh: string };
  stack: string[];
  repository?: string;
  evidence?: string;
  sourceLabel?: { en: string; zh: string };
  demo?: string;
};

export const featuredAdditionalProjectIds = [
  "sigmile",
  "tomybaby",
  "algorithm-visualizer",
  "lsap-jenkins-pipeline",
] as const;

export const additionalProjects: AdditionalProject[] = [
  {
    id: "sigmile",
    title: {
      en: "SIGmile — Logistics Optimization",
      zh: "SIGmile — 物流路線最佳化",
    },
    summary: {
      en: "A logistics prototype for the 4th Uni-President Business Competition’s J-Sheng track, connecting manager dispatch, driver tasks and multi-trip route planning.",
      zh: "第四屆統一企業商業競賽捷盛運輸組的團隊作品原型，整合管理端派車、司機任務與多趟次路線規劃。",
    },
    contribution: {
      en: "Implemented TomTom driver navigation, urgent dispatch and emergency rerouting within the team.",
      zh: "在團隊中負責 TomTom 司機導航、急件派遣與緊急改派功能。",
    },
    kind: {
      en: "Competition team · Champion",
      zh: "團隊競賽作品 · 冠軍",
    },
    stack: [
      "Next.js",
      "Flutter",
      "Python",
      "Gurobi",
      "MTVRP",
      "Supabase",
      "TomTom",
    ],
    repository: "https://github.com/goodmorning1226/SIGmile",
    evidence:
      "https://github.com/goodmorning1226/SIGmile/tree/169c0ba7ca49c3b3087336e13ccebb88f9113772",
    sourceLabel: {
      en: "Award from my résumé",
      zh: "獲獎紀錄見履歷",
    },
  },
  {
    id: "tomybaby",
    title: {
      en: "ToMyBaby — AI Conversation Practice",
      zh: "ToMyBaby — AI 對話練習",
    },
    summary: {
      en: "A course-team web app for scenario-based conversation practice, with AI feedback, animated characters and reports across multiple sessions.",
      zh: "Web App 課程的團隊專題，讓使用者透過情境模擬練習對話，結合 AI 回饋、動畫角色與多次練習的綜合報告。",
    },
    contribution: {
      en: "Implemented authentication, user-scoped history, report aggregation and speech-to-Live2D integration; refined conversation setup and AI-status feedback.",
      zh: "實作登入、個人對話紀錄與多次練習的報告彙整，串接語音和 Live2D，並改善對話開場流程及 AI 狀態提示。",
    },
    kind: {
      en: "Team course project",
      zh: "團隊課程專題",
    },
    stack: ["React", "TypeScript", "Express", "Gemini", "Web Audio", "Live2D"],
    repository: "https://github.com/ntu-im-WebApp/sigma",
    evidence:
      "https://github.com/ntu-im-WebApp/sigma/commit/b4b0de62e0fe1b2bd53c29eb747cf273eae92f83",
    demo: "https://tomybaby.vercel.app",
  },
  {
    id: "internship-radar",
    title: {
      en: "Internship Radar",
      zh: "實習雷達",
    },
    summary: {
      en: "A personal internship search and application tracker with public-job ingestion, explainable matching and web/native clients.",
      zh: "自行開發的實習搜尋工具，整合公開職缺、附有理由的配對建議與申請進度追蹤，提供網頁版與原生 App。",
    },
    contribution: {
      en: "Built and iterated the personal MVP; authored fixes for expired listings, login feedback, native connection and source freshness.",
      zh: "開發並持續調整 MVP，修正過期職缺判斷、登入提示、原生 App 連線與職缺資料更新問題。",
    },
    kind: {
      en: "Personal platform · private source",
      zh: "個人平台・原始碼未公開",
    },
    stack: ["Next.js", "FastAPI", "PostgreSQL", "Redis/Celery", "SwiftUI"],
    sourceLabel: {
      en: "Private repository reviewed",
      zh: "原始碼未公開",
    },
  },
  {
    id: "yaoshun-dashboard",
    title: {
      en: "Yaoshun Operations Dashboard",
      zh: "堯順工程行管理儀表板",
    },
    summary: {
      en: "A team operations dashboard for orders, delivery, payments and customer history, synchronized with a LINE bot through Firestore.",
      zh: "團隊開發的營運管理儀表板，集中處理訂單、出貨、收款與客戶紀錄，並透過 Firestore 與 LINE Bot 同步資料。",
    },
    contribution: {
      en: "Contributed Firestore integration, payment confirmation and delivery fields, customer lookup, dashboard workflows and AI-advisor UI.",
      zh: "參與 Firestore 串接、付款確認、出貨資料與客戶查詢功能，並調整儀表板操作流程及 AI 顧問介面。",
    },
    kind: {
      en: "Team application prototype",
      zh: "團隊應用原型",
    },
    stack: ["React", "TypeScript", "Firebase", "Firestore", "Gemini"],
    repository: "https://github.com/cpcap1214/IM2008",
    evidence: "https://github.com/cpcap1214/IM2008/commit/1b6bb6a0151e",
  },
  {
    id: "ntu-water-risk-map",
    title: {
      en: "NTU Water Risk Map",
      zh: "台大水資源問題地圖",
    },
    summary: {
      en: "A campus reporting prototype that compares shortest and weather-aware routes using OSM paths, weather inputs and local water-risk reports.",
      zh: "整合校園回報、OSM 路網與氣象資料的互動地圖原型，可比較最短路徑與考量雨天狀況的建議路線。",
    },
    contribution: {
      en: "Project integration and route-planning algorithms in a six-person course team.",
      zh: "在六人課程團隊中負責專案整合與路徑規劃演算法。",
    },
    kind: {
      en: "Course prototype",
      zh: "課程專題原型",
    },
    stack: ["Next.js", "TypeScript", "Leaflet", "Dijkstra", "Supabase"],
    repository: "https://github.com/CdyTim630/ntu_water_map",
    evidence:
      "https://github.com/CdyTim630/ntu_water_map/blob/87cce94ba07d3977733b61992ee9c44905348cb1/report/report.tex#L151-L165",
    demo: "https://ntuwatermap.vercel.app/",
  },
  {
    id: "convenience-store-meal-optimizer",
    title: {
      en: "Convenience-store Meal Optimizer",
      zh: "便利商店餐點推薦",
    },
    summary: {
      en: "An optimization coursework project connecting budget and nutrition constraints to a Flask interface, with Gurobi MILP and GRASP local search.",
      zh: "最佳化課程的團隊專題，依預算與營養條件推薦餐點，使用 Gurobi MILP 與 GRASP 區域搜尋求解，搭配 Flask 操作介面。",
    },
    contribution: {
      en: "Team member; published the initial optimization and web application code.",
      zh: "以團隊成員身分提交初版最佳化模型與網頁程式。",
    },
    kind: {
      en: "Team coursework",
      zh: "團隊課程專題",
    },
    stack: ["Python", "Gurobi", "GRASP", "Flask", "pandas"],
    repository: "https://github.com/CdyTim630/ntu114-2-or-final",
    evidence:
      "https://github.com/CdyTim630/ntu114-2-or-final/commit/4cc2186d194a1b88a4efb2872741b696738a322d",
  },
  {
    id: "lsap-jenkins-pipeline",
    title: {
      en: "Jenkins Delivery Pipeline",
      zh: "Jenkins 自動化部署流程",
    },
    summary: {
      en: "Branch-aware Docker delivery with development health checks, selected-image promotion and Discord failure notifications.",
      zh: "依 Git 分支建置及部署 Docker 映像，包含開發環境健康檢查、指定版本上線與 Discord 失敗通知。",
    },
    contribution: {
      en: "Implemented the pipeline and health endpoint beyond the course’s Express starter.",
      zh: "以課程提供的 Express 範例為基礎，加入部署流程與健康檢查 API。",
    },
    kind: {
      en: "Individual coursework",
      zh: "個人課程實作",
    },
    stack: ["Jenkins", "Docker", "Node.js", "Discord"],
    repository: "https://github.com/CdyTim630/lsap-cicd-example-app",
    evidence:
      "https://github.com/CdyTim630/lsap-cicd-example-app/blob/d649e5d218d0e985ab43d910c9c2d9dab4701b1d/Jenkinsfile",
  },
  {
    id: "hedgedoc-pdf-export",
    title: {
      en: "HedgeDoc PDF Export",
      zh: "HedgeDoc PDF 匯出功能",
    },
    summary: {
      en: "Browser-assisted PDF export for a collaborative Markdown editor, with renderer coordination and print-layout fixes for images and page breaks.",
      zh: "為協作 Markdown 編輯器加入 PDF 匯出功能，在瀏覽器列印前調整渲染模式，改善圖片顯示、分頁與輸出版面。",
    },
    contribution: {
      en: "Implemented PDF export and print styles in the team fork; also designed the project slides.",
      zh: "在團隊維護的 HedgeDoc 分支中實作 PDF 匯出與列印樣式，也負責專題簡報設計。",
    },
    kind: {
      en: "Team fork contribution",
      zh: "團隊專題・開源軟體功能擴充",
    },
    stack: ["TypeScript", "React", "SCSS", "Browser printing"],
    repository: "https://github.com/IM-LaoSAPi/hedgedoc",
    evidence:
      "https://github.com/IM-LaoSAPi/hedgedoc/commit/c13154eeb9280f6397d77b0b6561561041af1c0e",
  },
  {
    id: "algorithm-visualizer",
    title: {
      en: "Algorithm Visualizer",
      zh: "演算法互動視覺化",
    },
    summary: {
      en: "Step through sorting, graph search and dynamic programming with synchronized pseudocode, editable examples and selectable quicksort pivots.",
      zh: "逐步呈現排序、圖搜尋與動態規劃的執行過程，搭配同步虛擬碼、自訂範例及快速排序 pivot 選擇。",
    },
    contribution: {
      en: "Built interactive lessons and iterated input controls, graph views and themes.",
      zh: "實作互動教學模組，持續調整輸入操作、圖形呈現與主題切換。",
    },
    kind: {
      en: "Interactive learning tool",
      zh: "互動教學工具",
    },
    stack: ["React", "TypeScript", "Vite", "Framer Motion"],
    repository: "https://github.com/CdyTim630/algorithm-visualizer",
    evidence:
      "https://github.com/CdyTim630/algorithm-visualizer/tree/b900deddb45b3516094ba3451086a092257fd2fc/src/modules",
    demo: "https://cdytim630.github.io/algorithm-visualizer/",
  },
  {
    id: "city-fragments",
    title: {
      en: "City Fragments",
      zh: "城市碎片",
    },
    summary: {
      en: "A mock-backed Flutter journaling prototype with a city exploration map, collections, a capture flow and social-card previews.",
      zh: "以 Flutter 製作的生活手帳原型，使用模擬資料展示城市探索地圖、收藏圖鑑、生活記錄與社群卡片預覽。",
    },
    contribution: {
      en: "Built the prototype with AI assistance, reusable Cupertino components and repository interfaces.",
      zh: "在 AI 輔助下開發原型，建立可重用的 Cupertino 元件與資料存取介面。",
    },
    kind: {
      en: "AI-assisted UI prototype",
      zh: "AI 輔助開發的介面原型",
    },
    stack: ["Flutter", "Dart", "Cupertino", "flutter_map"],
    repository: "https://github.com/CdyTim630/personal_handbook",
    evidence:
      "https://github.com/CdyTim630/personal_handbook/commit/79a2292aba263082a0b562c63e995b7722404246",
  },
  {
    id: "pdao-2026",
    title: {
      en: "PDAO 2026 Problem Setting",
      zh: "PDAO 2026 程式競賽命題",
    },
    summary: {
      en: "Four contest problems exploring grid reasoning, shortest-path graph DP, functional-graph binary lifting and number-theoretic optimization.",
      zh: "設計四道程式競賽題目，涵蓋網格推理、最短路徑與圖上 DP、functional graph 倍增法及數論最佳化。",
    },
    contribution: {
      en: "Authored problem statements, constraints, sample cases and C++ reference solutions; calibrated edge cases.",
      zh: "撰寫題目敘述、限制條件、範例與 C++ 參考解答，並檢查及調整邊界案例。",
    },
    kind: {
      en: "Contest problem setting",
      zh: "競賽命題",
    },
    stack: ["C++", "Graph DP", "Binary lifting", "Number theory"],
    sourceLabel: {
      en: "Private repository reviewed; role from résumé",
      zh: "原始碼未公開；命題經歷見履歷",
    },
  },
  {
    id: "ntu-im-website",
    title: {
      en: "NTU IM Student Association Website",
      zh: "台大資管系學會網站",
    },
    summary: {
      en: "Ongoing website support for departmental information and student resources, with attention to layout consistency and usability.",
      zh: "協助維護資管系學會網站，整理系上資訊與學生資源，改善頁面結構、版面一致性及操作體驗。",
    },
    contribution: {
      en: "Contributed upload-guideline dialogs and branding updates; supported design, maintenance and content coordination as an Information Department member.",
      zh: "以資訊部成員身分參與網站設計、維護與內容協調，加入上傳說明視窗並更新品牌視覺。",
    },
    kind: {
      en: "Student association service",
      zh: "系學會服務",
    },
    stack: ["React", "React Router", "Material UI", "i18next"],
    demo: "https://ntu.im",
    sourceLabel: {
      en: "Service role from my résumé",
      zh: "系學會經歷見履歷",
    },
    repository: "https://github.com/cpcap1214/NTUIM",
    evidence:
      "https://github.com/cpcap1214/NTUIM/commit/7f146c1734c99dedd45225ab201441af9b669693",
  },
  {
    id: "ntu-im-orientation-2025",
    title: {
      en: "NTU IM Orientation Camp 2025",
      zh: "2025 台大資管迎新宿營",
    },
    summary: {
      en: "Website coordination alongside the planning and on-site delivery of a departmental orientation camp.",
      zh: "參與迎新宿營籌備與現場執行，並協調活動網站開發。",
    },
    contribution: {
      en: "Deputy general coordinator, supporting program planning, logistics and camp website development.",
      zh: "擔任副總召，協調活動設計、行政後勤與宿營網站開發。",
    },
    kind: {
      en: "Event and website coordination",
      zh: "活動與網站協作",
    },
    stack: ["Website coordination", "Event operations"],
    demo: "https://www.ntupipcamp2025.com/",
    sourceLabel: {
      en: "From my résumé",
      zh: "經歷介紹見履歷",
    },
  },
  {
    id: "nasa-systems-course",
    title: {
      en: "Network & System Administration Labs",
      zh: "網路與系統管理實作",
    },
    summary: {
      en: "Linux and networking coursework covering VLANs, DNS/DHCP, firewalls, storage, permissions and services in VM and container environments.",
      zh: "在虛擬機與容器環境中完成 Linux 與網路管理實作，涵蓋 VLAN、DNS／DHCP、防火牆、儲存空間、權限及服務設定。",
    },
    contribution: {
      en: "Completed hands-on administration labs and documented configuration and troubleshooting work.",
      zh: "完成系統管理實作，記錄設定步驟與除錯過程。",
    },
    kind: {
      en: "Systems coursework",
      zh: "系統課程實作",
    },
    stack: ["Linux", "Networking", "Docker", "Virtual machines"],
    repository: "https://github.com/CdyTim630/NASA2025-fall",
    evidence:
      "https://github.com/CdyTim630/NASA2025-fall/tree/63800df44c594d3d4e743d823e7ca77762215ce5",
    sourceLabel: {
      en: "From my résumé",
      zh: "經歷介紹見履歷",
    },
  },
  {
    id: "one-more-time",
    title: {
      en: "One More Time",
      zh: "One More Time 動作遊戲",
    },
    summary: {
      en: "A third-person Unity combat prototype with dodge-and-counter timing, staged boss encounters, coordinated cameras and bilingual menus.",
      zh: "以 Unity 製作的第三人稱動作遊戲原型，包含閃避反擊、多階段頭目戰、鏡頭演出與中英文選單。",
    },
    contribution: {
      en: "Developed and integrated combat, presentation and localization with AI assistance; added a WebGL delivery workflow and leaderboard retry handling.",
      zh: "在 AI 輔助下開發並整合戰鬥、演出與多語系功能，加入 WebGL 建置流程，並處理排行榜請求失敗後的重試。",
    },
    kind: {
      en: "Personal game prototype",
      zh: "個人遊戲原型",
    },
    stack: ["Unity 6", "C#", "URP", "Unity Localization", "WebGL"],
    sourceLabel: {
      en: "Private source · Prototype",
      zh: "原始碼未公開・原型作品",
    },
  },
  {
    id: "laughing-jianghu",
    title: {
      en: "Laughing Jianghu",
      zh: "笑嗷江糊：不講武德大會",
    },
    summary: {
      en: "A single-player strategy prototype with seeded tournament simulation, timed interventions and rule tests, using AI-generated art.",
      zh: "採用 AI 生成美術的單人策略遊戲原型，以隨機種子控制錦標賽模擬，結合限時干預機制與規則測試。",
    },
    contribution: {
      en: "Implemented simulation and game presentation; integrated a collaborator’s tournament UI and support charts.",
      zh: "實作賽事模擬與遊戲畫面，並整合協作者製作的賽程介面及支持度圖表。",
    },
    kind: {
      en: "Game prototype",
      zh: "遊戲原型",
    },
    stack: ["Godot", "GDScript", "Web export"],
    repository: "https://github.com/CdyTim630/laughing-jianghu-godot",
    evidence:
      "https://github.com/CdyTim630/laughing-jianghu-godot/tree/92ab517cc5127c4e2345af4c263ffd88540a13dd",
    demo: "https://cdytim630.itch.io/laughing-jianghu",
  },
  {
    id: "2048-browser-game",
    title: {
      en: "2048",
      zh: "2048 方塊遊戲",
    },
    summary: {
      en: "A small browser-game implementation with keyboard and touch controls, score tracking and one-step undo.",
      zh: "可用鍵盤或觸控操作的瀏覽器小遊戲，支援分數紀錄與單步復原。",
    },
    contribution: {
      en: "Implemented the single-page game state and interface in plain JavaScript.",
      zh: "以原生 JavaScript 實作遊戲邏輯、狀態管理與操作介面。",
    },
    kind: {
      en: "Browser experiment",
      zh: "瀏覽器小遊戲",
    },
    stack: ["JavaScript", "HTML", "CSS"],
    repository: "https://github.com/CdyTim630/2048game",
    evidence:
      "https://github.com/CdyTim630/2048game/blob/49c990223609a327d92f450ca0a4babddd9d02b3/index.html",
    demo: "https://cdytim630.github.io/2048game/",
  },
];

export const featuredAdditionalProjects = featuredAdditionalProjectIds.flatMap(
  (id) => additionalProjects.filter((project) => project.id === id),
);
