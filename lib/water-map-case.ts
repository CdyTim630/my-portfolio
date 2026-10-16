import type { Project } from "./projects";
import {
  applyProjectNarrative,
  copy as t,
  type ProjectNarrative,
} from "./project-narrative";

const repo = "https://github.com/CdyTim630/ntu_water_map";
const source = `${repo}/blob/87cce94ba07d3977733b61992ee9c44905348cb1`;

const narrative: ProjectNarrative = {
  sections: [
    {
      id: "overview",
      title: t("What the project does", "這個專案在做什麼"),
      paragraphs: [
        t(
          "NTU Water Risk Map brings campus water reports, weather and route planning into one website. Students can locate standing water or leaking facilities, report a problem and compare a shortest route with a route that considers rain and known trouble spots.",
          "台大水資源問題地圖把校園水情回報、氣象資訊與路線規劃整合在同一個網站。師生可以查看哪裡積水、哪項設施漏水，新增問題回報，也能比較最短路徑與考量雨勢、遮蔽及積水狀況的建議路線。",
        ),
        t(
          "The six-person Introduction to Water Resources project also explores the management side: how to turn scattered reports into trends, maintenance priorities and a readable summary. My work focused on project integration and the route-planning algorithms.",
          "這是六人團隊的「水資源概論」課程專題。除了讓使用者知道雨天怎麼走，也希望將分散的回報整理成趨勢、維修優先序與易讀的管理摘要。我主要負責專案整合與路徑規劃演算法。",
        ),
      ],
      bullets: [
        t(
          "Campus map: filter water reports by type, severity and status, and confirm whether an issue still exists or has been resolved.",
          "校園地圖：依類型、嚴重度與處理狀態查看回報，並回覆問題「還在」或「已解決」。",
        ),
        t(
          "Rain-aware routing: choose endpoints and walking/cycling mode, then compare distance, cover and water-related obstacles.",
          "雨天路徑：選擇起終點與步行／騎車模式，比較兩條路線的距離、遮蔽比例及積水狀況。",
        ),
        t(
          "Water stations and participation: locate drinking fountains, report their condition and keep personal activity records locally.",
          "飲水機與個人紀錄：查找飲水機、回報設備狀態，並在本機保存參與紀錄與徽章。",
        ),
        t(
          "Management views: review report trends and risk hotspots, export data and read a rule-based or Gemini-assisted maintenance summary.",
          "管理分析：查看回報趨勢與風險熱點、匯出資料，並閱讀規則分析或 Gemini 協助整理的維修摘要。",
        ),
      ],
    },
    {
      id: "my-role",
      title: t("My contribution", "我負責的部分"),
      paragraphs: [
        t(
          "The report's team-allocation table assigns me project integration and route-planning algorithms. That means connecting geographic inputs, current weather and active reports to the route service, and making its output usable by the map and comparison interface.",
          "期末報告的分工表明確列出我負責「專案整合、路徑規劃演算法」。我的重點是串起路網、氣象與有效回報，讓路線服務的結果能被地圖和比較介面直接使用。",
        ),
        t(
          "Other team members were responsible for frontend interaction, data cleaning and risk scoring, backend/deployment/testing, scenario and data-source review, and hydrological context. The full product is the team's result; this case does not assign every page or API to me.",
          "其他成員分別負責前端互動、資料清理與風險評分、後端與部署測試、使用情境與資料來源檢核，以及水文與積淹水區域分析。整個平台是團隊成果，本案例不將所有頁面或 API 都算成我的個人作品。",
        ),
      ],
    },
    {
      id: "problem-and-constraints",
      title: t("The problem and its constraints", "問題與使用情境"),
      paragraphs: [
        t(
          "A short route is not always the most comfortable route in the rain. A covered passage, a low-lying segment and a recently reported puddle matter at campus scale, but a plain distance calculation does not account for them. Meanwhile, reports scattered across posts and forms are difficult to connect to a location or follow up.",
          "雨天在校園移動時，最短不一定最好走。騎樓、低窪路段與剛被回報的積水，都可能影響選路，但單純比較距離無法反映這些差異。分散在貼文和表單中的問題，也不容易定位或持續追蹤。",
        ),
        t(
          "The prototype needs to remain demonstrable without external credentials. Weather and storage therefore have mock paths. Route recommendations depend on the completeness of the map and reports; they are a planning aid, not a guarantee that a path is dry or safe during severe weather.",
          "為了讓課程展示不依賴外部憑證，氣象與資料儲存都保留模擬模式。建議路線仍受路網和回報完整度影響，定位是選路參考，不能保證現場沒有積水，也不能取代極端天氣下的安全判斷。",
        ),
      ],
    },
    {
      id: "architecture",
      title: t("How the system fits together", "系統怎麼串在一起"),
      paragraphs: [
        t(
          "Next.js serves the application and API routes; React Leaflet handles the interactive map and Recharts presents management data. The dense OSM-derived GeoJSON network stays on the server, where the route algorithm runs, instead of becoming a large browser download.",
          "Next.js 提供網站與 API，React Leaflet 負責互動地圖，Recharts 呈現管理圖表。由 OSM 整理的密集 GeoJSON 路網保留在伺服器端，路徑也在伺服器計算，避免把整份圖資送到瀏覽器。",
        ),
        t(
          "Weather is obtained through a server-side CWA adapter. Report access switches between an in-memory demo store and optional Supabase; personal participation records use localStorage. Dashboard logic calculates structured findings first, then optionally asks Gemini to rewrite them into a management summary.",
          "氣象透過伺服器端的中央氣象署資料轉接層取得；回報資料可使用記憶體中的展示資料，或選擇接上 Supabase。個人參與紀錄保存在 localStorage。儀表板先算出結構化結果，再選擇交給 Gemini 整理為管理摘要。",
        ),
      ],
    },
    {
      id: "data-flow",
      title: t(
        "From a selected destination to a route",
        "從選擇目的地到產生路線",
      ),
      paragraphs: [
        t(
          "The client sends the start/end coordinates, travel mode and rain options to /api/route. The API reads weather and current reports concurrently, snaps endpoints to usable graph vertices, and computes both a weighted recommendation and a distance-only reference route.",
          "前端將起終點座標、交通模式與雨勢選項送到 /api/route。API 同時讀取氣象與目前回報，再將起終點對應到可使用的路網節點，分別計算加權建議路線與只考慮距離的最短路線。",
        ),
        t(
          "The response includes polylines and segment information, not just a final score. The comparison uses report-ID sets to count which reported obstacles the recommendation avoids, alongside detour distance, covered-path gain and reduced low-lying distance.",
          "回應除了路線折線，也包含各路段資訊。比較時以回報 ID 的集合差計算實際避開哪些積水點，再一併呈現多走的距離、遮蔽比例差異與減少的低窪路段，讓使用者知道為什麼要繞路。",
        ),
      ],
    },
    {
      id: "technical-implementation",
      title: t("Routing implementation", "路徑規劃的實作重點"),
      paragraphs: [
        t(
          "The routing module builds an adjacency graph and uses Dijkstra with a binary min-heap. Edge costs combine distance with uncovered exposure, low-lying segments and nearby active flooding/standing-water reports. Resolved or rejected reports do not contribute to the penalty, and bike-ineligible edges are excluded for cycling routes.",
          "路徑模組以鄰接表表示路網，使用二元最小堆積實作 Dijkstra。邊權將距離與露天暴露、低窪路段，以及附近仍有效的淹水／積水回報結合；已解決或遭駁回的回報不納入懲罰，騎車時也會排除不允許自行車的邊。",
        ),
        t(
          "The source applies nonlinear exposure weighting and additional penalties for clustered reports. The report and README describe an older, simpler formula; this case follows the linked implementation rather than copying that formula or presenting its sample detour/coverage figures as general performance results.",
          "目前程式對露天程度使用非線性權重，並對群聚回報加重懲罰。報告和 README 中的簡化公式較早，本案例以連結的實作為準，不直接沿用舊公式，也不把展示中的繞行距離或遮蔽提升當成所有情境都成立的成效。",
        ),
      ],
    },
    {
      id: "engineering-decisions",
      title: t("Why show two routes?", "為什麼同時顯示兩條路？"),
      paragraphs: [
        t(
          "Showing a recommendation beside the shortest route makes the trade-off visible. Instead of asking users to trust a single colored line, the interface exposes what they gain in cover or obstacle avoidance and what they give up in walking distance.",
          "建議路線與最短路徑並列，能直接說明取捨。使用者不用只相信一條彩色線，而是可以看見多走多少距離，換來多少遮蔽或避開哪些問題點，再決定要走哪一條。",
        ),
        t(
          "Map tags, manual low-lying annotations and community reports are kept as separate inputs. Likewise, management statistics remain separate from AI prose: useful calculations can still be shown when the model is unavailable, and a generated summary does not become the routing or risk model itself.",
          "地圖標籤、人工標記的低窪區與社群回報是不同來源，分開處理才方便追查。管理統計也與 AI 文字分開：模型不可用時仍能顯示分析結果，生成摘要不會被誤當成路徑或風險模型本身。",
        ),
      ],
    },
    {
      id: "challenges-and-tradeoffs",
      title: t("Data quality and prototype boundaries", "資料品質與目前限制"),
      paragraphs: [
        t(
          "Covered-path tags and manually marked low areas are approximations. Community report density is affected by participation, and the forecast view uses rules rather than a calibrated flood-probability model. Dashboard regression also contains demonstration inputs, so its fit cannot establish real-world predictive accuracy.",
          "遮蔽標籤與人工圈選的低窪區仍是近似資料；回報密度也會受參與意願影響。預警頁使用的是規則估算，並非經過校準的淹水機率模型；儀表板回歸亦含展示用輸入，不能據此宣稱真實預測準確率。",
        ),
        t(
          "In-memory reports reset across process restarts. The optional database and administrator flows also require further integration testing before operational use. These limits are why the site is presented as a course prototype, even though the repository includes deployment configuration and a public demo address.",
          "記憶體中的回報會隨程序重啟而重設；選用資料庫與管理流程也需要進一步整合測試，才能用於實際維運。因此，即使儲存庫提供部署設定和展示網址，這裡仍將作品定位為課程原型。",
        ),
      ],
    },
    {
      id: "results-and-evidence",
      title: t("What was delivered", "完成了哪些成果"),
      paragraphs: [
        t(
          "The repository contains the application, route engine, data-building scripts, a ten-page final report and presentation slides. The original report screenshots show both the campus map and the rain-route comparison. They are project demonstration captures, not evidence of adoption or measured service reliability.",
          "GitHub 保存了網站、路徑引擎、圖資建立腳本、10 頁期末報告與簡報。報告的實際截圖呈現校園地圖和雨天路線比較；這些是作品展示畫面，不代表已在校園正式採用或完成服務可靠度量測。",
        ),
        t(
          "The report gives the cross-disciplinary team allocation and explains how reporting, routing and management analysis connect. Direct links to the PDF, presentation and relevant source files are provided below so readers can inspect more than the portfolio summary.",
          "報告也交代跨領域團隊分工，說明回報、路線規劃與管理分析如何連結。下方附上 PDF、簡報與相關原始碼，讓讀者可以從作品集繼續追到完整內容。",
        ),
      ],
    },
    {
      id: "lessons-learned",
      title: t("What I learned and would improve", "心得與後續方向"),
      paragraphs: [
        t(
          "The important integration work was preserving meaning across layers: an issue's status changes whether it affects a route, a map segment needs traceable attributes, and a detour should have an understandable reason. A route algorithm becomes useful when those details survive all the way to the interface.",
          "這次整合最重要的是讓資料在不同層之間保留原本的意義：回報狀態會影響是否加入路徑成本，路段屬性需要能追溯，繞路也要有看得懂的理由。演算法的結果能一路被介面清楚表達，才真正有用。",
        ),
        t(
          "A next iteration would add reproducible routing fixtures for no-path, bicycle restrictions, resolved reports and changing rain, then check route quality against observed campus conditions. Durable storage, authenticated administration and clearer labels for mock inputs would come before a broader rollout.",
          "下一步會先建立可重現的路徑測試，涵蓋無路可走、自行車限制、已解決回報與不同雨勢，再以校園實地觀察檢查建議品質。若要擴大使用，則需先完成可靠儲存、管理員驗證，以及更清楚的模擬資料標示。",
        ),
      ],
    },
  ],
  architecture: [
    {
      label: t("Interactive campus map", "互動校園地圖"),
      detail: t(
        "Leaflet displays reports, water stations and comparable route polylines.",
        "Leaflet 顯示回報、飲水機與兩條可比較的路線。",
      ),
    },
    {
      label: t("Route and report APIs", "路線與回報 API"),
      detail: t(
        "Next.js gathers weather and report inputs and returns route/management data.",
        "Next.js 彙整氣象與回報，提供路徑和管理資料。",
      ),
    },
    {
      label: t("Graph and data adapters", "路網與資料存取"),
      detail: t(
        "OSM GeoJSON, weighted Dijkstra, CWA weather and optional Supabase or mock storage.",
        "OSM GeoJSON、加權 Dijkstra、氣象署資料及選用的 Supabase／模擬儲存。",
      ),
    },
    {
      label: t("Management analysis", "管理分析"),
      detail: t(
        "Rule-based statistics and priorities, with optional Gemini summaries.",
        "先計算統計與維修優先序，再選用 Gemini 生成摘要。",
      ),
    },
  ],
  images: [
    {
      src: "/projects/ntu-water-map/route.webp",
      alt: t(
        "NTU water-map route screen comparing a green rain-aware path and a gray shortest route",
        "台大水資源地圖的雨天路徑畫面，並列綠色建議路線與灰色最短路徑",
      ),
      caption: t(
        "Original project report capture: route comparison with demonstration inputs. Source: report/screens/route.png at 87cce94; not a benchmark.",
        "專案報告原始截圖：雨天路線比較，畫面含展示資料。來源為 87cce94 版本的 report/screens/route.png，數字不作為效能或成效證明。",
      ),
    },
  ],
  evidence: [
    {
      label: t("Final report (PDF)", "完整期末報告（PDF）"),
      url: `${source}/report/report.pdf`,
      detail: t(
        "Ten pages covering the problem, team allocation, features, architecture, routing and future work.",
        "10 頁書面報告，包含問題背景、團隊分工、功能、架構、路徑演算法與後續方向。",
      ),
    },
    {
      label: t("Project presentation (PDF)", "專案簡報（PDF）"),
      url: `${source}/report/ntu-water-risk-map-presentation.pdf`,
      detail: t(
        "The submitted presentation alongside the full report.",
        "與書面報告一併保存的專案簡報。",
      ),
    },
    {
      label: t("Report source and team roles", "報告原稿與團隊分工"),
      url: `${source}/report/report.tex#L151-L165`,
      detail: t(
        "Explicitly assigns project integration and route-planning algorithms to Ding-Yuan Chen.",
        "明確列出我負責專案整合與路徑規劃演算法。",
      ),
    },
    {
      label: t("Current routing implementation", "目前的路徑規劃實作"),
      url: `${source}/src/lib/denseGraph.ts`,
      detail: t(
        "Binary heap, route reconstruction, travel restrictions and current edge-cost rules.",
        "二元堆積、路徑重建、交通模式限制及目前的邊權規則。",
      ),
    },
    {
      label: t("Route-comparison API", "路線比較 API"),
      url: `${source}/src/app/api/route/route.ts`,
      detail: t(
        "Reads weather/reports and compares recommendation and shortest-route outputs.",
        "讀取氣象和回報，整理建議與最短路徑的比較結果。",
      ),
    },
    {
      label: t("OSM network construction", "OSM 路網建置"),
      url: `${source}/scripts/build-dense-graph.mjs`,
      detail: t(
        "Turns public OSM paths and annotated areas into the server-side campus graph.",
        "將 OSM 路徑與區域標記整理成伺服器使用的校園路網。",
      ),
    },
    {
      label: t("Forecast and management rules", "預警與管理規則"),
      url: `${source}/src/lib/forecast.ts`,
      detail: t(
        "Inspect the rule-based forecast rather than treating it as a validated hydrological model.",
        "可查看規則式預警的計算，與經驗證的水文模型有所區別。",
      ),
    },
  ],
};

const base: Project = {
  slug: "ntu-water-risk-map",
  title: "NTU Water Risk Map",
  summary:
    "A campus map that connects water-issue reporting, weather-aware route comparison and maintenance information.",
  year: 2026,
  role: "Project integration & route-planning algorithms",
  team: "Six-person Introduction to Water Resources course team",
  stack: [
    "Next.js",
    "TypeScript",
    "Leaflet",
    "Dijkstra",
    "GeoJSON",
    "Supabase",
    "Recharts",
  ],
  category: ["Full-stack", "Data"],
  featured: false,
  repository: repo,
  demo: "https://ntuwatermap.vercel.app/",
  images: [],
  sections: [],
  architecture: [],
  evidence: [],
  status: "Team course prototype",
  contribution:
    "Integrated the project and route-planning algorithms, connecting the campus graph, weather and active reports to explainable route comparisons.",
  visual: "portfolio",
};

export const waterMapCase = applyProjectNarrative(base, narrative, "en");
export const waterMapTranslation = applyProjectNarrative(
  {
    ...base,
    title: "台大水資源問題地圖",
    summary:
      "整合校園水情回報、雨天路線比較與維修資訊，讓問題能被看見，也能轉成實際的選路參考。",
    role: "專案整合與路徑規劃演算法",
    team: "六人水資源概論課程團隊",
    status: "團隊課程原型",
    contribution:
      "負責專案整合與路徑規劃演算法，將校園路網、氣象和有效回報串成能說明取捨的路線比較。",
  },
  narrative,
  "zh",
);
