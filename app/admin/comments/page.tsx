'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Comment {
  id: string;
  post_id: number;
  author_name: string;
  content: string;
  created_at: string;
}

interface Post {
  id: number;
  title: string;
}

export default function CommentsPage() {
  const supabase = createClient();
  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  // 載入文章和留言
  useEffect(() => {
    async function loadData() {
      try {
        // 載入所有文章
        const { data: postsData } = await supabase
          .from('posts')
          .select('id, title')
          .order('created_at', { ascending: false });

        setPosts(postsData || []);

        // 載入所有留言
        const { data: commentsData } = await supabase
          .from('comments')
          .select('*')
          .order('created_at', { ascending: false });

        setComments(commentsData || []);
      } catch (error) {
        console.error('載入資料失敗:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // 刪除單一留言
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('確定要刪除這則留言嗎？')) return;

    setDeletingIds(prev => new Set(prev).add(commentId));

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('刪除留言失敗:', error);
      alert('刪除留言失敗，請稍後再試');
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  // 批量刪除選中文章的所有留言
  const handleDeleteAllByPost = async () => {
    if (!selectedPostId) return;
    if (!confirm('確定要刪除此文章的所有留言嗎？此操作無法復原！')) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('post_id', selectedPostId);

      if (error) throw error;

      setComments(comments.filter(c => c.post_id !== selectedPostId));
      alert('已刪除所有留言');
    } catch (error) {
      console.error('批量刪除留言失敗:', error);
      alert('刪除失敗，請稍後再試');
    }
  };

  // 篩選留言
  const filteredComments = comments.filter(comment => {
    const matchesPost = selectedPostId ? comment.post_id === selectedPostId : true;
    const matchesSearch = searchTerm
      ? comment.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.content.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesPost && matchesSearch;
  });

  // 取得文章標題
  const getPostTitle = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    return post?.title || `文章 #${postId}`;
  };

  // 計算每篇文章的留言數
  const commentCountByPost = comments.reduce((acc, comment) => {
    acc[comment.post_id] = (acc[comment.post_id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAFAFA]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-full bg-[#18181B] text-white grid place-items-center font-bold group-hover:scale-110 transition-transform duration-200">
                Tim
              </div>
              <span className="text-xl font-semibold text-[#09090B]">留言管理</span>
            </Link>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-[#3F3F46] hover:text-[#2563EB] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回管理後台
          </Link>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white border border-[#18181B]/10 shadow-sm">
            <div className="text-2xl font-black text-[#09090B]">{comments.length}</div>
            <div className="mt-1 text-sm text-[#71717A]">總留言數</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#18181B]/10 shadow-sm">
            <div className="text-2xl font-black text-[#2563EB]">
              {Object.keys(commentCountByPost).length}
            </div>
            <div className="mt-1 text-sm text-[#71717A]">有留言的文章</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#18181B]/10 shadow-sm">
            <div className="text-2xl font-black text-[#10B981]">
              {comments.filter(c => {
                const date = new Date(c.created_at);
                const now = new Date();
                const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                return diffDays <= 7;
              }).length}
            </div>
            <div className="mt-1 text-sm text-[#71717A]">近7天留言</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#18181B]/10 shadow-sm">
            <div className="text-2xl font-black text-[#F59E0B]">{filteredComments.length}</div>
            <div className="mt-1 text-sm text-[#71717A]">篩選結果</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-[#18181B]/10 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜尋 */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#3F3F46] mb-2">搜尋留言</label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="搜尋作者或內容..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#18181B]/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* 文章篩選 */}
            <div className="md:w-72">
              <label className="block text-sm font-medium text-[#3F3F46] mb-2">依文章篩選</label>
              <select
                value={selectedPostId || ''}
                onChange={(e) => setSelectedPostId(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#18181B]/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="">所有文章</option>
                {posts.map((post) => (
                  <option key={post.id} value={post.id}>
                    {post.title} ({commentCountByPost[post.id] || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* 批量刪除按鈕 */}
            {selectedPostId && (
              <div className="flex items-end">
                <button
                  onClick={handleDeleteAllByPost}
                  className="px-4 py-2.5 rounded-xl bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-all duration-200 cursor-pointer"
                >
                  刪除此文章所有留言
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Comments List */}
        <div className="bg-white rounded-2xl border border-[#18181B]/10 shadow-sm overflow-hidden">
          {filteredComments.length === 0 ? (
            <div className="p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto text-[#D4D4D8] mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-[#71717A]">
                {searchTerm || selectedPostId ? '沒有找到符合條件的留言' : '目前沒有任何留言'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#18181B]/10">
              {filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-6 hover:bg-[#F4F4F5]/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* 留言 meta */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-semibold text-[#09090B]">
                          {comment.author_name}
                        </span>
                        <span className="text-[#A1A1AA]">•</span>
                        <span className="text-sm text-[#71717A]">
                          {new Date(comment.created_at).toLocaleString('zh-TW', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* 文章連結 */}
                      <Link
                        href={`/blog/${comment.post_id}`}
                        className="inline-flex items-center gap-1 text-xs text-[#2563EB] hover:underline mb-2"
                        target="_blank"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        {getPostTitle(comment.post_id)}
                      </Link>

                      {/* 留言內容 */}
                      <p className="text-[#3F3F46] whitespace-pre-wrap break-words">
                        {comment.content}
                      </p>
                    </div>

                    {/* 操作按鈕 */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={deletingIds.has(comment.id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-100 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        title="刪除留言"
                      >
                        {deletingIds.has(comment.id) ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination hint */}
        {filteredComments.length > 0 && (
          <div className="mt-4 text-center text-sm text-[#71717A]">
            顯示 {filteredComments.length} 則留言
          </div>
        )}
      </div>
    </main>
  );
}
