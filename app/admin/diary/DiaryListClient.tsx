"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface DiaryRow {
  id: number;
  title: string;
  mood: string | null;
  weather: string | null;
  entry_date: string;
  is_published_to_blog: boolean;
  published_post_id: number | null;
  content: string;
  created_at: string;
  cover_image: string | null;
  spotify_track_id: string | null;
}

const MOOD_LABEL: Record<string, string> = {
  happy: "😄", calm: "🙂", tired: "😪", focused: "🎯",
  stressed: "😣", grateful: "🥰", thoughtful: "🤔",
};
const WEATHER_LABEL: Record<string, string> = {
  sunny: "☀️", cloudy: "⛅", rainy: "🌧️", windy: "💨", snowy: "❄️", night: "🌙",
};

export default function DiaryListClient({ diaries: initial }: { diaries: DiaryRow[] }) {
  const supabase = createClient();
  const [diaries, setDiaries] = useState<DiaryRow[]>(initial);
  const [filter, setFilter] = useState<"all" | "private" | "public">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return diaries.filter((d) => {
      if (filter === "private" && d.is_published_to_blog) return false;
      if (filter === "public" && !d.is_published_to_blog) return false;
      if (search.trim()) {
        const s = search.toLowerCase();
        if (!d.title.toLowerCase().includes(s) && !d.content.toLowerCase().includes(s)) {
          return false;
        }
      }
      return true;
    });
  }, [diaries, filter, search]);

  async function handleDelete(d: DiaryRow) {
    if (!confirm(`確定要刪除「${d.title}」？${d.published_post_id ? "（已發布到 Blog 的文章會一併移除）" : ""}`)) return;
    if (d.published_post_id) {
      await supabase.from("posts").delete().eq("id", d.published_post_id);
    }
    const { error } = await supabase.from("diaries").delete().eq("id", d.id);
    if (!error) setDiaries((prev) => prev.filter((x) => x.id !== d.id));
  }

  const stats = useMemo(() => {
    const total = diaries.length;
    const published = diaries.filter((d) => d.is_published_to_blog).length;
    const draft = total - published;
    const thisMonth = diaries.filter((d) => {
      const dt = new Date(d.entry_date);
      const now = new Date();
      return dt.getFullYear() === now.getFullYear() && dt.getMonth() === now.getMonth();
    }).length;
    return { total, published, draft, thisMonth };
  }, [diaries]);

  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="總日記" value={stats.total} color="text-[var(--home-text-strong)]" />
        <StatCard label="本月" value={stats.thisMonth} color="text-[#2563EB]" />
        <StatCard label="僅自己" value={stats.draft} color="text-[#F59E0B]" />
        <StatCard label="已分享到 Blog" value={stats.published} color="text-[#10B981]" />
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[var(--home-border)] bg-[var(--home-surface)] backdrop-blur-sm p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(["all", "private", "public"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                filter === f
                  ? "bg-[var(--home-text-strong)] text-[var(--home-bg)]"
                  : "bg-[var(--home-surface-muted)] text-[var(--home-text)] hover:bg-[var(--home-border)]"
              }`}
            >
              {f === "all" ? "全部" : f === "private" ? "僅自己" : "已分享"}
            </button>
          ))}
        </div>
        <div className="flex-1 sm:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜尋標題或內容…"
            className="w-full px-3 py-1.5 rounded-lg bg-[var(--home-bg)] border border-[var(--home-border)] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none text-sm text-[var(--home-text-strong)]"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--home-border)] bg-[var(--home-surface)]/60 backdrop-blur-sm p-12 text-center">
          <div className="text-5xl mb-3">📓</div>
          <p className="text-[var(--home-muted)] mb-4">
            {diaries.length === 0 ? "還沒寫過日記，今天先記一句吧" : "沒有符合條件的日記"}
          </p>
          <Link
            href="/admin/diary/new"
            className="inline-flex items-center gap-2 font-medium text-[#2563EB] hover:underline"
          >
            寫一篇日記
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d, idx) => (
            <Link
              key={d.id}
              href={`/admin/diary/${d.id}`}
              className="group relative flex flex-col rounded-2xl border border-[var(--home-border)] bg-[var(--home-surface)] backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#2563EB]/40 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${Math.min(idx * 40, 320)}ms`, animationFillMode: "both" }}
            >
              {d.cover_image && (
                <div className="aspect-video bg-[var(--home-surface-muted)] overflow-hidden">
                  <img
                    src={d.cover_image}
                    alt={d.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 flex-wrap mb-2 text-xs text-[var(--home-muted)]">
                  <span>{new Date(d.entry_date).toLocaleDateString("zh-TW", { month: "short", day: "numeric", year: "numeric" })}</span>
                  {d.mood && <span title="心情">{MOOD_LABEL[d.mood]}</span>}
                  {d.weather && <span title="天氣">{WEATHER_LABEL[d.weather]}</span>}
                  {d.spotify_track_id && (
                    <span title="搭配 Spotify 曲目" className="inline-flex items-center">
                      <svg className="w-3.5 h-3.5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                    </span>
                  )}
                  <span
                    className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      d.is_published_to_blog
                        ? "bg-[#ECFDF5] text-[#047857]"
                        : "bg-[var(--home-surface-muted)] text-[var(--home-muted)]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        d.is_published_to_blog ? "bg-[#10B981]" : "bg-[var(--home-muted-soft)]"
                      }`}
                    />
                    {d.is_published_to_blog ? "已分享" : "僅自己"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--home-text-strong)] mb-2 line-clamp-2 group-hover:text-[#2563EB] transition-colors">
                  {d.title || "（未命名）"}
                </h3>
                <p className="text-sm text-[var(--home-muted)] line-clamp-3 mb-4 flex-1">
                  {d.content.replace(/[#>*`!\[\]()]/g, "").slice(0, 120) || "（空白）"}
                </p>
                <div className="flex items-center justify-between gap-2 mt-auto">
                  <span className="text-xs text-[var(--home-muted-soft)] group-hover:text-[#2563EB] transition-colors">
                    打開閱讀 →
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleDelete(d); }}
                    className="opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:text-red-700 transition-all"
                  >
                    刪除
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-[var(--home-border)] bg-[var(--home-surface)] backdrop-blur-sm p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className={`text-3xl font-black ${color}`}>{value}</div>
      <div className="mt-1 text-sm text-[var(--home-muted)]">{label}</div>
    </div>
  );
}
