"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface Post {
  id: number;
  title: string;
  excerpt?: string;
  content: string;
  published: boolean;
  created_at: string;
  category?: string;
  spotify_track_id?: string;
}

interface AdminDashboardProps {
  user: User;
  posts: Post[];
  commentsCount?: number;
  diariesCount?: number;
}

export default function AdminDashboard({
  user,
  posts: initialPosts,
  commentsCount = 0,
  diariesCount = 0,
}: AdminDashboardProps) {
  const supabase = createClient();
  const [posts, setPosts] = useState(initialPosts);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.assign("/login");
  }

  async function togglePublish(postId: number, currentStatus: boolean) {
    const { error } = await supabase
      .from("posts")
      .update({ published: !currentStatus })
      .eq("id", postId);

    if (!error) {
      setPosts(posts.map((p) => (p.id === postId ? { ...p, published: !currentStatus } : p)));
    }
  }

  async function deletePost(postId: number) {
    if (!confirm("確定要刪除這篇文章嗎？")) return;

    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (!error) {
      setPosts(posts.filter((p) => p.id !== postId));
    }
  }

  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#18181B] font-bold text-white transition-transform duration-200 group-hover:scale-110">
                Tim
              </div>
              <span className="text-xl font-semibold text-[#09090B]">Admin Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#71717A]">{user.email}</span>
            <Link href="/blog" className="text-sm text-[#3F3F46] transition-colors hover:text-[#2563EB]">
              查看部落格
            </Link>
            <button
              onClick={handleLogout}
              className="cursor-pointer text-sm text-[#71717A] transition-colors hover:text-red-500"
            >
              登出
            </button>
          </div>
        </header>

        <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
          <div className="rounded-2xl border border-[#18181B]/10 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="text-3xl font-black text-[#09090B]">{posts.length}</div>
            <div className="mt-1 text-sm text-[#71717A]">總文章數</div>
          </div>
          <div className="rounded-2xl border border-[#18181B]/10 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="text-3xl font-black text-[#2563EB]">{posts.filter((p) => p.published).length}</div>
            <div className="mt-1 text-sm text-[#71717A]">已發布</div>
          </div>
          <div className="rounded-2xl border border-[#18181B]/10 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="text-3xl font-black text-[#F59E0B]">{posts.filter((p) => !p.published).length}</div>
            <div className="mt-1 text-sm text-[#71717A]">草稿</div>
          </div>
          <Link
            href="/admin/comments"
            className="group rounded-2xl border border-[#18181B]/10 bg-white p-6 shadow-sm transition-all duration-200 hover:border-[#10B981] hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="text-3xl font-black text-[#10B981] transition-transform group-hover:scale-105">
              {commentsCount}
            </div>
            <div className="mt-1 flex items-center gap-1 text-sm text-[#71717A]">
              留言數
              <svg
                className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
          <Link
            href="/admin/diary"
            className="group rounded-2xl border border-[#18181B]/10 bg-white p-6 shadow-sm transition-all duration-200 hover:border-[#EC4899] hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="text-3xl font-black text-[#EC4899] transition-transform group-hover:scale-105">
              {diariesCount}
            </div>
            <div className="mt-1 flex items-center gap-1 text-sm text-[#71717A]">
              日記
              <svg
                className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        <section className="mb-6 rounded-3xl border border-[#18181B]/10 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-[#09090B]">管理中心</h2>
            <p className="text-sm text-[#71717A]">快速進入各功能模組</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/analytics"
              className="group flex items-center gap-3 rounded-xl border border-[#2563EB]/20 bg-[#EFF6FF] px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2563EB]/40"
            >
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#2563EB] shadow-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-[#1D4ED8]">網站分析</span>
            </Link>

            <Link
              href="/admin/comments"
              className="group flex items-center gap-3 rounded-xl border border-[#10B981]/20 bg-[#ECFDF5] px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#10B981]/40"
            >
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#10B981] shadow-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-[#047857]">留言管理</span>
            </Link>

            <Link
              href="/admin/categories"
              className="group flex items-center gap-3 rounded-xl border border-[#3F3F46]/20 bg-[#F4F4F5] px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3F3F46]/40"
            >
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#27272A] shadow-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-[#27272A]">分類管理</span>
            </Link>

            <Link
              href="/admin/experience"
              className="group flex items-center gap-3 rounded-xl border border-[#7C3AED]/20 bg-[#F5F3FF] px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#7C3AED]/40"
            >
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#7C3AED] shadow-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-[#6D28D9]">Experience 管理</span>
            </Link>

            <Link
              href="/admin/resume"
              className="group flex items-center gap-3 rounded-xl border border-[#0EA5E9]/20 bg-[#F0F9FF] px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0EA5E9]/40"
            >
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#0EA5E9] shadow-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 16V8m0 8l-3-3m3 3l3-3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-[#0284C7]">履歷連結</span>
            </Link>

            <Link
              href="/admin/diary"
              className="group flex items-center gap-3 rounded-xl border border-[#EC4899]/20 bg-[#FDF2F8] px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#EC4899]/40"
            >
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#EC4899] shadow-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-[#BE185D]">私人日記</span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-medium text-[#9D174D]">
                <span className="w-1 h-1 rounded-full bg-[#EC4899] animate-pulse" />
                Private
              </span>
            </Link>
          </div>
        </section>

        <div className="mb-4 flex items-center justify-between rounded-2xl border border-[#18181B]/10 bg-white px-5 py-4 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-[#09090B]">文章管理</h3>
            <p className="text-sm text-[#71717A]">管理目前所有文章</p>
          </div>
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/25"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新增文章
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#18181B]/10 bg-white shadow-sm">
          {posts.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto mb-4 h-16 w-16 text-[#D4D4D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-[#71717A]">還沒有任何文章</p>
              <Link href="/admin/new" className="mt-4 inline-flex items-center gap-2 font-medium text-[#2563EB] hover:underline">
                建立第一篇文章
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#18181B]/10">
              {posts.map((post) => (
                <div key={post.id} className="p-6 transition-colors hover:bg-[#F4F4F5]/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-[#09090B]">{post.title}</h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            post.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {post.published ? "已發布" : "草稿"}
                        </span>
                        {post.category && (
                          <span className="rounded-full bg-[#2563EB]/10 px-2 py-0.5 text-xs font-medium text-[#2563EB]">
                            {post.category}
                          </span>
                        )}
                      </div>
                      <p className="mb-2 text-sm text-[#71717A]">/blog/{post.id}</p>
                      <p className="text-sm text-[#3F3F46]">
                        {new Date(post.created_at).toLocaleDateString("zh-TW", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePublish(post.id, post.published)}
                        className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                          post.published
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {post.published ? "取消發布" : "發布"}
                      </button>
                      <Link
                        href={`/admin/edit/${post.id}`}
                        className="rounded-lg bg-[#F4F4F5] px-3 py-1.5 text-sm font-medium text-[#3F3F46] transition-all duration-200 hover:bg-[#E4E4E7]"
                      >
                        編輯
                      </Link>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="cursor-pointer rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition-all duration-200 hover:bg-red-200"
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
