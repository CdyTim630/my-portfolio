import type { Project } from "./projects";
import { featuredProductTranslations } from "./featured-product-cases";
import { featuredEngineeringTranslations } from "./featured-engineering-cases";
import { waterMapTranslation } from "./water-map-case";

export type ProjectTranslation = Pick<
  Project,
  | "title"
  | "summary"
  | "role"
  | "team"
  | "status"
  | "contribution"
  | "architecture"
  | "sections"
  | "evidence"
  | "images"
>;

const employaRepo = "https://github.com/CdyTim630/ytp_hackathon_2026";
const employaSource = `${employaRepo}/blob/7cd74747a1cb1a923b90cdfffd9c9e9afd7f7506`;
const atlasRepo = "https://github.com/CdyTim630/ntu-grading";
const atlasSource = `${atlasRepo}/blob/e620e5b`;
const miningRepo = "https://github.com/CdyTim630/Text-Mining2025";
const miningReport = `${miningRepo}/blob/a3cbb90/${encodeURIComponent("文字探勘初論第15組期末報告.pdf")}`;
const miningSlides = `${miningRepo}/blob/a3cbb90/${encodeURIComponent("文字探勘初論第 15 組期末報告簡報.pdf")}`;

/** 繁體中文案例內容；來源、個人貢獻範圍與限制均與英文版本一致。 */
export const projectTranslations: Record<string, ProjectTranslation> = {
  ...featuredProductTranslations,
  ...featuredEngineeringTranslations,
  "ntu-water-risk-map": waterMapTranslation,
  employa: {
    title: "EmploYA",
    summary: "整合 AI 職涯對話與真人諮詢，幫助青年找到適合自己的資源與下一步。",
    role: "後端 API、AI／RAG 共同開發",
    team: "五人 YTP 黑客松團隊",
    status: "黑客松團隊原型",
    contribution:
      "我與團隊共同開發後端 API、檢索流程與 Gemini 整合，參與對話記憶、服務失效時的備援回應，以及前後端串接。",
    images: [],
    architecture: [
      {
        label: "青年端 App",
        detail: "Flutter 透過 HTTP 傳送個人資料、滑動選擇結果與對話請求。",
      },
      {
        label: "API 與 AI 服務",
        detail: "Next.js 串接使用者輪廓、知識檢索與 Gemini 回應。",
      },
      {
        label: "知識庫與資料儲存",
        detail: "以資源片段與記憶體儲存支援展示，也可接上 Supabase 保存資料。",
      },
      {
        label: "諮詢師與政策介面",
        detail: "團隊開發的轉介流程與儀表板，共用後端資料。",
      },
    ],
    sections: [
      {
        id: "overview",
        title: "專案介紹",
        paragraphs: [
          "EmploYA 是為臺北青年設計的職涯服務原型，將自我探索、職涯規劃、資源推薦對話與諮詢師轉介串成一個流程，讓找到資源之後，還能知道下一步怎麼做。",
          "產品包含 Flutter 青年端 App，以及以 Next.js 開發的諮詢師與政策介面。我主要參與後端與 AI 整合，串起不同介面的使用流程。",
        ],
      },
      {
        id: "my-role",
        title: "我的工作",
        paragraphs: [
          "依團隊 README 的分工，我與許晉誠共同負責後端 API，並與宋宇倫共同負責 AI／RAG。我的公開提交涵蓋檢索與知識 API、對話歷史、來源連結、記憶體內的請求頻率限制、Gemini 失效時的備援回應，以及 AI 待辦事項生成。",
          "Flutter App、諮詢師介面、政策儀表板與簡報素材由其他成員分別負責。本案例呈現的是團隊共同完成的系統，我並未獨立開發所有介面。",
        ],
      },
      {
        id: "problem-and-constraints",
        title: "問題與限制",
        paragraphs: [
          "職涯建議需要貼近個人情境，也要附上可追溯的資源。為了讓黑客松展示在缺少 API 憑證或模型無法使用時仍能進行，系統可切換到本機回應，並使用記憶體暫存資料。",
          "目前公開的是原型實作：政策申請資格可能變動，檢索分數來自啟發式規則；快取與請求限制則保存在記憶體中，無法跨伺服器同步。",
        ],
      },
      {
        id: "architecture",
        title: "系統架構",
        paragraphs: [
          "Flutter 呼叫 Next.js API，由不同服務模組處理使用者輪廓、計畫生成、意圖分類、查詢正規化與檢索。知識來源記錄分類、申請資格與網址，部分應用資料可透過 Supabase 保存。",
          "諮詢師與政策介面共用同一套後端資料。經諮詢師審閱的 FAQ 可匯入知識庫，系統會定期更新，也會在 serverless 冷啟動後重新載入。",
        ],
      },
      {
        id: "data-flow",
        title: "資料處理流程",
        paragraphs: [
          "收到對話請求後，系統先檢查內容、確認使用者與對話的關聯，並檢查請求頻率。接著讀取現有對話歷史、個人資料與使用者輪廓，再依訊息意圖選擇回應方式。",
          "需要檢索時，系統會擴充查詢、排序知識片段，並依啟發式規則計算信心分數與轉介訊號，再將相關片段交給 Gemini。回傳結果附上使用的服務與檢索來源；模型無法回應時，可改用本機備援回應。",
        ],
      },
      {
        id: "technical-implementation",
        title: "實作重點",
        paragraphs: [
          "檢索結合本機雜湊詞元向量、餘弦相似度、詞元重疊程度與意圖中繼資料。這套輕量的詞彙檢索不依賴訓練好的嵌入模型，也沒有使用託管向量資料庫。",
          "生成回應時會帶入近期對話與資源網址，並移除無法對應檢索來源的 Markdown 連結。遇到部分上游錯誤時，也會嘗試其他模型。這些做法讓來源更容易追查，但仍無法保證答案完全正確。",
        ],
        code: {
          language: "typescript",
          content:
            "const vectorScore = cosineSimilarity(queryEmbedding, chunk.embedding);\nconst overlapScore = tokenOverlap(queryTokens, sourceTokens);\nconst boost = metadataBoost(intent, source, intentQuestion);\nconst score = Math.min(1, vectorScore * 0.68 + overlapScore * 0.24 + boost);",
          caption:
            "節錄自 backend/src/engines/rag.ts 的 searchKnowledge。這些權重是檢索計分設定，不代表經驗證的準確率。",
        },
      },
      {
        id: "engineering-decisions",
        title: "技術選擇",
        paragraphs: [
          "採用本機檢索索引，可以減少競賽期間的設定成本，也方便檢查每一項分數的計算方式。來源中繼資料則幫助回應流程區分具體資源與一般目錄頁。",
          "快取會考慮使用者、模式、使用者輪廓與對話歷史，避免不同對話只因文字相同就共用答案。目前的設計適合原型展示；擴大規模前，仍需導入共用快取並完善快取鍵的設計。",
        ],
      },
      {
        id: "challenges-and-tradeoffs",
        title: "挑戰與取捨",
        paragraphs: [
          "模型可能把話說得很流暢，卻附上沒有根據的連結。我們在提示中要求依來源作答，並過濾不符來源的連結；即使連結被移除，仍保留回答文字，讓對話可以繼續。這項取捨仍需要後續的回答品質評估。",
          "本機狀態與備援模型降低了展示門檻，但服務失敗後，記憶體與資料庫的狀態可能不一致，請求限制也可能隨程序重啟而重設。正式上線前，還需要可靠的資料保存、分散式配額、明確的請求逾時設定，以及轉介流程測試。",
        ],
      },
      {
        id: "results-and-evidence",
        title: "成果與紀錄",
        paragraphs: [
          "公開儲存庫包含整合完成的前後端、知識來源定義、API 範例與團隊展示錄影。我的提交紀錄也保留了檢索、對話可靠性與前後端整合的具體修改。",
          "團隊獲得 2026 YTP 黑客松青年組亞軍（依個人履歷記錄）；目前尚未提供正式使用人數、檢索效能或延遲量測。",
        ],
      },
      {
        id: "lessons-learned",
        title: "心得與後續方向",
        paragraphs: [
          "這次實作讓我更重視三件事：模型給了什麼答案、答案有什麼依據，以及使用者接下來能做什麼。在回應中保留服務與來源資訊，能幫助釐清失敗原因，也方便設計後續評估。",
          "下一步是建立有標註的檢索測試集、檢查答案是否有來源支持，並讓匯入流程能保存資料、追蹤資源時效。我也希望補上模型失效、冷啟動與諮詢師轉介的測試；這些目前都仍是後續規劃。",
        ],
      },
    ],
    evidence: [
      {
        label: "團隊分工",
        url: `${employaSource}/README.md#團隊與分工`,
        detail: "README 列出後端與 AI／RAG 的共同負責人，以及各介面的分工。",
      },
      {
        label: "檢索實作",
        url: `${employaSource}/backend/src/engines/rag.ts`,
        detail:
          "涵蓋知識分塊、雜湊詞元向量、排序、來源連結過濾與生成失效時的備援流程。",
      },
      {
        label: "對話整合",
        url: `${employaSource}/backend/src/app/api/chat/messages/route.ts`,
        detail: "處理對話歸屬、可選用的歷史紀錄保存、請求頻率限制與回應流程。",
      },
      {
        label: "我的提交：對話可靠性",
        url: `${employaRepo}/commit/565538335333c3c78536db521ffca06b3b346a18`,
        detail:
          "涵蓋對話記憶、來源連結、請求限制與 Gemini 備援回應；提交紀錄也註明了 AI 協作。",
      },
      {
        label: "我的提交：檢索與 API",
        url: `${employaRepo}/commit/ae183b8046ee1c5fa470f97ace5f66a269bda179`,
        detail: "加入 RAG、知識 API 路由與前後端整合。",
      },
      {
        label: "團隊展示錄影",
        url: `${employaSource}/video1_ejDZQrM7.mp4`,
        detail:
          "連結至儲存庫中的展示影片，可觀看當時的操作流程，並非線上服務。",
      },
    ],
  },
  "ntu-grade-atlas": {
    title: "NTU Grade Atlas",
    summary: "整理分散的公開成績分布，讓課程資訊可以搜尋，也能回查資料來源。",
    role: "全端開發",
    team: "個人開發的 MVP，提交帳號為 CdyTim",
    status: "公開資料 MVP",
    contribution:
      "我開發資料匯入流程、關聯式課程模型、查詢 API 與成績分布介面，並持續修正重複紀錄、統一搜尋資料的格式。",
    images: [
      {
        src: "/projects/ntu-grade-atlas.png",
        alt: "NTU Grade Atlas 首頁的課程搜尋與資料摘要",
        caption:
          "2026 年 10 月 10 日擷取的線上 MVP 首頁。畫面數字是當時的資料量，不代表使用人數或使用量。",
      },
    ],
    architecture: [
      {
        label: "公開資料來源",
        detail: "從 CSV、JSON 與公開 HTML 表格匯入資料。",
      },
      {
        label: "資料整理與儲存",
        detail:
          "依來源格式轉換資料，再透過 Prisma 寫入課程、開課紀錄與成績分布。",
      },
      {
        label: "成績分布查詢",
        detail:
          "Next.js 頁面與唯讀 API 查詢 PostgreSQL，再以 Recharts 呈現圖表。",
      },
      {
        label: "資料投稿",
        detail: "透過 Google 表單收件，再從公開試算表匯入投稿資料。",
      },
    ],
    sections: [
      {
        id: "overview",
        title: "專案介紹",
        paragraphs: [
          "NTU Grade Atlas 整理各門課的成績分布，讓學生比較公開資訊，不接觸個別學生的成績紀錄。目前是資料查詢 MVP，並非官方成績單服務，也沒有大規模使用數據可供引用。",
          "這個專案的核心工作，是把格式不一的資料整理成可查詢的資訊：對應欄位、統一課程與教師識別資料、保留來源，並清楚呈現資料缺漏。",
        ],
      },
      {
        id: "my-role",
        title: "我的工作",
        paragraphs: [
          "我開發 Next.js 應用程式、PostgreSQL 資料模型與匯入腳本。公開提交紀錄可看到我對動態資料庫查詢、重複開課紀錄、教師姓名格式與無效課程名稱的修正。",
          "本案例以公開儲存庫的實作為主，也提供線上版本供操作。儲存庫能呈現開發內容，但無法保證服務目前的可用狀態或資料完整性。",
        ],
      },
      {
        id: "problem-and-constraints",
        title: "問題與限制",
        paragraphs: [
          "公開成績資料常散落在表格與試算表中，欄位名稱不一致，也可能缺少課程代碼，或將教師姓名與班別編號寫在一起。若直接把每一列當成新課程，就容易產生重複或錯誤結果。",
          "專案僅收集公開可存取的課程成績分布，文件明確排除需登入的系統與個人成績。每次加入新來源，仍需確認資料是否可用、是否允許使用，以及品質是否符合需求。",
        ],
      },
      {
        id: "architecture",
        title: "系統架構",
        paragraphs: [
          "匯入腳本依設定的公開網址讀取 CSV、JSON，或以 Playwright 與 Cheerio 解析 HTML 表格。整理後的資料由 Prisma 寫入 PostgreSQL，再由 Next.js 伺服器頁面與唯讀課程 API 提供查詢。",
          "資料模型分別管理 Course、Instructor、Offering 與 GradeDistribution，並以 ScrapeJob 記錄匯入狀態。雖然已有 Submission 模型，目前仍透過 Google 表單收件，尚未完成站內審核流程。",
        ],
      },
      {
        id: "data-flow",
        title: "資料處理流程",
        paragraphs: [
          "每個來源會建立一筆擷取工作。匯入器先對應欄位、統一學期與課程代碼格式，再拆開教師姓名和班別編號。新增或更新資料前，也會排除空白或只有數字的課程名稱。",
          "每筆開課紀錄都保留來源網址與類型。查詢時會統一搜尋文字的格式，在有修課人數時將人數換算為百分比，再對重複紀錄排序並分頁顯示。圖表則使用已儲存的成績分布。",
        ],
      },
      {
        id: "technical-implementation",
        title: "實作重點",
        paragraphs: [
          "資料模型以複合唯一約束區分課程與不同學期、教師、班別的開課紀錄，再用 upsert 避免重複匯入時持續新增相同紀錄。成績分布則以開課紀錄和成績等第作為唯一鍵。",
          "匯入器支援 Google 表單匯出的試算表，也能讀取公開 Google 試算表網址。若無法解析出可靠紀錄，會將該次工作標示為失敗；但目前即使匯入成功，也還沒有逐列統計被排除的資料。",
        ],
        code: {
          language: "prisma",
          content:
            "// Offering\n@@unique([courseId, instructorId, semester, classNo])\n\n// GradeDistribution\n@@unique([offeringId, grade])",
          caption:
            "節錄自 prisma/schema.prisma 的兩項唯一約束；註解標示所屬的資料模型。",
        },
      },
      {
        id: "engineering-decisions",
        title: "技術選擇",
        paragraphs: [
          "關聯式模型能清楚表達課程、教師與學期的關係，來源網址則方便回查原始資料。透過動態資料庫查詢，線上介面能反映新匯入的內容，不必重新產生整份靜態資料。",
          "MVP 先以各來源的處理規則與應用層去重，修正介面上看得到的資料問題。這種做法在資料量小時容易掌握，但長期仍應把更多格式整理與檢查移到匯入階段。",
        ],
      },
      {
        id: "challenges-and-tradeoffs",
        title: "挑戰與取捨",
        paragraphs: [
          "來源缺少課程代碼時，系統會自行產生識別碼，但它不能當成學校的正式代碼。匯入紀錄中的信心值也是依來源設定的固定評分，不是經校準的正確率。",
          "目前查詢會先載入開課紀錄，再於記憶體內篩選、去重、排序與分頁，尚未採用資料庫分頁，因此資料量增加時會受限。下一步是將合適的條件移到有索引的資料庫查詢，並用具代表性的資料集量測延遲。",
        ],
      },
      {
        id: "results-and-evidence",
        title: "成果與紀錄",
        paragraphs: [
          "公開成果包含三個唯讀 API：/api/courses、/api/courses/[id] 與 /api/stats，以及線上查詢介面、匯入腳本和資料庫遷移檔。提交紀錄也保留了初版之後對搜尋與資料品質的修正。",
          "現有三個解析器單元測試涵蓋百分比字串、空值與成績欄位，尚未完整涵蓋匯入或端對端流程。目前沒有使用人數、處理量或效能量測可供引用。",
        ],
      },
      {
        id: "lessons-learned",
        title: "心得與後續方向",
        paragraphs: [
          "資料清理會直接影響使用體驗。重複的開課紀錄、格式不一致的教師姓名，都可能讓搜尋結果變得難用；提交紀錄中的修正，也反映了這些實際問題。",
          "下一步是補齊不同來源格式的匯入測試、逐列驗證報告、交易式寫入、可追蹤版本的來源紀錄與查詢效能量測。站內審核流程和排程匯入也仍待實作與驗證。",
        ],
      },
    ],
    evidence: [
      {
        label: "MVP 範圍與資料政策",
        url: `${atlasSource}/README.md`,
        detail: "說明公開資料的收集範圍、設定方式、現有 API 與後續規劃。",
      },
      {
        label: "關聯式資料模型",
        url: `${atlasSource}/prisma/schema.prisma`,
        detail: "定義課程、教師、開課、成績分布、投稿與擷取工作的資料結構。",
      },
      {
        label: "資料匯入",
        url: `${atlasSource}/scripts/scrape-public-sources.ts`,
        detail:
          "包含 CSV／JSON／HTML 解析、格式正規化、Prisma upsert 與擷取狀態紀錄。",
      },
      {
        label: "查詢與去重",
        url: `${atlasSource}/lib/course-query.ts`,
        detail: "處理搜尋文字正規化、重複紀錄排序與應用層分頁。",
      },
      {
        label: "解析器測試",
        url: `${atlasSource}/tests/parser.test.ts`,
        detail: "三個公開測試案例，檢查解析器對不同輸入的處理。",
      },
      {
        label: "迭代紀錄",
        url: `${atlasRepo}/commits/main/`,
        detail: "我對動態查詢、重複紀錄與搜尋行為的修正紀錄。",
      },
      {
        label: "目前的投稿流程",
        url: `${atlasSource}/app/submit/page.tsx`,
        detail: "透過外部 Google 表單收件，目前尚未完成站內審核功能。",
      },
    ],
  },
  "social-media-text-mining": {
    title: "社群媒體文字探勘",
    summary: "比較 Reddit 與 X 上的 AI 產品討論，觀察情緒與主題有何不同。",
    role: "NLP 流程共同開發",
    team: "四人課程研究團隊",
    status: "課程研究・報告已公開",
    contribution:
      "依我的履歷記錄，我參與文字清理、句子篩選、歧義處理與 Transformer 情緒分類。公開報告呈現的是團隊研究流程，未逐一記錄程式碼作者，因此不將整套實作歸為個人成果。",
    images: [],
    architecture: [
      {
        label: "資料蒐集與清理",
        detail: "報告記錄 Reddit、X 的資料蒐集、英文文字清理與句子篩選方法。",
      },
      {
        label: "分類與建模",
        detail: "結合情緒分類、詞義消歧與 LDA 主題模型。",
      },
      {
        label: "比較與分析",
        detail: "彙整每月情緒分布，並比較兩個平台的討論。",
      },
    ],
    sections: [
      {
        id: "overview",
        title: "專案介紹",
        paragraphs: [
          "這項課程研究比較 Reddit 與 X 對 ChatGPT、Gemini、Claude 和 Perplexity 的討論，觀察情緒與主題如何變化，以及它們和產品估計造訪量的關係。",
          "公開儲存庫包含報告與簡報，尚未公開可執行的分析程式或資料集。本案例的架構圖整理自報告所述方法。",
        ],
      },
      {
        id: "my-role",
        title: "我的工作",
        paragraphs: [
          "依我的履歷記錄，我參與 NLP 流程開發，包含文字清理、句子篩選、歧義處理，以及以 Transformer 進行情緒分類。",
          "簡報列出我、陳羿廷、劉起佑與詹孟瑾四位成員。公開報告記錄團隊共同完成的研究流程，但未逐項列出分工或程式碼作者，因此這裡仍以團隊研究成果呈現。",
        ],
      },
      {
        id: "problem-and-constraints",
        title: "問題與限制",
        paragraphs: [
          "一篇貼文可能同時談到多個模型、引用別人的話，甚至用「Gemini」指雙子座。若沒有先辨識討論對象，就可能把情緒判斷錯誤地歸到某項產品。",
          "歷史資料 API 的取得限制、平台取樣方式，以及只處理英文的設定，都會影響樣本代表性。報告也指出，X 的資料集中在特定時段蒐集，可能產生偏誤。",
        ],
      },
      {
        id: "architecture",
        title: "研究架構",
        paragraphs: [
          "研究流程依序包含資料蒐集、文字清理、句子篩選、詞義消歧、情緒分類、主題建模與彙整分析。這是批次分析流程，並非已部署的線上服務。",
          "報告記錄的工具包括：以 PRAW 蒐集 Reddit、以 Selenium 蒐集 X、使用 Transformer 做情緒分類，並以 spaCy、NLTK 進行前處理，再用 Gensim LDA 分析主題。這些方法有報告佐證，但原始碼尚未公開。",
        ],
      },
      {
        id: "data-flow",
        title: "資料處理流程",
        paragraphs: [
          "文字經過清理、切分句子後，再篩選出與目標模型相關的內容。接著用規則與零樣本分類器，區分「Gemini」是在談 AI 產品還是星座。",
          "情緒分類結果用來計算每月正負情緒比。主題分析則另外經過斷詞與名詞篩選，整理成模型輸入，再由團隊比較不同平台與時期。",
        ],
      },
      {
        id: "technical-implementation",
        title: "方法與實作",
        paragraphs: [
          "團隊以小型人工標註句子集，比較 Cardiff Twitter RoBERTa、DistilBERT SST-2 與 nlptown BERT。依報告的整體表現與中立類別召回率，最後選用 Cardiff 模型。",
          "主題分析先做詞頻篩選，再使用 Gensim LDA，並搭配 spaCy、NLTK 與 WordNet 前處理。公開資料並未顯示有使用 Gemini API；Gemini 在此是研究對象之一。",
        ],
      },
      {
        id: "engineering-decisions",
        title: "方法選擇",
        paragraphs: [
          "貼文同時談到多項產品時，先以句子為單位篩選，能減少其他內容的干擾。用人工標註範例比較候選模型，也讓情緒分類模型的選擇有具體依據。",
          "主題分析聚焦名詞與專有名詞，以找出反覆出現的討論對象。這能縮小分析範圍，但也可能漏掉重要情境，因此模型找出的主題仍需要人工解讀。",
        ],
      },
      {
        id: "challenges-and-tradeoffs",
        title: "挑戰與取捨",
        paragraphs: [
          "分類器評估只有 100 個人工標註句子，適合做初步比較，尚不足以判斷模型在不同產品、平台與時期的整體表現。",
          "移除非 ASCII 文字會排除部分語言社群；計算正負情緒比時不納入中立情緒，也會改變指標的意義。此外，情緒與估計造訪量即使有相關，也不能據此推論因果。",
        ],
      },
      {
        id: "results-and-evidence",
        title: "成果與紀錄",
        paragraphs: [
          "公開的團隊報告與簡報包含模型比較、每月情緒分析、主題解讀，以及研究方法的限制。",
          "報告雖提供評估表格，但未公開程式碼、標註紀錄與資料集，因此目前無法檢查是否可重現。本案例不將這些數據視為已獨立驗證的結果，也不據此宣稱正式環境的效能。",
        ],
      },
      {
        id: "lessons-learned",
        title: "心得與後續方向",
        paragraphs: [
          "取樣方式和討論對象的歧義，可能與分類器選擇一樣影響結果。呈現研究發現時，也需要交代這些假設與限制。",
          "若要進一步整理成可重現的工程專案，還需要公開經授權、去識別化的測試資料，並補上執行環境、標註規範、資料切分方式與評估腳本。",
        ],
      },
    ],
    evidence: [
      {
        label: "研究報告",
        url: miningReport,
        detail: "包含研究方法、小型人工標註評估、LDA 分析與取樣限制。",
      },
      {
        label: "團隊簡報",
        url: miningSlides,
        detail: "標題頁列出我（Ding-Yuan Chen）為四人團隊成員之一。",
      },
      {
        label: "公開研究成果",
        url: `${miningRepo}/tree/a3cbb90`,
        detail: "檢視的版本只有兩份 PDF，尚未公開可執行的分析程式碼。",
      },
    ],
  },
};
