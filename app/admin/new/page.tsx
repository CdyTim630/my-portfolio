'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function NewPostPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '台大資管生活',
    spotifyTrackId: '',
    coverImage: '',
    published: false,
  });

  // 載入分類
  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error loading categories:', error);
        // 如果載入失敗，使用預設分類
        setCategories([{ id: '1', name: '台大資管生活' }, { id: '2', name: '生活紀錄' }]);
      } else if (data && data.length > 0) {
        setCategories(data);
        setForm(prev => ({ ...prev, category: data[0].name }));
      } else {
        // 如果沒有分類，使用預設
        setCategories([{ id: '1', name: '台大資管生活' }, { id: '2', name: '生活紀錄' }]);
      }
    }
    loadCategories();
  }, []);

  // 上傳圖片到 Supabase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        if (uploadError.message.includes('Bucket not found')) {
          alert('❌ 尚未設置 Storage Bucket！\n\n請先到 Supabase Dashboard 執行以下步驟：\n1. 點擊左側 Storage\n2. 點擊 Create a new bucket\n3. 名稱填入：blog-images\n4. 勾選 Public bucket\n5. 點擊 Create bucket\n\n詳細步驟請參考 SUPABASE_SETUP.md');
        } else {
          alert('圖片上傳失敗：' + uploadError.message);
        }
        return null;
      }

      // 取得公開 URL
      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('圖片上傳發生錯誤');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // 處理封面圖片上傳
  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file);
    if (url) {
      setForm({ ...form, coverImage: url });
    }
  };

  // 處理內容圖片上傳
  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file);
    if (url) {
      // 插入 Markdown 圖片語法到游標位置
      const textarea = document.getElementById('content') as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent =
        form.content.substring(0, start) +
        `\n![Image](${url})\n` +
        form.content.substring(end);
      setForm({ ...form, content: newContent });
    }
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        alert('請先登入');
        router.push('/login');
        return;
      }

      const { error } = await supabase.from('posts').insert({
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        spotify_track_id: form.spotifyTrackId || null,
        cover_image: form.coverImage || null,
        published: publish,
        author_id: user.user.id,
      });

      if (error) {
        console.error('Error creating post:', error);
        alert('發文失敗：' + error.message);
        return;
      }

      alert(publish ? '文章已發布！' : '草稿已儲存！');
      router.push('/admin');
    } catch (err) {
      console.error('Error:', err);
      alert('發生錯誤');
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = form.content.substring(start, end) || placeholder;

    let newText = '';
    switch (syntax) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'h2':
        newText = `\n## ${selectedText}\n`;
        break;
      case 'h3':
        newText = `\n### ${selectedText}\n`;
        break;
      case 'link':
        newText = `[${selectedText}](url)`;
        break;
      case 'image':
        // 觸發圖片上傳
        document.getElementById('content-image-upload')?.click();
        return;
      case 'list':
        newText = `\n- ${selectedText}\n`;
        break;
      case 'code':
        newText = `\`${selectedText}\``;
        break;
      case 'codeblock':
        newText = `\n\`\`\`\n${selectedText}\n\`\`\`\n`;
        break;
      default:
        newText = selectedText;
    }

    const newContent =
      form.content.substring(0, start) + newText + form.content.substring(end);
    setForm({ ...form, content: newContent });
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-full bg-[#18181B] text-white grid place-items-center font-bold group-hover:scale-110 transition-transform duration-200">
                B
              </div>
              <span className="text-xl font-semibold text-[#09090B]">新增文章</span>
            </Link>
          </div>
          <Link
            href="/admin"
            className="text-sm text-[#71717A] hover:text-[#2563EB] transition-colors"
          >
            ← 返回後台
          </Link>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="bg-white rounded-2xl border border-[#18181B]/10 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#09090B] mb-6">撰寫新文章</h2>

            <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#3F3F46] mb-2">
                  標題
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="輸入文章標題..."
                  className="w-full px-4 py-3 rounded-xl border border-[#18181B]/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200"
                  required
                />
              </div>

              {/* Category & Spotify */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3F3F46] mb-2">
                    分類
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#18181B]/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200 cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3F3F46] mb-2">
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-[#1DB954]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                      Spotify Track ID
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.spotifyTrackId}
                    onChange={(e) =>
                      setForm({ ...form, spotifyTrackId: e.target.value })
                    }
                    placeholder="e.g. 4cOdK2wGLETKBW3PvgPWqT"
                    className="w-full px-4 py-3 rounded-xl border border-[#18181B]/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-[#3F3F46] mb-2">
                  封面圖片
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.coverImage}
                    onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                    placeholder="圖片 URL..."
                    className="flex-1 px-4 py-3 rounded-xl border border-[#18181B]/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200"
                  />
                  <label className="px-4 py-3 rounded-xl bg-[#F4F4F5] text-[#3F3F46] font-medium hover:bg-[#E4E4E7] transition-colors cursor-pointer flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {isUploading ? '上傳中...' : '上傳'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
                {form.coverImage && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-[#18181B]/10">
                    <img src={form.coverImage} alt="Cover preview" className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-[#3F3F46] mb-2">
                  摘要
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="簡短描述這篇文章..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-[#18181B]/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200 resize-none"
                  required
                />
              </div>

              {/* Content Editor Toolbar */}
              <div>
                <label className="block text-sm font-medium text-[#3F3F46] mb-2">
                  內容 (Markdown)
                </label>
                <div className="flex flex-wrap gap-1 p-2 bg-[#F4F4F5] rounded-t-xl border border-b-0 border-[#18181B]/10">
                  <button
                    type="button"
                    onClick={() => insertMarkdown('bold', 'bold text')}
                    className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="Bold"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('italic', 'italic text')}
                    className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="Italic"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 4h4m-2 0v16m-4 0h8"
                      />
                    </svg>
                  </button>
                  <div className="w-px h-6 bg-[#D4D4D8] mx-1 self-center"></div>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('h2', 'Heading')}
                    className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer text-sm font-bold"
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('h3', 'Subheading')}
                    className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer text-sm font-bold"
                    title="Heading 3"
                  >
                    H3
                  </button>
                  <div className="w-px h-6 bg-[#D4D4D8] mx-1 self-center"></div>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('link', 'link text')}
                    className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="Link"
                  >
                    <svg
                      className="w-4 h-4"
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
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('image')}
                    className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="Upload Image"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <input
                    id="content-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleContentImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <div className="w-px h-6 bg-[#D4D4D8] mx-1 self-center"></div>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('list', 'list item')}
                    className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="List"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('code', 'code')}
                    className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="Inline Code"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('codeblock', 'code block')}
                    className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer text-xs font-mono"
                    title="Code Block"
                  >
                    {'</>'}
                  </button>
                </div>
                <textarea
                  id="content"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="使用 Markdown 撰寫文章內容..."
                  rows={15}
                  className="w-full px-4 py-3 rounded-b-xl border border-[#18181B]/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200 resize-none font-mono text-sm"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="flex-1 px-6 py-3 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '發布中...' : '發布文章'}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={isSubmitting || isUploading}
                  className="px-6 py-3 rounded-xl border-2 border-[#18181B] text-[#18181B] font-semibold hover:bg-[#18181B] hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  儲存草稿
                </button>
              </div>
            </form>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-2xl border border-[#18181B]/10 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#09090B] mb-6">預覽</h2>

            {form.title || form.content ? (
              <div className="prose prose-slate max-w-none">
                {form.category && (
                  <span className="inline-block px-3 py-1 rounded-lg bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium mb-4">
                    {form.category}
                  </span>
                )}
                {form.title && (
                  <h1 className="text-3xl font-black text-[#09090B] tracking-tight mb-4">
                    {form.title}
                  </h1>
                )}
                {form.excerpt && (
                  <p className="text-lg text-[#3F3F46] mb-6 pb-6 border-b border-[#18181B]/10">
                    {form.excerpt}
                  </p>
                )}
                {form.spotifyTrackId && (
                  <div className="mb-6 p-4 rounded-xl bg-[#1DB954]/10 border border-[#1DB954]/20">
                    <p className="text-sm text-[#1DB954] flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                      Spotify Track: {form.spotifyTrackId}
                    </p>
                  </div>
                )}
                <div
                  className="text-[#3F3F46] leading-relaxed whitespace-pre-wrap"
                  style={{ fontFamily: 'inherit' }}
                >
                  {form.content}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-[#A1A1AA]">
                <svg
                  className="w-16 h-16 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p>開始撰寫以預覽內容</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
