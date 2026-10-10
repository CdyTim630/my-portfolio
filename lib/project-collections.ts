/** Editorial groupings only; source evidence remains in project-archive.ts. */
export const projectCollections = [
  {
    id: "products",
    label: { en: "AI & Products", zh: "AI 與應用開發" },
    symbol: "✦",
    note: { en: "Ideas made useful.", zh: "網頁、App 與 AI 應用開發。" },
  },
  {
    id: "data",
    label: { en: "Data & Algorithms", zh: "資料分析與演算法" },
    symbol: "⌁",
    note: {
      en: "Find the pattern. Work the problem.",
      zh: "最佳化、資料處理與演算法實作。",
    },
  },
  {
    id: "systems",
    label: { en: "Systems & DevOps", zh: "系統與部署" },
    symbol: ">_",
    note: {
      en: "Behind the scenes, into service.",
      zh: "Linux、網路管理與自動化部署。",
    },
  },
  {
    id: "community",
    label: { en: "Campus & Community", zh: "校園與社群" },
    symbol: "↗",
    note: {
      en: "Built around the people nearby.",
      zh: "校園服務、系學會網站與活動籌備。",
    },
  },
  {
    id: "play",
    label: { en: "Games & Experiments", zh: "遊戲與實驗" },
    symbol: "✳",
    note: {
      en: "Room to play. Reasons to try.",
      zh: "遊戲原型與互動功能實驗。",
    },
  },
] as const;

export type ProjectCollectionId = (typeof projectCollections)[number]["id"];
type GalleryMeta = {
  category: ProjectCollectionId;
  mark: string;
  teaser: { en: string; zh: string };
};

export const projectGalleryMeta: Record<string, GalleryMeta> = {
  sigmile: {
    category: "data",
    mark: "↗",
    teaser: {
      en: "Dispatch, delivery and the route between them.",
      zh: "整合派車、配送任務與物流路線規劃。",
    },
  },
  tomybaby: {
    category: "products",
    mark: "♡",
    teaser: {
      en: "A place to practice the next conversation.",
      zh: "用 AI 模擬對話，練習表達並取得回饋。",
    },
  },
  "internship-radar": {
    category: "products",
    mark: "◎",
    teaser: {
      en: "Find the opportunity. Keep track of the next step.",
      zh: "整合實習職缺搜尋、配對與申請進度。",
    },
  },
  "yaoshun-dashboard": {
    category: "products",
    mark: "▥",
    teaser: {
      en: "Orders, deliveries and payments in one workspace.",
      zh: "集中管理訂單、出貨、收款與客戶資料。",
    },
  },
  "ntu-water-risk-map": {
    category: "community",
    mark: "⌖",
    teaser: {
      en: "A campus map that considers the rain.",
      zh: "整合校園回報與天氣資訊，規劃雨天路線。",
    },
  },
  "convenience-store-meal-optimizer": {
    category: "data",
    mark: "∑",
    teaser: {
      en: "Balance the lunch budget with nutrition.",
      zh: "依預算與營養需求，搭配便利商店餐點。",
    },
  },
  "lsap-jenkins-pipeline": {
    category: "systems",
    mark: "→",
    teaser: {
      en: "From a commit to a checked Docker deployment.",
      zh: "自動建置、檢查並部署 Docker 映像。",
    },
  },
  "hedgedoc-pdf-export": {
    category: "products",
    mark: "¶",
    teaser: {
      en: "Help Markdown make the jump onto the page.",
      zh: "改善 Markdown 匯出 PDF 時的圖片與分頁。",
    },
  },
  "algorithm-visualizer": {
    category: "data",
    mark: "{ }",
    teaser: {
      en: "See an algorithm think, one step at a time.",
      zh: "逐步播放排序、圖搜尋與動態規劃的過程。",
    },
  },
  "city-fragments": {
    category: "products",
    mark: "◈",
    teaser: {
      en: "A Flutter sketchbook for exploring the city.",
      zh: "結合地圖探索與收藏記錄的 Flutter 手帳原型。",
    },
  },
  "pdao-2026": {
    category: "data",
    mark: "?",
    teaser: {
      en: "Four problems, carefully chosen edge cases.",
      zh: "設計競賽題目，撰寫解答並檢查邊界情況。",
    },
  },
  "ntu-im-website": {
    category: "community",
    mark: "im",
    teaser: {
      en: "A shared home for student information.",
      zh: "參與資管系學會網站的設計、維護與更新。",
    },
  },
  "ntu-im-orientation-2025": {
    category: "community",
    mark: "↟",
    teaser: {
      en: "An orientation, from the website to the campsite.",
      zh: "協調宿營籌備、活動執行與網站開發。",
    },
  },
  "nasa-systems-course": {
    category: "systems",
    mark: "⌘",
    teaser: {
      en: "Linux services, networks and hands-on troubleshooting.",
      zh: "實作 Linux、網路設定與服務管理。",
    },
  },
  "one-more-time": {
    category: "play",
    mark: "↻",
    teaser: {
      en: "Dodge, counter, and give the boss one more try.",
      zh: "以閃避反擊與頭目戰為核心的動作遊戲原型。",
    },
  },
  "laughing-jianghu": {
    category: "play",
    mark: "⚑",
    teaser: {
      en: "A tournament where timing changes the story.",
      zh: "透過限時干預，影響武林大會的比賽結果。",
    },
  },
  "2048-browser-game": {
    category: "play",
    mark: "2048",
    teaser: {
      en: "Slide, merge, undo. One small browser experiment.",
      zh: "支援鍵盤、觸控與單步復原的 2048 小遊戲。",
    },
  },
};
