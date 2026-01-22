'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface ShareAndCommentsProps {
  postId: number;
  postTitle: string;
}

export default function ShareAndComments({ postId, postTitle }: ShareAndCommentsProps) {
  const supabase = createClient();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [form, setForm] = useState({
    authorName: '',
    content: '',
  });

  // 載入留言
  useEffect(() => {
    async function loadComments() {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setComments(data);
      }
      setIsLoadingComments(false);
    }
    loadComments();
  }, [postId]);

  // 複製連結
  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 分享到 Instagram (透過 story 連結)
  const handleShareInstagram = () => {
    const url = window.location.href;
    // Instagram 不支援直接網頁分享，但可以複製連結提示用戶手動分享
    navigator.clipboard.writeText(url);
    alert('連結已複製！請在 Instagram 貼上分享 ✨');
  };

  // 分享到 LinkedIn
  const handleShareLinkedIn = () => {
    const url = window.location.href;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
  };

  // 提交留言
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.authorName.trim() || !form.content.trim()) {
      alert('請填寫顯示名稱和留言內容');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: postId,
            author_name: form.authorName.trim(),
            content: form.content.trim(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // 新增留言到列表頂部
      setComments([data, ...comments]);
      setForm({ authorName: '', content: '' });
      setShowCommentForm(false);
      alert('留言已發布！');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('留言發布失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 space-y-12">
      {/* 分享區域 */}
      <div className="pt-8 border-t border-[#18181B]/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-[#3F3F46] font-medium">喜歡這篇文章嗎？分享出去！</p>
          <div className="flex gap-3">
            {/* Instagram */}
            <button
              onClick={handleShareInstagram}
              className="group p-3 rounded-xl bg-white border border-[#18181B]/10 hover:border-[#E4405F] hover:bg-[#E4405F]/5 hover:-translate-y-0.5 transition-all duration-200"
              title="分享到 Instagram"
            >
              <svg className="w-5 h-5 text-[#3F3F46] group-hover:text-[#E4405F] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </button>

            {/* LinkedIn */}
            <button
              onClick={handleShareLinkedIn}
              className="group p-3 rounded-xl bg-white border border-[#18181B]/10 hover:border-[#0077B5] hover:bg-[#0077B5]/5 hover:-translate-y-0.5 transition-all duration-200"
              title="分享到 LinkedIn"
            >
              <svg className="w-5 h-5 text-[#3F3F46] group-hover:text-[#0077B5] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>

            {/* 複製連結 */}
            <button
              onClick={handleCopyLink}
              className="group p-3 rounded-xl bg-white border border-[#18181B]/10 hover:border-[#2563EB] hover:bg-[#2563EB]/5 hover:-translate-y-0.5 transition-all duration-200"
              title="複製連結"
            >
              {copiedLink ? (
                <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-[#3F3F46] group-hover:text-[#2563EB] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 留言區域 */}
      <div className="pt-8 border-t border-[#18181B]/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-[#09090B]">
            留言 <span className="text-[#71717A] font-normal text-lg">({comments.length})</span>
          </h3>
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200"
          >
            {showCommentForm ? '取消' : '寫留言'}
          </button>
        </div>

        {/* 留言表單 */}
        {showCommentForm && (
          <form onSubmit={handleSubmitComment} className="mb-8 p-6 rounded-2xl bg-[#F4F4F5] border border-[#18181B]/10 space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-[#3F3F46] mb-2">
                顯示名稱
              </label>
              <input
                type="text"
                value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                placeholder="你的名字..."
                className="w-full px-4 py-3 rounded-xl border border-[#18181B]/10 bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200"
                required
                maxLength={50}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3F3F46] mb-2">
                留言內容
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="寫下你的想法..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-[#18181B]/10 bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200 resize-none"
                required
                maxLength={500}
              />
              <p className="text-xs text-[#71717A] mt-1">{form.content.length}/500</p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '發布中...' : '發布留言'}
            </button>
          </form>
        )}

        {/* 留言列表 */}
        <div className="space-y-4">
          {isLoadingComments ? (
            <div className="text-center py-8 text-[#71717A]">載入留言中...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-[#F4F4F5] border border-[#18181B]/10">
              <svg className="w-16 h-16 mx-auto mb-4 text-[#D4D4D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-[#71717A]">還沒有人留言，成為第一個留言的人吧！</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="p-5 rounded-2xl bg-white border border-[#18181B]/10 hover:border-[#2563EB]/30 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white font-bold flex-shrink-0">
                    {comment.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-[#09090B]">{comment.author_name}</h4>
                      <span className="text-xs text-[#71717A]">
                        {new Date(comment.created_at).toLocaleDateString('zh-TW', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-[#3F3F46] leading-relaxed whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
