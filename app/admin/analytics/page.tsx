import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AnalyticsChart from "./AnalyticsChart";

// ─────────────────────────────────────────────
// 輔助：將裝置類型從 User-Agent 判斷
// ─────────────────────────────────────────────
function detectDevice(ua: string): "桌機" | "手機" | "平板" {
  if (!ua) return "桌機";
  const lower = ua.toLowerCase();
  if (/tablet|ipad/.test(lower)) return "平板";
  if (/mobile|android|iphone/.test(lower)) return "手機";
  return "桌機";
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // ── 時間基準 ──────────────────────────────
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // ── 取得過去 30 天資料 ────────────────────
  const { data: raw30d } = await supabase
    .from("page_views")
    .select("path, created_at, referrer, user_agent")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: false });

  // ── 取得全部時間總計 ──────────────────────
  const { count: totalViews } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true });

  const views = raw30d ?? [];

  // ── 計算各指標 ────────────────────────────
  const todayViews = views.filter(
    (v) => new Date(v.created_at) >= todayStart
  ).length;

  const weekViews = views.filter(
    (v) => new Date(v.created_at) >= weekAgo
  ).length;

  const uniquePages30d = new Set(views.map((v) => v.path)).size;

  // ── 每日分佈（過去 30 天）────────────────
  const dailyMap: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    dailyMap[d.toISOString().split("T")[0]] = 0;
  }
  views.forEach((v) => {
    const key = v.created_at.split("T")[0];
    if (key in dailyMap) dailyMap[key]++;
  });
  const chartData = Object.entries(dailyMap).map(([iso, count]) => ({
    date: new Date(iso).toLocaleDateString("zh-TW", {
      month: "numeric",
      day: "numeric",
    }),
    views: count,
  }));

  // ── 熱門頁面 ──────────────────────────────
  const pageMap: Record<string, number> = {};
  views.forEach((v) => {
    pageMap[v.path] = (pageMap[v.path] || 0) + 1;
  });
  const topPages = Object.entries(pageMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // ── 流量來源 ──────────────────────────────
  const refMap: Record<string, number> = {};
  views.forEach((v) => {
    if (!v.referrer) return;
    let label = v.referrer;
    try {
      label = new URL(v.referrer).hostname;
    } catch {
      /* ignore */
    }
    refMap[label] = (refMap[label] || 0) + 1;
  });
  const topReferrers = Object.entries(refMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // ── 裝置分佈 ──────────────────────────────
  const deviceMap: Record<string, number> = {
    桌機: 0,
    手機: 0,
    平板: 0,
  };
  views.forEach((v) => {
    const d = detectDevice(v.user_agent ?? "");
    deviceMap[d]++;
  });
  const deviceTotal = views.length || 1;

  // ── 最近 15 筆紀錄 ────────────────────────
  const recentViews = views.slice(0, 15);

  const maxPage = topPages[0]?.[1] ?? 1;
  const maxRef = topReferrers[0]?.[1] ?? 1;

  // ── 裝置圖示 ──────────────────────────────
  const deviceIcons: Record<string, React.ReactNode> = {
    桌機: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    手機: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    平板: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  };

  const deviceColors: Record<string, string> = {
    桌機: "#2563EB",
    手機: "#10B981",
    平板: "#F59E0B",
  };

  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* ── Header ── */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-sm text-[#71717A] hover:text-[#09090B] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Dashboard
            </Link>
            <span className="text-[#D4D4D8]">/</span>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#7C3AED] grid place-items-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-[#09090B]">網站分析</h1>
            </div>
          </div>
          <span className="text-xs text-[#71717A] bg-white border border-[#E4E4E7] px-3 py-1.5 rounded-full">
            資料範圍：過去 30 天
          </span>
        </header>

        {/* ── 統計卡片 ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "累計瀏覽",
              value: (totalViews ?? 0).toLocaleString(),
              sub: "全部時間",
              color: "#09090B",
              bg: "bg-white",
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ),
            },
            {
              label: "今日瀏覽",
              value: todayViews.toLocaleString(),
              sub: "今天 00:00 起",
              color: "#2563EB",
              bg: "bg-white",
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
              ),
            },
            {
              label: "本週瀏覽",
              value: weekViews.toLocaleString(),
              sub: "過去 7 天",
              color: "#10B981",
              bg: "bg-white",
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ),
            },
            {
              label: "瀏覽頁面數",
              value: uniquePages30d.toLocaleString(),
              sub: "不重複路徑",
              color: "#7C3AED",
              bg: "bg-white",
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`p-5 rounded-2xl ${stat.bg} border border-[#18181B]/10 shadow-sm`}
            >
              <div
                className="flex items-center justify-center h-9 w-9 rounded-xl mb-3"
                style={{ backgroundColor: stat.color + "15", color: stat.color }}
              >
                {stat.icon}
              </div>
              <div className="text-2xl font-black" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="mt-0.5 text-sm font-medium text-[#09090B]">{stat.label}</div>
              <div className="text-xs text-[#71717A]">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* ── 每日趨勢圖 ── */}
        <div className="p-6 rounded-2xl bg-white border border-[#18181B]/10 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-[#09090B]">每日瀏覽趨勢</h2>
              <p className="text-xs text-[#71717A] mt-0.5">滑鼠移至柱狀條可查看詳情</p>
            </div>
            <div className="text-xs text-[#71717A] bg-[#F4F4F5] px-3 py-1 rounded-full">
              過去 30 天
            </div>
          </div>
          {views.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center gap-2 text-[#A1A1AA]">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm">尚無訪問資料，請確認已完成設定</span>
            </div>
          ) : (
            <AnalyticsChart data={chartData} />
          )}
        </div>

        {/* ── 熱門頁面 + 流量來源 ── */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* 熱門頁面 */}
          <div className="p-6 rounded-2xl bg-white border border-[#18181B]/10 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-7 w-7 rounded-lg bg-[#2563EB]/10 grid place-items-center">
                <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-[#09090B]">熱門頁面</h2>
            </div>
            {topPages.length === 0 ? (
              <p className="text-sm text-[#71717A]">尚無資料</p>
            ) : (
              <div className="space-y-3.5">
                {topPages.map(([path, count], i) => (
                  <div key={path}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-medium text-[#A1A1AA] w-4 shrink-0">
                          {i + 1}
                        </span>
                        <span
                          className="text-sm text-[#3F3F46] truncate"
                          title={path}
                        >
                          {path || "/"}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-[#09090B] ml-2 shrink-0">
                        {count.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#F4F4F5] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
                        style={{ width: `${(count / maxPage) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 流量來源 */}
          <div className="p-6 rounded-2xl bg-white border border-[#18181B]/10 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-7 w-7 rounded-lg bg-[#10B981]/10 grid place-items-center">
                <svg className="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-[#09090B]">流量來源</h2>
            </div>
            {topReferrers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2 text-[#A1A1AA]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <p className="text-sm">大多數流量為直接訪問</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {topReferrers.map(([ref, count], i) => (
                  <div key={ref}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-medium text-[#A1A1AA] w-4 shrink-0">
                          {i + 1}
                        </span>
                        <span
                          className="text-sm text-[#3F3F46] truncate"
                          title={ref}
                        >
                          {ref}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-[#09090B] ml-2 shrink-0">
                        {count.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#F4F4F5] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#10B981] transition-all duration-500"
                        style={{ width: `${(count / maxRef) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── 裝置分佈 ── */}
        <div className="p-6 rounded-2xl bg-white border border-[#18181B]/10 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-7 w-7 rounded-lg bg-[#7C3AED]/10 grid place-items-center">
              <svg className="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-[#09090B]">裝置分佈</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(deviceMap).map(([device, count]) => {
              const pct = Math.round((count / deviceTotal) * 100);
              return (
                <div key={device} className="text-center">
                  <div
                    className="inline-flex items-center justify-center h-12 w-12 rounded-2xl mb-3 mx-auto"
                    style={{
                      backgroundColor: deviceColors[device] + "15",
                      color: deviceColors[device],
                    }}
                  >
                    {deviceIcons[device]}
                  </div>
                  <div
                    className="text-2xl font-black"
                    style={{ color: deviceColors[device] }}
                  >
                    {pct}%
                  </div>
                  <div className="text-sm text-[#3F3F46] font-medium">{device}</div>
                  <div className="text-xs text-[#A1A1AA]">{count.toLocaleString()} 次</div>
                  <div className="mt-2 h-1.5 rounded-full bg-[#F4F4F5] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: deviceColors[device],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 最近訪問記錄 ── */}
        <div className="p-6 rounded-2xl bg-white border border-[#18181B]/10 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-7 w-7 rounded-lg bg-[#F59E0B]/10 grid place-items-center">
              <svg className="w-4 h-4 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-[#09090B]">最近訪問記錄</h2>
            <span className="text-xs text-[#A1A1AA] bg-[#F4F4F5] px-2 py-0.5 rounded-full ml-auto">
              最新 15 筆
            </span>
          </div>
          {recentViews.length === 0 ? (
            <p className="text-sm text-[#71717A] text-center py-4">尚無訪問記錄</p>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="text-left border-b border-[#F4F4F5]">
                    <th className="pb-3 px-2 font-medium text-[#71717A]">頁面路徑</th>
                    <th className="pb-3 px-2 font-medium text-[#71717A]">裝置</th>
                    <th className="pb-3 px-2 font-medium text-[#71717A]">來源</th>
                    <th className="pb-3 px-2 font-medium text-[#71717A] text-right">時間</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F4F5]">
                  {recentViews.map((view, i) => {
                    let refLabel = "直接訪問";
                    if (view.referrer) {
                      try {
                        refLabel = new URL(view.referrer).hostname;
                      } catch {
                        refLabel = view.referrer;
                      }
                    }
                    const device = detectDevice(view.user_agent ?? "");
                    return (
                      <tr
                        key={i}
                        className="hover:bg-[#F4F4F5]/50 transition-colors"
                      >
                        <td className="py-3 px-2">
                          <span className="font-mono text-xs text-[#3F3F46] bg-[#F4F4F5] px-2 py-0.5 rounded">
                            {view.path}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: deviceColors[device] + "15",
                              color: deviceColors[device],
                            }}
                          >
                            {deviceIcons[device]}
                            {device}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-[#71717A] text-xs max-w-[150px] truncate">
                          {refLabel}
                        </td>
                        <td className="py-3 px-2 text-[#71717A] text-xs text-right whitespace-nowrap">
                          {new Date(view.created_at).toLocaleString("zh-TW", {
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
