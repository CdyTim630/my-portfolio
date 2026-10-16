import type { Project } from "./projects";
import { copy as t, type ProjectCopy } from "./project-narrative";

type Capture = { src: string; alt: ProjectCopy; caption: ProjectCopy };

/** Actual UI only. Capture dates, source revisions and boundaries: public/projects/captures/SOURCE.md. */
export const reviewedProjectMedia: Record<string, Capture[]> = {
  "ntu-water-risk-map": [
    {
      src: "/projects/ntu-water-map/route.webp",
      alt: t(
        "Rain-route screen comparing a recommendation and the shortest route",
        "雨天路線畫面，同時顯示建議與最短路徑",
      ),
      caption: t(
        "Original team-report capture at 87cce94. Contains demonstration inputs; displayed numbers are example results.",
        "團隊報告原始截圖（87cce94），包含展示資料；畫面數字是該次範例結果。",
      ),
    },
    {
      src: "/projects/captures/water-home.webp",
      alt: t(
        "Public campus map with reports, water stations and weather",
        "公開校園地圖，包含回報點、飲水機與氣象資訊",
      ),
      caption: t(
        "Public ntuwatermap.vercel.app homepage, 16 October 2026. No report was submitted; counts may include demonstration data.",
        "2026 年 10 月 16 日擷取 ntuwatermap.vercel.app 公開首頁，未新增回報；數量可能包含展示資料。",
      ),
    },
  ],
  "algorithm-visualizer": [
    {
      src: "/projects/captures/algorithm-sorting.webp",
      alt: t(
        "Deployed sorting lesson with input, playback controls and array bars",
        "已部署的排序教學，包含輸入、播放控制與陣列長條圖",
      ),
      caption: t(
        "Public GitHub Pages sorting interface, 16 October 2026. Shows the deployed version; no learning-outcome evaluation is implied.",
        "2026 年 10 月 16 日擷取 GitHub Pages 排序介面，呈現當時的部署版本，不代表學習成效評估。",
      ),
    },
  ],
  tomybaby: [
    {
      src: "/projects/captures/tomybaby-home.webp",
      alt: t(
        "ToMyBaby public landing page and conversation-practice entry",
        "ToMyBaby 公開首頁與對話練習入口",
      ),
      caption: t(
        "Public tomybaby.vercel.app homepage, 16 October 2026. No login, AI conversation or speech request was performed.",
        "2026 年 10 月 16 日擷取 tomybaby.vercel.app 公開首頁，未登入或送出 AI 對話與語音請求。",
      ),
    },
  ],
  "ntu-im-website": [
    {
      src: "/projects/captures/ntu-im-home.webp",
      alt: t(
        "Student-association homepage with course-review, exam and study-resource links",
        "系學會首頁的課程評價、考古題與學習資源入口",
      ),
      caption: t(
        "Public ntu.im homepage, 16 October 2026, without signing in or opening protected resources. Counts describe this capture only.",
        "2026 年 10 月 16 日未登入擷取 ntu.im 公開首頁，未開啟受限資源；數量僅代表當時畫面。",
      ),
    },
  ],
  "2048-browser-game": [
    {
      src: "/projects/captures/2048-game.webp",
      alt: t(
        "2048 board with score, reset and undo controls",
        "2048 棋盤、分數與重開及復原按鈕",
      ),
      caption: t(
        "Public GitHub Pages game, 16 October 2026, in a fresh browser context with an initial board.",
        "2026 年 10 月 16 日以新的瀏覽器環境擷取 GitHub Pages 遊戲初始棋盤。",
      ),
    },
  ],
  "convenience-store-meal-optimizer": [
    {
      src: "/projects/captures/meal-form.webp",
      alt: t(
        "Meal recommendation form with budget, preferences and solver controls",
        "餐點推薦表單的預算、偏好與求解器控制",
      ),
      caption: t(
        "Original results/figs/webapp_form.png at 828f7b4. Example inputs, not a personal health record or medical recommendation.",
        "專案原始截圖 results/figs/webapp_form.png（828f7b4），表單為示範輸入，不是個人健康紀錄或醫療建議。",
      ),
    },
    {
      src: "/projects/captures/meal-result.webp",
      alt: t(
        "Recommended product combination with nutrition and constraint summaries",
        "推薦商品組合、營養與限制摘要",
      ),
      caption: t(
        "Original results/figs/webapp_result.png at 828f7b4. Saved demonstration; the solver was not rerun.",
        "專案原始結果截圖 results/figs/webapp_result.png（828f7b4），為保存的展示，未重新執行求解器。",
      ),
    },
  ],
  "laughing-jianghu": [
    {
      src: "/projects/captures/jianghu-battle.webp",
      alt: t(
        "Rendered tournament battle with fighter status, music and commentary controls",
        "實際渲染的賽事戰鬥、選手狀態與音樂和轉播控制",
      ),
      caption: t(
        "Original docs/battle-preview.png at 92ab517. AI artwork and other asset credits appear in the project's LICENSES.md.",
        "儲存庫原始渲染圖 docs/battle-preview.png（92ab517），AI 美術及其他素材來源見專案 LICENSES.md。",
      ),
    },
  ],
};

/** Seed content only: owner-published CMS snapshots continue to take precedence. */
export function withReviewedProjectMedia(
  project: Project,
  locale: "en" | "zh",
): Project {
  const media = reviewedProjectMedia[project.slug];
  return media
    ? {
        ...project,
        images: media.map((item) => ({
          src: item.src,
          alt: item.alt[locale],
          caption: item.caption[locale],
        })),
      }
    : project;
}
