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
}

export default function AdminDashboard({ user, posts: initialPosts }: AdminDashboardProps) {
  const supabase = createClient();
  const [posts, setPosts] = useState(initialPosts);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  async function togglePublish(postId: number, currentStatus: boolean) {
    const { error } = await supabase
      .from("posts")
      .update({ published: !currentStatus })
      .eq("id", postId);

    if (!error) {
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, published: !currentStatus } : p
      ));
    }
  }

  async function deletePost(postId: number) {
    if (!confirm("確定要刪除這篇文章嗎？")) return;

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (!error) {
      setPosts(posts.filter(p => p.id !== postId));
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-full bg-[#18181B] text-white grid place-items-center font-bold group-hover:scale-110 transition-transform duration-200">
                Tim
              </div>
              <span className="text-xl font-semibold text-[#09090B]">Admin Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#71717A]">{user.email}</span>
            <Link 
              href="/blog" 
              className="text-sm text-[#3F3F46] hover:text-[#2563EB] transition-colors"
            >
              查看部落格
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-[#71717A] hover:text-red-500 transition-colors cursor-pointer"
            >
              登出
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-white border border-[#18181B]/10 shadow-sm">
            <div className="text-3xl font-black text-[#09090B]">{posts.length}</div>
            <div className="mt-1 text-sm text-[#71717A]">總文章數</div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-[#18181B]/10 shadow-sm">
            <div className="text-3xl font-black text-[#2563EB]">
              {posts.filter(p => p.published).length}
            </div>
            <div className="mt-1 text-sm text-[#71717A]">已發布</div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-[#18181B]/10 shadow-sm">
            <div className="text-3xl font-black text-[#F59E0B]">
              {posts.filter(p => !p.published).length}
            </div>
            <div className="mt-1 text-sm text-[#71717A]">草稿</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#09090B]">文章管理</h2>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3F3F46] text-white font-semibold hover:bg-[#18181B] hover:shadow-lg hover:shadow-gray-500/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              分類管理
            </Link>
            <Link
              href="/admin/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新增文章
            </Link>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-2xl border border-[#18181B]/10 shadow-sm overflow-hidden">
          {posts.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-[#D4D4D8] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-[#71717A]">還沒有任何文章</p>
              <Link
                href="/admin/new"
                className="inline-flex items-center gap-2 mt-4 text-[#2563EB] font-medium hover:underline"
              >
                建立第一篇文章
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#18181B]/10">
              {posts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-[#F4F4F5]/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#09090B]">{post.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          post.published 
                            ? "bg-green-100 text-green-700" 
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {post.published ? "已發布" : "草稿"}
                        </span>
                        {post.category && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#2563EB]/10 text-[#2563EB]">
                            {post.category}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#71717A] mb-2">/blog/{post.id}</p>
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
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                          post.published
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {post.published ? "取消發布" : "發布"}
                      </button>
                      <Link
                        href={`/admin/edit/${post.id}`}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#F4F4F5] text-[#3F3F46] hover:bg-[#E4E4E7] transition-all duration-200"
                      >
                        編輯
                      </Link>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-200 cursor-pointer"
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
