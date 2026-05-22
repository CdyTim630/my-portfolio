import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DiaryListClient from "./DiaryListClient";

export default async function DiaryListPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/login");
  }

  const { data: diaries } = await supabase
    .from("diaries")
    .select(
      "id, title, mood, weather, entry_date, is_published_to_blog, published_post_id, content, created_at, cover_image, spotify_track_id"
    )
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--home-text-strong)] font-bold text-[var(--home-bg)] transition-transform duration-200 group-hover:scale-110">
                日
              </div>
              <span className="text-xl font-semibold text-[var(--home-text-strong)]">
                日記本
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[var(--home-surface)] border border-[var(--home-border)] px-2.5 py-0.5 text-xs font-medium text-[var(--home-muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse-soft" />
              私人 · 只有你看得到
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-sm text-[var(--home-muted)] hover:text-[var(--home-text-strong)] transition-colors"
            >
              ← 返回管理首頁
            </Link>
            <Link
              href="/admin/diary/new"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/25"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              寫新日記
            </Link>
          </div>
        </header>

        <DiaryListClient diaries={diaries || []} />
      </div>
    </main>
  );
}
