import { copy as t, type ProjectNarrative } from "./project-narrative";

/** Original descriptions based on the source reviews in docs/. Private source stays private. */
export const archiveProjectNarratives: Record<string, ProjectNarrative> = {
  "internship-radar": {
    sections: [
      {
        id: "overview",
        title: t("What it does", "這個專案在做什麼"),
        paragraphs: [
          t(
            "Internship Radar combines finding internships with keeping track of applications. Instead of treating every job-board search as a new task, it brings public listings, reasons for a possible match and application progress into one personal workspace.",
            "實習雷達把「找實習」和「追蹤申請」放在同一個地方。使用者不用每次從不同求職網站重新搜尋，而是能集中看公開職缺、了解配對理由，再記錄自己的申請進度。",
          ),
          t(
            "It is a personal MVP with a web interface and native client work. The goal is to keep the next action clear: which opportunity is relevant, whether its information is still current, and where an application stands.",
            "這是持續開發的個人 MVP，包含網頁介面與原生 App。重點是讓下一步明確：哪些機會值得看、職缺資訊是否還有效，以及申請目前進行到哪裡。",
          ),
        ],
      },
      {
        id: "features",
        title: t("Main workflows", "主要功能與使用流程"),
        paragraphs: [
          t(
            "The workflow starts with public-job ingestion, continues through matching and listing review, and ends with an application record. Matching includes an explanation so the user can judge the recommendation rather than rely on an unexplained ranking.",
            "流程從彙整公開職缺開始，接著查看配對建議與職缺內容，最後建立申請紀錄。配對結果附上理由，讓使用者能自行判斷，而不只接受一個沒有解釋的排序。",
          ),
        ],
        bullets: [
          t(
            "Collect and organize public internship opportunities.",
            "彙整公開實習機會，減少在不同來源間反覆切換。",
          ),
          t(
            "Explain why an opportunity may match the user's search.",
            "提供配對理由，協助判斷職缺是否符合需求。",
          ),
          t(
            "Keep application progress alongside the opportunity being considered.",
            "把職缺與申請進度連在一起，方便後續追蹤。",
          ),
          t(
            "Support web and native-client access to the same product workflow.",
            "以網頁與原生 App 承接找職缺、查看資訊和追蹤進度的流程。",
          ),
        ],
      },
      {
        id: "implementation",
        title: t("How it is built", "技術實作"),
        paragraphs: [
          t(
            "The reviewed implementation combines Next.js for the web client, FastAPI for backend services and PostgreSQL for persistent data. Redis/Celery handles background work, while SwiftUI provides the native-client implementation.",
            "已檢視的實作以 Next.js 開發網頁、FastAPI 提供後端服務，並用 PostgreSQL 保存資料。Redis／Celery 處理背景工作，SwiftUI 則用於原生 App。",
          ),
          t(
            "The important boundary is between collecting a listing and presenting it as a current opportunity. Source freshness and expired-listing handling therefore matter alongside the matching interface.",
            "其中一個重要界線是：抓到一筆職缺，不代表它現在仍然有效。因此，來源更新時間與過期職缺處理，和配對介面一樣重要。",
          ),
        ],
      },
      {
        id: "my-role",
        title: t("My contribution", "我負責的部分"),
        paragraphs: [
          t(
            "I built and iterated the personal MVP. Reviewed changes include expired-listing recommendations, login feedback, native-client connectivity and source freshness, connecting the visible interface to the behavior of the underlying data.",
            "我開發並持續調整這個個人 MVP，修正過期職缺判斷、登入回饋、原生 App 連線與職缺來源更新問題，讓前端看到的資訊能更貼近後端資料的實際狀態。",
          ),
        ],
      },
      {
        id: "tradeoffs",
        title: t("Current scope", "目前範圍與限制"),
        paragraphs: [
          t(
            "The source repository is private. This page describes the authorized project scope without publishing internal URLs, personal application records or implementation assets. No user-volume or recommendation-quality benchmark is claimed.",
            "原始碼尚未公開，這裡只介紹已授權的專案內容，不提供內部網址、個人申請紀錄或私人素材。目前也沒有可引用的使用規模或推薦品質量測。",
          ),
        ],
      },
      {
        id: "next-steps",
        title: t("What I learned", "心得與後續方向"),
        paragraphs: [
          t(
            "A useful search tool needs to explain both its recommendations and its uncertainty. Next I would focus on reproducible freshness checks, clearer expired-listing states and integration tests across web/native login and application tracking.",
            "實用的搜尋工具除了要說明推薦理由，也要交代資訊是否仍然可靠。後續會優先建立可重現的更新檢查、清楚的過期狀態，以及網頁／原生登入和申請追蹤的整合測試。",
          ),
        ],
      },
    ],
  },
  "yaoshun-dashboard": {
    sections: [
      {
        id: "overview",
        title: t("What it does", "這個專案在做什麼"),
        paragraphs: [
          t(
            "The Yaoshun dashboard is a team prototype for keeping orders, deliveries and payments in one workspace. It addresses the gap between a customer placing or updating an order through a LINE bot and the business owner confirming what still needs to be delivered or collected.",
            "堯順工程行管理儀表板是團隊製作的營運管理原型，把訂單、出貨與收款放在同一個介面。它銜接客戶透過 LINE Bot 下單或更新資訊，以及老闆確認待出貨、待收款項目的工作流程。",
          ),
        ],
      },
      {
        id: "features",
        title: t("What users can do", "主要功能"),
        paragraphs: [
          t(
            "The overview surfaces current operations; the order workspace puts delivery and payment states together; the insights view organizes outstanding balances and operational suggestions. Clicking a customer connects the current order to that customer's history.",
            "總覽整理目前營運狀態，訂單作業將出貨和付款狀態並列，洞察頁則整理未收款與營運建議。使用者也能從訂單上的客戶名稱查看歷史，不必在不同清單之間重新找資料。",
          ),
        ],
        bullets: [
          t(
            "Create and inspect orders with customer, product and delivery information.",
            "建立和查看訂單，整理客戶、商品與配送資訊。",
          ),
          t(
            "Distinguish unpaid, customer-reported payment and owner-confirmed payment.",
            "區分未付款、客戶回報已付款，以及老闆確認入帳等狀態。",
          ),
          t(
            "Filter work by delivery/payment status and inspect customer history.",
            "依出貨或收款狀態篩選，並查看客戶歷史紀錄。",
          ),
          t(
            "Review summaries and export operational records for follow-up.",
            "閱讀營運摘要，匯出紀錄供後續追蹤。",
          ),
        ],
      },
      {
        id: "implementation",
        title: t("Shared data across interfaces", "如何與 LINE Bot 共用資料"),
        paragraphs: [
          t(
            "React and TypeScript present the dashboard, while Firestore supplies real-time data. The documented Users, Products and Orders contracts let the dashboard and a separate LINE bot refer to the same business records.",
            "儀表板以 React／TypeScript 開發，透過 Firestore 即時同步資料。團隊約定 Users、Products、Orders 等資料格式，讓儀表板與另一個 LINE Bot 能指向同一份營運紀錄。",
          ),
          t(
            "Payment confirmation is a concrete example of why the contract matters: a customer's report should not automatically become confirmed revenue. The data distinguishes pending confirmation and records confirmation-related fields; merge writes reduce accidental replacement of fields owned by another interface.",
            "付款確認最能說明資料契約的重要性：客戶表示已付款，不能直接等同老闆確認入帳。因此資料中保留待確認狀態與相關時間欄位，寫入時也使用合併更新，減少覆蓋另一個介面維護的資料。",
          ),
        ],
      },
      {
        id: "my-role",
        title: t("My contribution", "我負責的部分"),
        paragraphs: [
          t(
            "My changes cover Firestore integration, the payment/data contract, customer-name selection, delivery-address fields and dashboard workflows. I also contributed the AI-advisor interface. The dashboard and the separate LINE bot remain team work.",
            "我參與 Firestore 整合、付款與資料契約、客戶名稱選取、配送地址欄位，以及儀表板操作流程，也調整 AI 顧問介面。整個儀表板及獨立的 LINE Bot 都是團隊成果。",
          ),
        ],
      },
      {
        id: "tradeoffs",
        title: t("Prototype boundaries", "目前範圍與限制"),
        paragraphs: [
          t(
            "The reviewed documentation leaves authentication and rule deployment as unfinished integration work. The AI advisor also uses cached or rule-based output, so it is an aid to reviewing records rather than a guarantee of current financial advice. No live customer data is reproduced here.",
            "已檢視的文件仍將登入與存取規則部署列為待整合事項。AI 顧問亦可能使用快取或規則結果，定位是協助查看紀錄，不保證每次都反映最新狀態。作品集不展示實際客戶資料。",
          ),
        ],
      },
      {
        id: "next-steps",
        title: t("What I learned", "心得與後續方向"),
        paragraphs: [
          t(
            "A status label affects real workflow: reported payment, confirmed payment and delivery are separate events. Further work would verify access rules and exercise concurrent LINE/dashboard updates, then make data and advisor freshness visible in the interface.",
            "狀態名稱會直接影響工作流程：回報付款、確認入帳和完成配送是不同事件。後續重點會是驗證存取規則、測試 LINE 與儀表板同時更新的情況，並清楚顯示資料與顧問建議的更新時間。",
          ),
        ],
      },
    ],
    evidence: [
      {
        label: t("Product workflow and data contracts", "功能流程與資料契約"),
        url: "https://github.com/cpcap1214/IM2008/blob/a7d9078751b4e9ad94f9b0182faac7275bcb40a5/README.md",
        detail: t(
          "Order/payment fields, views, exports and shared Firestore contracts.",
          "訂單與收款欄位、頁面功能、匯出及共用 Firestore 格式。",
        ),
      },
      {
        label: t(
          "My payment and integration contribution",
          "我的付款與資料整合提交",
        ),
        url: "https://github.com/cpcap1214/IM2008/commit/1b6bb6a0151e",
        detail: t(
          "Pending confirmation, payment timestamps and merge-write integration.",
          "待確認付款、付款時間及合併寫入的整合。",
        ),
      },
    ],
  },
  "convenience-store-meal-optimizer": {
    sections: [
      {
        id: "overview",
        title: t("What it does", "這個專案在做什麼"),
        paragraphs: [
          t(
            "This operations-research course project recommends a combination of convenience-store products under budget and nutrition constraints. Instead of selecting items independently, it treats the meal as a combined decision: which products and promotions fit together, and what compromises are needed.",
            "這是作業研究課程的團隊專題，依預算與營養條件推薦便利商店商品組合。它不是單獨推薦某一項商品，而是把整餐當成一個最佳化問題：哪些品項和優惠可以一起搭配，又需要做哪些取捨。",
          ),
        ],
      },
      {
        id: "features",
        title: t("From preferences to a meal", "使用者怎麼取得推薦"),
        paragraphs: [
          t(
            "A Flask form turns the user's budget and meal preferences into model inputs. The solver returns a product combination, and the application keeps recent choices in a session so the recommendation can account for repetition.",
            "使用者透過 Flask 表單輸入預算與餐點偏好，再由程式轉成模型條件。求解後回傳商品組合，並在 session 中記錄近期選擇，讓推薦能考慮重複吃相同品項的情況。",
          ),
        ],
        bullets: [
          t(
            "Set budget, calorie and item-count requirements.",
            "設定預算、熱量與商品數量等條件。",
          ),
          t(
            "Balance nutrition targets with hard limits and soft penalties.",
            "同時處理營養目標、不能違反的限制，以及可接受但需付出代價的偏差。",
          ),
          t(
            "Consider promotions, meal structure and recent choices.",
            "將促銷、餐點結構與近期吃過的品項納入考量。",
          ),
          t(
            "Compare an exact MILP approach with a GRASP/local-search heuristic.",
            "比較精確 MILP 模型與 GRASP／區域搜尋的求解方式。",
          ),
        ],
      },
      {
        id: "implementation",
        title: t("Optimization and web integration", "最佳化模型與網頁實作"),
        paragraphs: [
          t(
            "The Gurobi MILP models product and promotion choices, budget/calorie/count limits, nutrition slack penalties, a sodium ceiling and meal-structure preferences. Data preprocessing turns price and nutrition records into parameters the solver can use.",
            "Gurobi MILP 模型處理商品與優惠選擇、預算／熱量／數量限制、營養偏差懲罰、鈉含量上限，以及餐點結構偏好。資料前處理則把價格與營養資訊轉成求解器可使用的參數。",
          ),
          t(
            "The alternative GRASP method repeatedly builds randomized candidate meals, improves them through add/drop/swap moves and restarts the search. The report compares these methods on real-product and generated instances; those experiments are documented results, not benchmarks reproduced by this portfolio.",
            "另一條 GRASP 方法會隨機化建立候選餐點，再透過加入、刪除與替換品項改善結果，並多次重新搜尋。報告以真實商品和生成情境比較兩種方法；這裡介紹研究設計，不將報告數字當成已重新驗證的效能。",
          ),
        ],
      },
      {
        id: "my-role",
        title: t("My contribution", "我負責的部分"),
        paragraphs: [
          t(
            "I participated in the four-person team and published the initial solver, heuristic, data-processing and web-application code, then merged later recommender work. Later changes by teammates are part of the final project; the initial upload does not establish sole design of every model or report section.",
            "我以四人團隊成員身分提交初版求解器、啟發式方法、資料處理與網頁程式，並合併後續推薦功能。成品也包含其他成員的修改，初版提交不代表每個模型和報告段落都由我獨立設計。",
          ),
        ],
      },
      {
        id: "tradeoffs",
        title: t("Constraints and maturity", "限制與目前完成度"),
        paragraphs: [
          t(
            "The application needs a working Gurobi environment for its exact solver. Session configuration and shared mutable state still reflect a local demo. Nutrition values are optimization inputs, not a medically validated meal plan, and solver gaps or feasibility rates should be read with the report's instance definitions.",
            "精確求解需要可用的 Gurobi 環境；session 設定與共享狀態也仍偏向本機展示。營養資料是最佳化輸入，不代表經醫療驗證的飲食建議。閱讀可行率或求解差距時，也需連同報告中的測試情境一起理解。",
          ),
        ],
      },
      {
        id: "next-steps",
        title: t("What I learned", "心得與後續方向"),
        paragraphs: [
          t(
            "Turning a mathematical model into a usable form requires deciding what to do when preferences conflict. A stronger next version would isolate each request's history, make infeasible constraints understandable and publish a reproducible experiment environment with the comparison scripts.",
            "把數學模型做成可操作的工具，關鍵之一是處理彼此衝突的偏好。下一版會優先隔離各次請求的歷史狀態、清楚說明無法滿足的條件，並整理可重現的實驗環境和比較腳本。",
          ),
        ],
      },
    ],
    evidence: [
      {
        label: t("Complete project report (PDF)", "完整專題報告（PDF）"),
        url: "https://github.com/CdyTim630/ntu114-2-or-final/blob/828f7b41212cbcf1248ba003a39dd4bddefc2e3a/report/report.pdf",
        detail: t(
          "Model, GRASP-LS method, experiments and web workflow.",
          "數學模型、GRASP-LS、比較實驗與網頁流程。",
        ),
      },
      {
        label: t("MILP implementation", "MILP 模型實作"),
        url: "https://github.com/CdyTim630/ntu114-2-or-final/blob/828f7b41212cbcf1248ba003a39dd4bddefc2e3a/src/model_milp.py",
        detail: t(
          "Inspect the modeled constraints and objective.",
          "可查看實際使用的限制式與目標。",
        ),
      },
      {
        label: t("GRASP and local search", "GRASP 與區域搜尋"),
        url: "https://github.com/CdyTim630/ntu114-2-or-final/blob/828f7b41212cbcf1248ba003a39dd4bddefc2e3a/src/heuristic_proposed.py",
        detail: t(
          "Candidate construction, local changes and restarts.",
          "候選解建構、鄰域調整與重新搜尋。",
        ),
      },
      {
        label: t("Flask application", "Flask 操作介面"),
        url: "https://github.com/CdyTim630/ntu114-2-or-final/blob/828f7b41212cbcf1248ba003a39dd4bddefc2e3a/webapp/app.py",
        detail: t(
          "Connects form inputs to solver execution and recent-choice state.",
          "將表單條件接到求解與近期選擇紀錄。",
        ),
      },
    ],
  },
  "hedgedoc-pdf-export": {
    sections: [
      {
        id: "overview",
        title: t("What the contribution does", "這個功能在做什麼"),
        paragraphs: [
          t(
            "HedgeDoc is a collaborative Markdown editor. My contribution to a team-maintained fork adds a PDF export entry and print-layout adjustments, so a note can move from an editable online document to a cleaner printable handout.",
            "HedgeDoc 是協作式 Markdown 編輯器。我在團隊維護的分支中加入 PDF 匯出入口與列印版面調整，讓線上編輯的筆記能轉成較適合閱讀和分享的列印文件。",
          ),
        ],
      },
      {
        id: "workflow",
        title: t("How export works", "匯出流程"),
        paragraphs: [
          t(
            "The user selects the PDF option in the editor sidebar. The export hook checks that the renderer and its iframe window are available, switches the renderer to print mode and opens the browser's print dialog. The user can then save the document as a PDF.",
            "使用者從編輯器側欄選擇 PDF，匯出 hook 先確認渲染器與 iframe 視窗可用，再切換列印模式並開啟瀏覽器列印對話框，由使用者選擇儲存成 PDF。",
          ),
          t(
            "Print-specific styles hide navigation/contents elements, constrain image width and adjust page breaks and A4 layout. This is browser-assisted export using the existing document renderer, rather than a separate server-side PDF service.",
            "列印樣式會隱藏不需要的導覽或目錄、限制圖片寬度，並調整分頁與 A4 版面。它沿用既有文件渲染，屬於瀏覽器協助的匯出，不是另外架設一套伺服器 PDF 服務。",
          ),
        ],
      },
      {
        id: "implementation",
        title: t("Technical choices", "技術選擇"),
        paragraphs: [
          t(
            "The feature reuses renderer communication and browser printing. The team presentation explains why a separate Puppeteer renderer was not chosen: fonts/styles could differ, and the VM had limited resources. That is the stated design rationale, not a measured resource saving.",
            "功能重用渲染器溝通介面與瀏覽器列印。團隊簡報說明，沒有採用另一套 Puppeteer 渲染服務，是考量字型樣式可能不同，以及 VM 資源有限；這是設計理由，不是已量測的資源節省數字。",
          ),
        ],
      },
      {
        id: "my-role",
        title: t("My contribution", "我負責的部分"),
        paragraphs: [
          t(
            "The presentation assigns PDF export and slide design to me, and my feature commit adds the sidebar action, export hook and print stylesheet. Other team members handled themes, GitHub synchronization, authentication, AI summary and deployment; the editor and collaboration engine are upstream work.",
            "團隊簡報將 PDF 匯出與簡報設計分配給我，對應提交包含側欄入口、匯出 hook 與列印樣式。主題、GitHub 同步、登入、AI 摘要與部署由其他成員負責，原本的編輯器及協作引擎則來自上游專案。",
          ),
        ],
      },
      {
        id: "tradeoffs",
        title: t("What still needs validation", "仍需驗證的部分"),
        paragraphs: [
          t(
            "The implementation coordinates print mode with fixed timers. It does not prove that every image and font is ready, nor does the reviewed tree provide a dedicated cross-browser PDF regression suite. Long documents, slow media and different browsers remain important test cases.",
            "目前以固定等待時間協調列印模式，尚不能確保所有圖片與字型都載入完成；已檢視的版本也沒有專門的跨瀏覽器 PDF 回歸測試。長文件、慢速圖片與不同瀏覽器，都是需要繼續驗證的情境。",
          ),
        ],
      },
      {
        id: "next-steps",
        title: t("What I learned", "心得與後續方向"),
        paragraphs: [
          t(
            "Export quality depends on both state coordination and layout. A next iteration would wait for renderer/media readiness explicitly and compare representative documents across browsers, including page boundaries, wide images and print-only visibility.",
            "匯出品質同時取決於狀態協調和版面。後續會改成明確等待渲染與素材就緒，再用代表性文件跨瀏覽器比較分頁、寬圖片與列印時的顯示內容。",
          ),
        ],
      },
    ],
    evidence: [
      {
        label: t("My PDF export contribution", "我的 PDF 匯出功能提交"),
        url: "https://github.com/IM-LaoSAPi/hedgedoc/commit/c13154eeb9280f6397d77b0b6561561041af1c0e",
        detail: t(
          "Sidebar action, export hook and print-style changes in the team fork.",
          "團隊分支中的側欄入口、匯出流程與列印樣式修改。",
        ),
      },
      {
        label: t("Export hook", "PDF 匯出 hook"),
        url: "https://github.com/IM-LaoSAPi/hedgedoc/blob/ef59d580c0dcc0fa03ec945676ca5361eeb6e387/frontend/src/components/editor-page/utils/export-to-pdf.ts",
        detail: t(
          "Renderer coordination and browser-print flow.",
          "渲染器協調與瀏覽器列印流程。",
        ),
      },
      {
        label: t("Print stylesheet", "列印樣式"),
        url: "https://github.com/IM-LaoSAPi/hedgedoc/blob/ef59d580c0dcc0fa03ec945676ca5361eeb6e387/frontend/global-styles/print.scss",
        detail: t(
          "A4 layout, image constraints and print visibility.",
          "A4 版面、圖片限制與列印顯示規則。",
        ),
      },
    ],
  },
  "city-fragments": {
    sections: [
      {
        id: "overview",
        title: t("What it does", "這個專案在做什麼"),
        paragraphs: [
          t(
            "City Fragments is a Flutter city-journaling prototype. It combines a place-exploration map with small personal records, a collection view and share-card previews, exploring how everyday moments might become a browsable city scrapbook.",
            "城市碎片是以 Flutter 製作的城市手帳原型，結合地圖探索、生活記錄、收藏圖鑑與分享卡預覽，嘗試把日常片段整理成可以回看的城市手帳。",
          ),
        ],
      },
      {
        id: "features",
        title: t("The experience being explored", "想呈現的使用體驗"),
        paragraphs: [
          t(
            "The five-tab interface connects exploration, fragment creation, collections, a feed and personal views. A multi-step creation flow guides a record from its initial input to a saved fragment in the prototype's local state.",
            "五個分頁串起探索、建立片段、收藏、動態與個人頁面。多步驟建立流程引導使用者輸入一筆記錄，再將片段加入原型的本機狀態中。",
          ),
        ],
        bullets: [
          t(
            "Explore a map and its district-fog presentation.",
            "以地圖和區域迷霧呈現城市探索。",
          ),
          t(
            "Create a fragment through a guided multi-step interface.",
            "透過分步介面建立生活片段。",
          ),
          t(
            "Browse collection modes, feeds and profile information.",
            "用收藏、動態與個人頁整理和回看內容。",
          ),
          t(
            "Preview how a record might appear on a social share card.",
            "預覽生活記錄轉成社群分享卡的樣子。",
          ),
        ],
      },
      {
        id: "implementation",
        title: t("How the prototype is structured", "原型的技術結構"),
        paragraphs: [
          t(
            "Flutter/Dart and reusable Cupertino components provide the mobile interface. flutter_map and coordinate types handle map presentation. Repository interfaces and injected services separate UI code from the mock stores, leaving a defined boundary for a future data service.",
            "介面以 Flutter／Dart 與可重用的 Cupertino 元件建立，地圖使用 flutter_map 及座標型別。資料存取介面與服務注入把 UI 和模擬儲存分開，為未來替換成真正的資料服務留下明確界線。",
          ),
        ],
      },
      {
        id: "my-role",
        title: t("My contribution", "我負責的部分"),
        paragraphs: [
          t(
            "I built and integrated the prototype with AI assistance, including shared components, repository wiring and the main product flow. The commit history records AI collaboration; the scope here is implementation and integration of a prototype, not a launched social platform.",
            "我在 AI 輔助下開發與整合原型，整理共用元件、資料存取介面，以及主要操作流程。提交紀錄保留 AI 協作說明，這裡呈現的是原型實作，不是已正式推出的社群平台。",
          ),
        ],
      },
      {
        id: "tradeoffs",
        title: t("Implemented versus previewed", "已實作與預覽功能的差別"),
        paragraphs: [
          t(
            "Created fragments are held in memory and the prototype uses a fixed location and placeholder photo. Share-card save/link actions are unfinished and its QR is a visual placeholder. Privacy choices are UI/domain state, not backend-enforced access control; no camera, GPS or durable synchronization is claimed.",
            "建立的片段目前保存在記憶體，位置和照片仍使用固定或佔位資料。分享卡的儲存與連結操作尚未完成，QR 也是視覺預覽；隱私選項屬於介面與資料狀態，還沒有後端權限保障，因此不宣稱已完成相機、GPS 或長期同步。",
          ),
        ],
      },
      {
        id: "next-steps",
        title: t("What I learned", "心得與後續方向"),
        paragraphs: [
          t(
            "The prototype helped define a coherent interaction flow before introducing external services. Next would be persistent repositories, explicit location/photo permissions and real save/share behavior, with tests for app restarts and privacy settings.",
            "這個原型先把操作流程整理完整，再逐步接入外部服務。下一步會是持久化儲存、明確的位置與照片權限，以及真正可用的儲存／分享功能，並測試重啟和隱私設定。",
          ),
        ],
      },
    ],
    evidence: [
      {
        label: t("Prototype scope and setup", "原型範圍與設定"),
        url: "https://github.com/CdyTim630/personal_handbook/blob/79a2292aba263082a0b562c63e995b7722404246/README.md",
        detail: t(
          "Project structure and the declared prototype experience.",
          "專案結構與原型想呈現的使用體驗。",
        ),
      },
      {
        label: t("Repository and service boundaries", "資料與服務界線"),
        url: "https://github.com/CdyTim630/personal_handbook/blob/79a2292aba263082a0b562c63e995b7722404246/lib/core/app_services.dart",
        detail: t(
          "Injected repositories separate the UI from mock data.",
          "以注入的資料存取介面分開 UI 與模擬資料。",
        ),
      },
      {
        label: t("Iteration and AI-assistance record", "迭代與 AI 協作紀錄"),
        url: "https://github.com/CdyTim630/personal_handbook/commit/79a2292aba263082a0b562c63e995b7722404246",
        detail: t(
          "Reusable components, repository wiring and stated smoke checks.",
          "共用元件、資料串接與提交中記錄的基本檢查。",
        ),
      },
    ],
  },
  "pdao-2026": {
    sections: [
      {
        id: "overview",
        title: t("What this work is", "這項工作在做什麼"),
        paragraphs: [
          t(
            "PDAO 2026 is contest problem-setting work. The deliverable is a set of problems that other people solve: each needs a clear statement, precise constraints, examples and a reference solution that agrees with the intended reasoning.",
            "PDAO 2026 是程式競賽命題工作，交付的不是一般 App，而是讓參賽者解答的題目。每題都需要清楚的敘述、明確的限制、範例，以及能和預期解法對應的參考程式。",
          ),
        ],
      },
      {
        id: "topics",
        title: t("What the four problems explore", "四道題目的主題"),
        paragraphs: [
          t(
            "The résumé describes four authored problems spanning several reasoning patterns. Their purpose is to turn an algorithmic idea into a well-defined task where edge cases and input limits distinguish the intended solution from an incomplete one.",
            "履歷記錄我設計四道題目，涵蓋不同推理方式。命題重點是將演算法想法變成明確任務，再用邊界情況與輸入限制，區分完整解法和只處理部分情況的解法。",
          ),
        ],
        bullets: [
          t(
            "Grid reasoning and careful case analysis.",
            "網格推理與情況分析。",
          ),
          t(
            "Shortest paths combined with dynamic programming on a graph.",
            "最短路徑與圖上的動態規劃。",
          ),
          t(
            "Functional graphs and binary lifting.",
            "Functional graph 與倍增法。",
          ),
          t(
            "Number-theoretic reasoning and optimization.",
            "數論推理與最佳化。",
          ),
        ],
      },
      {
        id: "workflow",
        title: t("From an idea to a contest task", "從想法整理成可競賽的題目"),
        paragraphs: [
          t(
            "A problem starts with a solvable model, then a statement and constraints that expose exactly that model. Examples explain the rules; the C++ reference solution provides a concrete implementation against which difficult cases can be checked.",
            "題目先有可求解的模型，再寫出能精確表達模型的題目敘述與限制。範例用來解釋規則，C++ 參考解答則讓較難的情況有具體實作可以核對。",
          ),
          t(
            "The reviewed team repository also contains generators, validators, checkers and judging tools. Those describe the surrounding contest workflow; they are not all assigned to me merely because I had repository access.",
            "已檢視的團隊儲存庫另有資料產生器、驗證器、檢查器與評測工具。這些是完整賽務流程的一部分，但不能只因為我有儲存庫權限，就把所有工具都當成我的個人實作。",
          ),
        ],
      },
      {
        id: "my-role",
        title: t("My contribution", "我負責的部分"),
        paragraphs: [
          t(
            "My résumé attributes the four problem statements, constraints, sample cases and C++ reference solutions to me, including refinement of edge cases. Reviewed commits additionally support statement revisions and a judging-page correction. This is a problem-setting role within a larger team.",
            "依履歷記錄，我負責四題的敘述、限制、範例與 C++ 參考解答，並調整邊界案例；已檢視的提交也能對應到題目修訂和評測頁面修正。這是團隊中的命題工作，不代表獨立完成整場競賽。",
          ),
        ],
      },
      {
        id: "tradeoffs",
        title: t("What is public", "公開範圍"),
        paragraphs: [
          t(
            "The source is private. This page explains the themes and my role without exposing statements, hidden cases, reference code or private judging links. It does not claim a particular participant count, acceptance rate or measured difficulty.",
            "原始碼未公開，因此這裡只介紹主題與分工，不揭露題面、隱藏測資、參考程式或私人評測連結，也不宣稱參賽人數、通過率或經量測的難度。",
          ),
        ],
      },
      {
        id: "lessons",
        title: t("What I learned", "命題帶來的收穫"),
        paragraphs: [
          t(
            "Writing a reference solution is only one part of a good problem. I also need to communicate the rules without ambiguity and make constraints match the intended complexity. Future public write-ups would depend on the contest's release permission and would separate the idea, proof and implementation.",
            "寫出參考程式只是命題的一部分，更重要的是把規則講清楚，並讓限制與預期複雜度相符。未來若取得公開許可，會把題意、正確性論證與實作分開整理，方便讀者理解。",
          ),
        ],
      },
    ],
  },
  "ntu-im-website": {
    sections: [
      {
        id: "overview",
        title: t("What the website is for", "網站的用途"),
        paragraphs: [
          t(
            "The NTU IM Student Association website brings departmental information and student resources into one place. Its public interface includes course reviews, past exams and study materials, so students can find information without relying on scattered messages or old links.",
            "台大資管系學會網站集中整理系上資訊與學生資源，公開介面包含課程評價、考古題與學習資料，讓同學不用只靠零散訊息或舊連結找內容。",
          ),
        ],
      },
      {
        id: "features",
        title: t("What I helped improve", "參與改善的功能"),
        paragraphs: [
          t(
            "My work centers on small but visible maintenance improvements. One change replaces a broken PDF-guidelines download with an in-app upload-guidelines dialog, keeping instructions available at the point where students need them. Other contributions update branding and interface presentation.",
            "我的工作集中在同學實際會遇到的維護細節。例如，將失效的 PDF 說明下載改成站內上傳說明視窗，讓操作當下就能看到規則；也參與品牌素材及介面呈現更新。",
          ),
        ],
      },
      {
        id: "implementation",
        title: t("How the site is built", "技術與維護方式"),
        paragraphs: [
          t(
            "The public project uses React, React Router, Material UI and i18next. Maintenance therefore involves keeping a change consistent with existing routes, components and language behavior, rather than introducing a separate page style for each fix.",
            "公開專案使用 React、React Router、Material UI 與 i18next。維護時需要讓修改符合既有路由、元件與語言行為，避免每修一個功能，就出現另一套不一致的版面。",
          ),
        ],
      },
      {
        id: "my-role",
        title: t("My contribution", "我負責的部分"),
        paragraphs: [
          t(
            "As an Information Department member, I supported design, maintenance and content coordination. Public commits support the upload-guidelines dialog and branding changes. The site has multiple contributors; this page describes my contributions rather than claiming ownership of every resource feature.",
            "我以系學會資訊部成員身分參與設計、維護與內容協調。公開提交能對應到上傳說明視窗和品牌更新。網站由多人共同維護，這裡介紹的是我的貢獻，不是把全部資源功能都算成個人開發。",
          ),
        ],
      },
      {
        id: "tradeoffs",
        title: t(
          "Public interface and protected content",
          "公開介面與受限資源",
        ),
        paragraphs: [
          t(
            "A public landing page does not imply that every resource is open to everyone. Screenshots here show the public interface only; no account was used to inspect restricted exam files, private student content or administration.",
            "公開首頁不代表所有資源都對所有人開放。這裡的截圖只呈現公開介面，沒有登入查看受限考古題、私人學生內容或管理資料。",
          ),
        ],
      },
      {
        id: "lessons",
        title: t("What I learned", "維護經驗與後續方向"),
        paragraphs: [
          t(
            "A small broken download can interrupt an otherwise useful service. This work reinforced the importance of checking the complete user action, not just whether a component renders. Ongoing priorities are link checks, accessible instructions and consistent presentation across resource pages.",
            "一個失效的下載就可能中斷原本實用的服務。這段經驗讓我更重視完整操作是否能完成，而不只是元件有沒有顯示。後續維護會持續檢查連結、說明的可讀性，以及不同資源頁的一致性。",
          ),
        ],
      },
    ],
    evidence: [
      {
        label: t("My upload-guidelines change", "我的上傳說明功能提交"),
        url: "https://github.com/cpcap1214/NTUIM/commit/7f146c1734c99dedd45225ab201441af9b669693",
        detail: t(
          "Replaces the broken download with an in-app guidelines dialog.",
          "將失效下載改為站內說明視窗。",
        ),
      },
      {
        label: t("My branding contribution", "我的品牌素材更新"),
        url: "https://github.com/cpcap1214/NTUIM/commit/22b1d18d7f5ea17539d74314c190a5a6e78608a0",
        detail: t(
          "An attributed update within the shared site.",
          "共同網站中可追溯的品牌更新。",
        ),
      },
    ],
  },
  "ntu-im-orientation-2025": {
    sections: [
      {
        id: "overview",
        title: t("What this project involved", "這個專案在做什麼"),
        paragraphs: [
          t(
            "The 2025 NTU IM orientation camp combines an event with its supporting website and coordination work. The goal was to help incoming students meet the department while making the information needed by participants and organizers understandable and consistent.",
            "2025 台大資管迎新宿營包含活動本身、配合的網站，以及籌備協調工作。目的是讓新生認識系上，也讓參加者和工作人員取得一致、清楚的活動資訊。",
          ),
        ],
      },
      {
        id: "workflow",
        title: t("From preparation to the event", "從籌備到現場執行"),
        paragraphs: [
          t(
            "The work connects program planning, administrative/logistical arrangements and website-development coordination. An event's schedule and instructions need to agree with what the team can actually deliver on site, so online communication and offline execution cannot be treated independently.",
            "工作橫跨活動設計、行政後勤與網站開發協調。對外的時程和說明需要符合團隊現場能執行的內容，因此線上資訊與線下活動不能各自運作。",
          ),
        ],
      },
      {
        id: "website",
        title: t("The website's role", "網站在活動中的角色"),
        paragraphs: [
          t(
            "The event website is part of the shared communication around the camp. My documented role is coordinating website development alongside the larger event plan; the available evidence does not establish that I wrote every page or identify a verified frontend stack.",
            "活動網站是共同對外溝通的一部分。可確認的分工是我配合整體籌備協調網站開發，目前資料不足以宣稱每一頁都由我撰寫，也不另外推測網站使用的框架。",
          ),
        ],
      },
      {
        id: "my-role",
        title: t("My contribution", "我負責的部分"),
        paragraphs: [
          t(
            "My résumé records deputy general coordination: supporting program planning, logistics and the camp website. The contribution is organizing dependencies and helping different workstreams reach the event together, within a team of organizers.",
            "依履歷記錄，我擔任副總召，協助活動設計、行政後勤與宿營網站。這項工作的重點是協調彼此依賴的任務，讓不同組別能一起完成活動，成果屬於整個籌備團隊。",
          ),
        ],
      },
      {
        id: "scope",
        title: t("Evidence and current availability", "資料來源與網站狀態"),
        paragraphs: [
          t(
            "The role and website address come from the supplied résumé. The website's domain could not be resolved during the October 2026 capture attempt, so no broken-page screenshot is used and current service availability is not promised.",
            "經歷與網站網址來自個人履歷。2026 年 10 月擷取時，網站網域無法解析，因此不放入錯誤頁截圖，也不保證目前仍可連線。",
          ),
        ],
      },
      {
        id: "lessons",
        title: t("What I learned", "協作經驗"),
        paragraphs: [
          t(
            "Event coordination made the cost of unclear ownership and stale information concrete. A better handoff identifies an owner, a dependency and a confirmed version of each public instruction. Those habits also apply to shipping software with several contributors.",
            "活動協調讓我實際理解分工不清、資訊過期會造成什麼影響。交接需要說清楚負責人、前置需求，以及哪一版對外資訊已確認；這些習慣也適用於多人共同開發軟體。",
          ),
        ],
      },
    ],
  },
  "nasa-systems-course": {
    sections: [
      {
        id: "overview",
        title: t("What these labs cover", "這系列實作在做什麼"),
        paragraphs: [
          t(
            "Network & System Administration is a collection of hands-on Linux and networking coursework, rather than one finished product. The work practices configuring services, understanding permissions and diagnosing why a network or host behaves differently from the intended setup.",
            "網路與系統管理實作是一系列 Linux 與網路課程作業，而非單一成品。內容著重服務設定、權限理解，以及當主機或網路的行為不符合預期時，如何逐步定位問題。",
          ),
        ],
      },
      {
        id: "topics",
        title: t("Topics practiced", "實作主題"),
        paragraphs: [
          t(
            "The résumé describes Linux, storage, networking and virtualized environments; the public repository contains homework reports, lab artifacts, C exercises and shell judging scripts. Together they document coursework and experimentation, not operation of a production fleet.",
            "履歷涵蓋 Linux、儲存、網路與虛擬化環境；公開儲存庫則保存作業報告、實驗紀錄、C 練習與 shell 評測腳本。這些呈現課程實作與探索，不代表管理正式營運的大型環境。",
          ),
        ],
        bullets: [
          t(
            "Linux users, permissions, storage and service behavior.",
            "Linux 使用者、權限、儲存與服務行為。",
          ),
          t(
            "VLANs, DNS/DHCP and firewall configuration.",
            "VLAN、DNS／DHCP 與防火牆設定。",
          ),
          t(
            "Virtual-machine and container environments.",
            "虛擬機與容器環境。",
          ),
          t(
            "Troubleshooting and documenting configuration outcomes.",
            "故障排查與設定結果的文件化。",
          ),
        ],
      },
      {
        id: "workflow",
        title: t("How the work is documented", "如何保留實作過程"),
        paragraphs: [
          t(
            "The repository organizes work by assignment. Reports and lab captures provide context for configuration decisions, while source and shell files preserve executable exercises. Reading a report alongside the corresponding artifacts is more informative than a list of tool names.",
            "儲存庫依作業整理內容，報告與實驗截圖提供設定脈絡，程式和 shell 檔案則保留可執行練習。對照報告及相關檔案，能比單純列出工具名稱更清楚地理解做過哪些事。",
          ),
        ],
      },
      {
        id: "my-role",
        title: t("My contribution", "我負責的部分"),
        paragraphs: [
          t(
            "I completed hands-on administration labs and recorded configuration and troubleshooting outcomes as coursework. The broader topic list is based on my résumé; this portfolio does not claim that every submitted environment has been recreated or independently retested.",
            "我完成系統管理實驗，整理設定和排錯結果。較完整的主題範圍依履歷記錄呈現；作品集沒有將所有繳交環境重新搭建，也不將原始報告當成這次重新測試的結果。",
          ),
        ],
      },
      {
        id: "tradeoffs",
        title: t("Scope and limits", "範圍與限制"),
        paragraphs: [
          t(
            "Lab machines and course networks have different assumptions from an internet-facing service. Successful coursework does not by itself establish operational availability, hardened access control or capacity. Reports are linked for context without exposing internal credentials or copying machine identifiers into the page.",
            "實驗主機與課程網路的假設，和面向外部使用者的服務不同。完成作業不等於已驗證正式服務的可用性、權限強度或承載量。頁面連到公開資料供延伸閱讀，不另行轉載內部憑證或機器識別資訊。",
          ),
        ],
      },
      {
        id: "lessons",
        title: t("What I learned", "學到的方法"),
        paragraphs: [
          t(
            "The recurring lesson is to test each boundary: name resolution, network reachability, service state and permissions. A useful report records both the intended configuration and the evidence that distinguishes one possible cause from another.",
            "反覆練習後最重要的方法，是分層檢查名稱解析、網路連通、服務狀態與權限。好的紀錄不只寫預期設定，也要保留能區分不同問題原因的證據。",
          ),
        ],
      },
    ],
  },
  "one-more-time": {
    sections: [
      {
        id: "overview",
        title: t("What the game is", "這是什麼遊戲"),
        paragraphs: [
          t(
            "One More Time is a third-person action-game prototype built in Unity. Its core is a repeatable combat encounter: observe a boss, time a dodge and use the opening to counterattack. Camera and presentation work help make those combat states readable.",
            "One More Time 是以 Unity 製作的第三人稱動作遊戲原型，核心是可以反覆挑戰的戰鬥：觀察頭目、抓準閃避時機，再利用空檔反擊。鏡頭和演出則協助玩家讀懂戰鬥狀態。",
          ),
        ],
      },
      {
        id: "features",
        title: t("Implemented systems", "已整合的系統"),
        paragraphs: [
          t(
            "The reviewed source combines movement/combat, timed dodge/counter windows, a staged boss encounter, camera coordination and bilingual menus. A leaderboard component and WebGL delivery configuration connect the game to a possible distribution workflow.",
            "已檢視的程式串起移動與戰鬥、閃避反擊時機、多階段頭目戰、鏡頭協調及中英文選單，並包含排行榜元件與 WebGL 交付設定，銜接未來的發布流程。",
          ),
        ],
        bullets: [
          t(
            "Third-person movement and timed melee interactions.",
            "第三人稱移動與講究時機的近戰互動。",
          ),
          t(
            "Dodge/counter windows and a staged boss encounter.",
            "閃避反擊窗口與分階段頭目戰。",
          ),
          t(
            "Coordinated cameras, menus and localization fallbacks.",
            "協調戰鬥鏡頭、選單與多語系備援文字。",
          ),
          t(
            "Leaderboard request handling with a persisted retry queue.",
            "排行榜請求及保留到本機的失敗重試佇列。",
          ),
        ],
      },
      {
        id: "implementation",
        title: t("Implementation focus", "技術實作重點"),
        paragraphs: [
          t(
            "Unity 6, C# and URP provide the runtime and rendering. Separate components coordinate combat, encounter state, cameras and menus. Unity Localization tables are supplemented with bundled text/font fallbacks, while asynchronous leaderboard access has retry handling.",
            "遊戲以 Unity 6、C# 與 URP 開發，由不同元件協調戰鬥、遭遇狀態、鏡頭和選單。Unity Localization 表格搭配內建文字／字型備援；非同步排行榜連線則加入重試處理。",
          ),
        ],
      },
      {
        id: "my-role",
        title: t("My contribution", "我負責的部分"),
        paragraphs: [
          t(
            "I developed and integrated the personal prototype with AI assistance, connecting combat, presentation and localization, and adding WebGL delivery work and leaderboard retries. Imported art, animation, audio and third-party packages are not claimed as assets I created.",
            "我在 AI 輔助下開發及整合這個個人原型，串起戰鬥、演出與多語系功能，並加入 WebGL 交付與排行榜重試。匯入的美術、動畫、音效及第三方套件，不會被當成我自行創作的素材。",
          ),
        ],
      },
      {
        id: "tradeoffs",
        title: t("Prototype and publication limits", "原型與公開限制"),
        paragraphs: [
          t(
            "The source is private and no proprietary assets or screenshots are copied into this site. Full playthrough, cloud build success and performance were not independently verified. Leaderboard scores are client-reported, so retry support should not be confused with anti-cheat validation.",
            "原始碼未公開，作品集不複製私人素材或截圖。目前沒有重新驗證完整遊玩流程、雲端建置與效能；排行榜分數由客戶端回報，重試機制也不等同防作弊驗證。",
          ),
        ],
      },
      {
        id: "next-steps",
        title: t("What I learned", "心得與後續方向"),
        paragraphs: [
          t(
            "Combat interaction depends on several systems agreeing on timing. Further work would test dodge windows and boss-phase transitions, validate interrupted leaderboard requests and complete browser-build, readability and asset-rights checks before a public release.",
            "戰鬥手感需要不同系統對時機有一致理解。後續會測試閃避窗口、頭目階段轉換和排行榜請求中斷，並在公開發布前完成瀏覽器版本、可讀性與素材授權檢查。",
          ),
        ],
      },
    ],
  },
  "laughing-jianghu": {
    sections: [
      {
        id: "overview",
        title: t("What the game is", "這是什麼遊戲"),
        paragraphs: [
          t(
            "Laughing Jianghu is a single-player strategy prototype about influencing a martial-arts tournament from behind the scenes. Instead of directly controlling a fighter, the player uses limited interventions to affect matches while managing suspicion.",
            "笑嗷江糊：不講武德大會是一款單人策略原型，玩家從幕後影響武林賽事。你不是直接操作選手，而是在有限時機介入比賽，同時控制被懷疑的程度。",
          ),
        ],
      },
      {
        id: "gameplay",
        title: t("What the player does", "玩家怎麼玩"),
        paragraphs: [
          t(
            "The player reviews the roster and commits to a tournament outcome, then chooses music, commentary and arena interventions at specific points. Those decisions change attack/defence conditions, but excessive interference raises suspicion and can override the ending.",
            "玩家先查看選手並決定支持的賽果，再在指定時機選擇音樂、轉播與場地干預。選擇會影響攻防條件，但過度介入會提高懷疑值，甚至改變最後結局。",
          ),
          t(
            "The tournament and settlement are simulated locally. The ledger and payouts are fictional game rules, not a real-money service. Replaying with a controlled seed helps inspect how an intervention changes the outcome.",
            "賽事與結算都在本機模擬，帳本和賠付是遊戲中的虛構規則，沒有真實金錢交易。固定隨機種子後，可以重新觀察不同干預如何影響結果。",
          ),
        ],
      },
      {
        id: "implementation",
        title: t("Simulation and presentation", "模擬與畫面如何分工"),
        paragraphs: [
          t(
            "Godot/GDScript separates the seeded tournament model from UI, arena drawing and audio. game_model.gd owns combat phases, intervention effects, suspicion and settlement; other scripts render the action, crossfade audio and handle cards and decision windows.",
            "Godot／GDScript 將有隨機種子的賽事模型與 UI、場景繪製、音訊分開。game_model.gd 處理攻擊階段、干預效果、懷疑值與結算，其他腳本負責演出、音樂淡入淡出、卡片及決策視窗。",
          ),
          t(
            "The repository includes model/regression tests and a strategy test exploring reachable champions. Their presence makes the rule layer inspectable; previously reported pass totals are not treated as tests rerun by this portfolio.",
            "儲存庫包含模型與回歸測試，以及探索可達冠軍結果的策略測試，讓規則層能被檢查；原 README 的通過數不會被當成這次作品集重新執行的結果。",
          ),
        ],
      },
      {
        id: "my-role",
        title: t("My contribution", "我負責的部分"),
        paragraphs: [
          t(
            "I implemented simulation and game presentation, and integrated a collaborator's tournament UI and fighter-support charts. The asset ledger identifies AI-generated artwork, programmatically generated audio and a licensed font, so those sources remain distinct from code authorship.",
            "我實作賽事模擬與遊戲呈現，並整合協作者完成的賽程 UI 和選手支持度圖表。素材清單也記錄 AI 生成美術、程式生成音訊與授權字型，這些來源會和程式貢獻分開說明。",
          ),
        ],
      },
      {
        id: "tradeoffs",
        title: t("Prototype boundaries", "目前範圍與限制"),
        paragraphs: [
          t(
            "The game is a small prototype, not a commercial or multiplayer release. Character motion is made from illustrated assets rather than a complete hand-drawn animation set. Deterministic tests help inspect rules but do not establish whether the timing, explanations and humour are clear to new players.",
            "這是小型原型，並非商業或多人連線作品。角色動作由插圖變形呈現，不是一整套手繪逐格動畫。固定種子的測試能檢查規則，但不能取代新玩家對節奏、說明和笑點的實際體驗。",
          ),
        ],
      },
      {
        id: "lessons",
        title: t("What I learned", "心得與後續方向"),
        paragraphs: [
          t(
            "Separating model and presentation makes it possible to verify a full tournament without depending on animation. Next I would use short playtests to improve the decision-window instructions and visual explanations, while keeping the underlying seeded scenarios reproducible.",
            "把模型和演出分開後，就能不依賴動畫驗證完整賽程。下一步會透過短時間試玩，改善決策視窗說明與視覺提示，同時保留可重現的種子情境，方便回查問題。",
          ),
        ],
      },
    ],
    evidence: [
      {
        label: t("Game rules and structure", "遊戲規則與結構"),
        url: "https://github.com/CdyTim630/laughing-jianghu-godot/blob/92ab517cc5127c4e2345af4c263ffd88540a13dd/README.md",
        detail: t(
          "Tournament flow, interventions, source layout and export instructions.",
          "賽事流程、干預機制、程式結構與匯出方式。",
        ),
      },
      {
        label: t("Seeded simulation model", "隨機種子控制的模擬模型"),
        url: "https://github.com/CdyTim630/laughing-jianghu-godot/blob/92ab517cc5127c4e2345af4c263ffd88540a13dd/scripts/game_model.gd",
        detail: t(
          "Rules, phase transitions, suspicion and settlement.",
          "規則、階段轉換、懷疑值與結算。",
        ),
      },
      {
        label: t("Asset provenance", "美術與音訊來源"),
        url: "https://github.com/CdyTim630/laughing-jianghu-godot/blob/92ab517cc5127c4e2345af4c263ffd88540a13dd/LICENSES.md",
        detail: t(
          "AI artwork, generated audio and font attribution.",
          "AI 美術、生成音訊與字型的來源說明。",
        ),
      },
    ],
  },
  "2048-browser-game": {
    sections: [
      {
        id: "overview",
        title: t("What it does", "這個專案在做什麼"),
        paragraphs: [
          t(
            "This is a small browser implementation of the familiar 2048 puzzle. Move tiles in one of four directions, merge matching values and try to create a 2048 tile before the board runs out of moves.",
            "這是經典 2048 的瀏覽器實作。玩家朝四個方向移動方塊，讓相同數字合併，在棋盤無法再移動前，嘗試做出 2048。",
          ),
        ],
      },
      {
        id: "features",
        title: t("Controls and feedback", "操作與回饋"),
        paragraphs: [
          t(
            "Keyboard arrows and touch gestures feed the same four-direction movement logic. The interface displays current/best scores, provides reset and one-step undo, and shows win/loss feedback.",
            "鍵盤方向鍵與觸控手勢使用同一套四向移動邏輯。介面顯示目前與最高分數，提供重開和單步復原，並呈現勝利或無法移動的狀態。",
          ),
        ],
      },
      {
        id: "implementation",
        title: t("How it is built", "技術實作"),
        paragraphs: [
          t(
            "A single HTML file contains the layout, CSS and a plain-JavaScript game class. The game updates board state, compresses and merges rows/columns, adds a new tile and refreshes the view. Browser storage keeps the best score across visits.",
            "單一 HTML 檔案包含版面、CSS 與原生 JavaScript 遊戲類別。程式依序處理棋盤狀態、行列壓縮與合併、加入新方塊，再更新畫面；最高分則保存在瀏覽器中。",
          ),
          t(
            "Undo restores the previous move's saved state rather than trying to infer it from the current board. This makes state snapshots a visible feature in a compact implementation without introducing a framework or backend.",
            "復原會讀取上一動保存的狀態，而不是從目前棋盤反推。透過一個小型功能，就能練習狀態快照的使用，也不需要另外加入框架或後端。",
          ),
        ],
      },
      {
        id: "my-role",
        title: t("My contribution", "我負責的部分"),
        paragraphs: [
          t(
            "I implemented the single-page game logic, browser input and interface. It is an implementation of an existing game's rules, not a claim to have invented 2048 or created a new solving algorithm.",
            "我實作單頁遊戲邏輯、瀏覽器輸入和操作介面。這是既有遊戲規則的程式實作，不代表發明 2048，也沒有加入新的求解演算法。",
          ),
        ],
      },
      {
        id: "tradeoffs",
        title: t("Current limits", "目前限制"),
        paragraphs: [
          t(
            "The reviewed version has no automated suite. Delayed tile creation is not guarded against every overlapping input/reset case, and the on-screen mouse-drag instruction goes beyond the keyboard/touch handlers found in the source. The portfolio describes only the verified input methods.",
            "已檢視的版本沒有自動化測試，延遲產生方塊也尚未完整防護快速連續輸入或重開的情況。畫面雖提到滑鼠拖曳，原始碼可確認的處理是鍵盤與觸控，因此介紹以這兩種操作為準。",
          ),
        ],
      },
      {
        id: "lessons",
        title: t("What I learned", "心得與後續方向"),
        paragraphs: [
          t(
            "The exercise makes state transitions concrete: one input must produce one valid move, one undo state and the right score. Next would be deterministic board fixtures for merge ordering, no-op moves, undo and rapid reset/input sequences.",
            "這個練習讓狀態轉換變得具體：一次輸入需要對應一次有效移動、正確的復原狀態與分數。下一步會建立固定棋盤測試，檢查合併順序、無效移動、復原及快速重開／輸入。",
          ),
        ],
      },
    ],
  },
};
