'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  // 同步滾動的 refs
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef<'editor' | 'preview' | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 基於行號的同步滾動處理
  const handleEditorScroll = useCallback(() => {
    if (isScrollingRef.current === 'preview') return;
    isScrollingRef.current = 'editor';
    
    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;

    // 計算編輯器的滾動比例
    const editorScrollHeight = editor.scrollHeight - editor.clientHeight;
    if (editorScrollHeight <= 0) return;
    
    const scrollRatio = editor.scrollTop / editorScrollHeight;
    
    // 應用到預覽區
    const previewScrollHeight = preview.scrollHeight - preview.clientHeight;
    const targetScrollTop = scrollRatio * previewScrollHeight;
    
    // 使用平滑滾動
    preview.scrollTo({
      top: targetScrollTop,
      behavior: 'auto'
    });

    // 重置滾動狀態
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = null;
    }, 50);
  }, []);

  const handlePreviewScroll = useCallback(() => {
    if (isScrollingRef.current === 'editor') return;
    isScrollingRef.current = 'preview';
    
    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;

    // 計算預覽區的滾動比例
    const previewScrollHeight = preview.scrollHeight - preview.clientHeight;
    if (previewScrollHeight <= 0) return;
    
    const scrollRatio = preview.scrollTop / previewScrollHeight;
    
    // 應用到編輯器
    const editorScrollHeight = editor.scrollHeight - editor.clientHeight;
    const targetScrollTop = scrollRatio * editorScrollHeight;
    
    editor.scrollTo({
      top: targetScrollTop,
      behavior: 'auto'
    });

    // 重置滾動狀態
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = null;
    }, 50);
  }, []);

  // 當內容變化時，重新同步位置
  useEffect(() => {
    // 當 content 變化時，等待圖片載入後重新同步
    const preview = previewRef.current;
    if (!preview) return;

    const images = preview.querySelectorAll('img');
    let loadedCount = 0;
    const totalImages = images.length;

    if (totalImages === 0) return;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        // 所有圖片載入完成，重新同步滾動位置
        handleEditorScroll();
      }
    };

    images.forEach(img => {
      if (img.complete) {
        loadedCount++;
      } else {
        img.addEventListener('load', handleImageLoad);
      }
    });

    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleImageLoad);
      });
    };
  }, [form.content, handleEditorScroll]);

  // 載入分類
  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error loading categories:', error);
        setCategories([{ id: '1', name: '台大資管生活' }, { id: '2', name: '生活紀錄' }]);
      } else if (data && data.length > 0) {
        setCategories(data);
      } else {
        setCategories([{ id: '1', name: '台大資管生活' }, { id: '2', name: '生活紀錄' }]);
      }
    }
    loadCategories();
  }, []);

  // 載入文章資料
  useEffect(() => {
    async function loadPost() {
      const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error || !post) {
        alert('找不到文章');
        router.push('/admin');
        return;
      }

      setForm({
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content,
        category: post.category || 'Design',
        spotifyTrackId: post.spotify_track_id || '',
        coverImage: post.cover_image || '',
        published: post.published,
      });
      setIsLoading(false);
    }

    loadPost();
  }, [postId, router, supabase]);

  // 上傳圖片到 Supabase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      // 檢查檔案
      console.log('準備上傳檔案:', file.name, file.size, file.type);
      
      if (file.size === 0) {
        alert('檔案大小為 0，請重新選擇圖片');
        return null;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

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
      const { data: publicData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(data.path);

      console.log('上傳成功，URL:', publicData.publicUrl);
      return publicData.publicUrl;
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

  // 處理剪貼板貼上圖片
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault(); // 防止預設貼上行為
        
        const file = item.getAsFile();
        if (!file) continue;

        // 產生一個有意義的檔名
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const newFile = new File([file], `pasted-image-${timestamp}.png`, {
          type: file.type,
        });

        const url = await uploadImage(newFile);
        if (url) {
          const textarea = e.target as HTMLTextAreaElement;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const newContent =
            form.content.substring(0, start) +
            `\n![Image](${url})\n` +
            form.content.substring(end);
          setForm({ ...form, content: newContent });
        }
        break; // 只處理第一張圖片
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent, publish?: boolean) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        alert('請先登入');
        router.push('/login');
        return;
      }

      const updateData: any = {
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        spotify_track_id: form.spotifyTrackId || null,
        cover_image: form.coverImage || null,
      };

      // 如果有傳入 publish 參數，則更新發布狀態
      if (publish !== undefined) {
        updateData.published = publish;
      }

      const { error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', postId);

      if (error) {
        console.error('Error updating post:', error);
        alert('更新失敗：' + error.message);
        return;
      }

      alert('文章已更新！');
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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#71717A]">載入中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-full bg-[#18181B] text-white grid place-items-center font-bold group-hover:scale-110 transition-transform duration-200">
                Tim
              </div>
              <span className="text-xl font-semibold text-[#09090B]">編輯文章</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {form.published ? (
              <>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={isSubmitting || isUploading}
                  className="px-5 py-2.5 rounded-xl border-2 border-[#18181B] text-[#18181B] font-semibold hover:bg-[#18181B] hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  取消發布
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e)}
                  disabled={isSubmitting || isUploading}
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isSubmitting ? '儲存中...' : '儲存變更'}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e)}
                  disabled={isSubmitting || isUploading}
                  className="px-5 py-2.5 rounded-xl border-2 border-[#18181B] text-[#18181B] font-semibold hover:bg-[#18181B] hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  儲存草稿
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={isSubmitting || isUploading}
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isSubmitting ? '發布中...' : '發布文章'}
                </button>
              </>
            )}
            <Link
              href="/admin"
              className="text-sm text-[#71717A] hover:text-[#2563EB] transition-colors ml-2"
            >
              ← 返回
            </Link>
          </div>
        </header>

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
          {/* Settings Panel - Top */}
          <div className="bg-white rounded-2xl border border-[#18181B]/10 p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Title */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-[#3F3F46] mb-1.5">
                  標題
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="輸入文章標題..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#18181B]/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200 text-sm"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[#3F3F46] mb-1.5">
                  分類
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#18181B]/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200 cursor-pointer text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Spotify */}
              <div>
                <label className="block text-sm font-medium text-[#3F3F46] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                    Spotify ID
                  </span>
                </label>
                <input
                  type="text"
                  value={form.spotifyTrackId}
                  onChange={(e) => setForm({ ...form, spotifyTrackId: e.target.value })}
                  placeholder="e.g. 4cOdK2wGLETKBW3PvgPWqT"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#18181B]/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200 text-sm"
                />
              </div>

              {/* Cover Image */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-[#3F3F46] mb-1.5">
                  封面圖片
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.coverImage}
                    onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                    placeholder="圖片 URL..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#18181B]/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200 text-sm"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-[#F4F4F5] text-[#3F3F46] font-medium hover:bg-[#E4E4E7] transition-colors cursor-pointer flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </div>

              {/* Excerpt */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-[#3F3F46] mb-1.5">
                  摘要
                </label>
                <input
                  type="text"
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="簡短描述這篇文章..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#18181B]/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200 text-sm"
                  required
                />
              </div>
            </div>
            
            {/* Cover Image Preview */}
            {form.coverImage && (
              <div className="mt-3 rounded-xl overflow-hidden border border-[#18181B]/10 max-w-xs">
                <img src={form.coverImage} alt="Cover preview" className="w-full h-24 object-cover" />
              </div>
            )}
          </div>

          {/* Editor & Preview - Bottom */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Editor Panel */}
            <div className="bg-white rounded-2xl border border-[#18181B]/10 shadow-sm flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-[#18181B]/10">
                <h2 className="text-base font-bold text-[#09090B]">撰寫內容</h2>
                <span className="text-xs text-[#A1A1AA]">支援 Markdown 語法</span>
              </div>
              
              {/* Toolbar */}
              <div className="flex flex-wrap gap-1 p-2 bg-[#F4F4F5] border-b border-[#18181B]/10">
                <button type="button" onClick={() => insertMarkdown('bold', 'bold text')} className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer" title="Bold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
                  </svg>
                </button>
                <button type="button" onClick={() => insertMarkdown('italic', 'italic text')} className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer" title="Italic">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-2 0v16m-4 0h8" />
                  </svg>
                </button>
                <div className="w-px h-6 bg-[#D4D4D8] mx-1 self-center"></div>
                <button type="button" onClick={() => insertMarkdown('h2', 'Heading')} className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer text-sm font-bold" title="Heading 2">H2</button>
                <button type="button" onClick={() => insertMarkdown('h3', 'Subheading')} className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer text-sm font-bold" title="Heading 3">H3</button>
                <div className="w-px h-6 bg-[#D4D4D8] mx-1 self-center"></div>
                <button type="button" onClick={() => insertMarkdown('link', 'link text')} className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer" title="Link">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
                <button type="button" onClick={() => insertMarkdown('image')} className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer" title="Upload Image">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <input id="content-image-upload" type="file" accept="image/*" onChange={handleContentImageUpload} className="hidden" disabled={isUploading} />
                <div className="w-px h-6 bg-[#D4D4D8] mx-1 self-center"></div>
                <button type="button" onClick={() => insertMarkdown('list', 'list item')} className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer" title="List">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                <button type="button" onClick={() => insertMarkdown('code', 'code')} className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer" title="Inline Code">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </button>
                <button type="button" onClick={() => insertMarkdown('codeblock', 'code block')} className="p-2 rounded-lg hover:bg-white transition-colors cursor-pointer text-xs font-mono" title="Code Block">{'</>'}</button>
              </div>
              
              {/* Editor */}
              <textarea
                id="content"
                ref={editorRef}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                onPaste={handlePaste}
                onScroll={handleEditorScroll}
                placeholder="使用 Markdown 撰寫文章內容，可直接貼上剪貼板中的圖片..."
                className="flex-1 w-full px-4 py-3 outline-none resize-none font-mono text-sm min-h-[500px] max-h-[500px] overflow-y-auto"
                required
              />
            </div>

            {/* Preview Panel */}
            <div className="bg-white rounded-2xl border border-[#18181B]/10 shadow-sm flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-[#18181B]/10">
                <h2 className="text-base font-bold text-[#09090B]">預覽</h2>
                <span className="text-xs text-[#A1A1AA]">即時同步</span>
              </div>

              {form.title || form.content ? (
                <div 
                  ref={previewRef}
                  onScroll={handlePreviewScroll}
                  className="flex-1 overflow-y-auto p-4 min-h-[500px] max-h-[500px] prose prose-sm prose-slate max-w-none
                  prose-headings:font-black prose-headings:text-[#09090B] prose-headings:tracking-tight
                  prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-2
                  prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
                  prose-p:text-[#3F3F46] prose-p:leading-relaxed prose-p:my-2
                  prose-a:text-[#2563EB] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-[#09090B] prose-strong:font-semibold
                  prose-ul:text-[#3F3F46] prose-ol:text-[#3F3F46] prose-ul:my-2 prose-ol:my-2
                  prose-li:marker:text-[#2563EB] prose-li:my-0.5
                  prose-code:text-[#09090B] prose-code:bg-[#F4F4F5] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-[#18181B] prose-pre:text-white prose-pre:rounded-xl prose-pre:my-3
                  prose-blockquote:border-l-[#2563EB] prose-blockquote:bg-[#F4F4F5] prose-blockquote:py-1 prose-blockquote:rounded-r-xl prose-blockquote:my-3
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:my-4
                ">
                  {form.category && (
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-[#2563EB]/10 text-[#2563EB] text-xs font-medium mb-3 not-prose">
                      {form.category}
                    </span>
                  )}
                  {form.title && (
                    <h1 className="text-2xl font-black text-[#09090B] tracking-tight mb-3 not-prose">
                      {form.title}
                    </h1>
                  )}
                  {form.excerpt && (
                    <p className="text-sm text-[#3F3F46] mb-4 pb-4 border-b border-[#18181B]/10 not-prose">
                      {form.excerpt}
                    </p>
                  )}
                  {form.spotifyTrackId && (
                    <div className="mb-4 p-3 rounded-xl bg-[#1DB954]/10 border border-[#1DB954]/20 not-prose">
                      <p className="text-xs text-[#1DB954] flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                        Spotify: {form.spotifyTrackId}
                      </p>
                    </div>
                  )}
                  {form.content && (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {form.content}
                    </ReactMarkdown>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-[#A1A1AA] min-h-[500px]">
                  <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">開始撰寫以預覽內容</p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
