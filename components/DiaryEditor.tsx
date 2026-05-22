"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SpotifyEmbed from "@/components/SpotifyEmbed";

interface DiaryFormState {
  title: string;
  content: string;
  mood: string;
  weather: string;
  coverImage: string;
  spotifyTrackId: string;
  entryDate: string;
  isPublishedToBlog: boolean;
  publishedPostId: number | null;
}

// 支援使用者直接貼整段 Spotify 連結，自動抽出 track id。
// 支援格式：
//   https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
//   https://open.spotify.com/intl-zh/track/4cOdK2wGLETKBW3PvgPWqT?si=xxx
//   spotify:track:4cOdK2wGLETKBW3PvgPWqT
//   純 ID：4cOdK2wGLETKBW3PvgPWqT
function parseSpotifyTrackId(raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  const urlMatch = v.match(/spotify\.com\/(?:intl-[a-z-]+\/)?track\/([A-Za-z0-9]+)/i);
  if (urlMatch) return urlMatch[1];
  const uriMatch = v.match(/^spotify:track:([A-Za-z0-9]+)/i);
  if (uriMatch) return uriMatch[1];
  return v;
}

interface DiaryEditorProps {
  mode: "new" | "edit";
  diaryId?: number;
  initial?: Partial<DiaryFormState>;
}

const MOOD_OPTIONS = [
  { value: "happy", label: "😄 開心" },
  { value: "calm", label: "🙂 平靜" },
  { value: "tired", label: "😪 疲憊" },
  { value: "focused", label: "🎯 專注" },
  { value: "stressed", label: "😣 焦慮" },
  { value: "grateful", label: "🥰 感恩" },
  { value: "thoughtful", label: "🤔 沉思" },
];

const WEATHER_OPTIONS = [
  { value: "sunny", label: "☀️ 晴" },
  { value: "cloudy", label: "⛅ 多雲" },
  { value: "rainy", label: "🌧️ 雨" },
  { value: "windy", label: "💨 風" },
  { value: "snowy", label: "❄️ 雪" },
  { value: "night", label: "🌙 夜" },
];

function todayLocal(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function DiaryEditor({ mode, diaryId, initial }: DiaryEditorProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [publishCategory, setPublishCategory] = useState<string>("");

  const [form, setForm] = useState<DiaryFormState>({
    title: initial?.title ?? "",
    content: initial?.content ?? "",
    mood: initial?.mood ?? "",
    weather: initial?.weather ?? "",
    coverImage: initial?.coverImage ?? "",
    spotifyTrackId: initial?.spotifyTrackId ?? "",
    entryDate: initial?.entryDate ?? todayLocal(),
    isPublishedToBlog: initial?.isPublishedToBlog ?? false,
    publishedPostId: initial?.publishedPostId ?? null,
  });

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef<"editor" | "preview" | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .order("display_order", { ascending: true });
      if (data && data.length > 0) {
        setCategories(data);
        if (!publishCategory) setPublishCategory(data[0].name);
      } else {
        setCategories([{ id: "1", name: "日記" }]);
        setPublishCategory("日記");
      }
    }
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditorScroll = useCallback(() => {
    if (isScrollingRef.current === "preview") return;
    isScrollingRef.current = "editor";
    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;
    const editorScrollHeight = editor.scrollHeight - editor.clientHeight;
    if (editorScrollHeight <= 0) return;
    const scrollRatio = editor.scrollTop / editorScrollHeight;
    const previewScrollHeight = preview.scrollHeight - preview.clientHeight;
    preview.scrollTo({ top: scrollRatio * previewScrollHeight, behavior: "auto" });
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = null;
    }, 50);
  }, []);

  const handlePreviewScroll = useCallback(() => {
    if (isScrollingRef.current === "editor") return;
    isScrollingRef.current = "preview";
    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;
    const previewScrollHeight = preview.scrollHeight - preview.clientHeight;
    if (previewScrollHeight <= 0) return;
    const scrollRatio = preview.scrollTop / previewScrollHeight;
    const editorScrollHeight = editor.scrollHeight - editor.clientHeight;
    editor.scrollTo({ top: scrollRatio * editorScrollHeight, behavior: "auto" });
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = null;
    }, 50);
  }, []);

  // 上傳圖片，沿用 blog-images bucket
  async function uploadImage(file: File): Promise<string | null> {
    try {
      setIsUploading(true);
      if (file.size === 0) {
        alert("檔案大小為 0，請重新選擇圖片");
        return null;
      }
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `diary/${fileName}`;
      const { data, error } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });
      if (error) {
        alert("圖片上傳失敗：" + error.message);
        return null;
      }
      const { data: publicData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(data.path);
      return publicData.publicUrl;
    } finally {
      setIsUploading(false);
    }
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setForm((f) => ({ ...f, coverImage: url }));
  }

  async function handleContentUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) {
      const textarea = editorRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const next =
        form.content.substring(0, start) +
        `\n![Image](${url})\n` +
        form.content.substring(end);
      setForm((f) => ({ ...f, content: next }));
    }
  }

  async function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        const renamed = new File([file], `diary-pasted-${ts}.png`, { type: file.type });
        const url = await uploadImage(renamed);
        if (url) {
          const textarea = e.target as HTMLTextAreaElement;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const next =
            form.content.substring(0, start) +
            `\n![Image](${url})\n` +
            form.content.substring(end);
          setForm((f) => ({ ...f, content: next }));
        }
        break;
      }
    }
  }

  function insertMarkdown(kind: string, placeholder = "") {
    const textarea = editorRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.content.substring(start, end) || placeholder;
    let chunk = "";
    switch (kind) {
      case "bold": chunk = `**${selected}**`; break;
      case "italic": chunk = `*${selected}*`; break;
      case "h2": chunk = `\n## ${selected}\n`; break;
      case "h3": chunk = `\n### ${selected}\n`; break;
      case "link": chunk = `[${selected}](url)`; break;
      case "list": chunk = `\n- ${selected}\n`; break;
      case "quote": chunk = `\n> ${selected}\n`; break;
      case "code": chunk = `\`${selected}\``; break;
      case "image":
        document.getElementById("diary-content-image-upload")?.click();
        return;
      default: chunk = selected;
    }
    const next = form.content.substring(0, start) + chunk + form.content.substring(end);
    setForm((f) => ({ ...f, content: next }));
  }

  // 儲存（不發布到 blog）
  async function handleSave(publishToBlog = false) {
    setIsSaving(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) {
        alert("請先登入");
        router.push("/login");
        return;
      }

      // ---- Step 1: 寫入 / 更新 diary 本身 ----
      let currentDiaryId = diaryId ?? null;
      const diaryPayload = {
        title: form.title,
        content: form.content,
        mood: form.mood || null,
        weather: form.weather || null,
        cover_image: form.coverImage || null,
        spotify_track_id: form.spotifyTrackId || null,
        entry_date: form.entryDate,
      };

      if (mode === "new") {
        const { data, error } = await supabase
          .from("diaries")
          .insert({ ...diaryPayload, author_id: user.id })
          .select("id")
          .single();
        if (error || !data) {
          alert("儲存失敗：" + (error?.message ?? "unknown"));
          return;
        }
        currentDiaryId = data.id;
      } else if (mode === "edit" && diaryId) {
        const { error } = await supabase
          .from("diaries")
          .update(diaryPayload)
          .eq("id", diaryId);
        if (error) {
          alert("更新失敗：" + error.message);
          return;
        }
      }

      // ---- Step 2: 處理 blog 發布同步 ----
      if (publishToBlog) {
        const postPayload = {
          title: form.title,
          excerpt:
            form.content.replace(/[#>*`!\[\]()]/g, "").slice(0, 140).trim() ||
            form.title,
          content: form.content,
          category: publishCategory || "日記",
          cover_image: form.coverImage || null,
          spotify_track_id: form.spotifyTrackId || null,
          published: true,
          author_id: user.id,
        };

        if (form.publishedPostId) {
          const { error } = await supabase
            .from("posts")
            .update(postPayload)
            .eq("id", form.publishedPostId);
          if (error) {
            alert("更新已發布文章失敗：" + error.message);
            return;
          }
        } else {
          const { data: postRow, error } = await supabase
            .from("posts")
            .insert(postPayload)
            .select("id")
            .single();
          if (error || !postRow) {
            alert("發布到 Blog 失敗：" + (error?.message ?? "unknown"));
            return;
          }
          if (currentDiaryId) {
            await supabase
              .from("diaries")
              .update({
                is_published_to_blog: true,
                published_post_id: postRow.id,
              })
              .eq("id", currentDiaryId);
          }
          setForm((f) => ({
            ...f,
            isPublishedToBlog: true,
            publishedPostId: postRow.id,
          }));
        }
      }

      alert(publishToBlog ? "已儲存並同步到 Blog" : "已儲存");
      router.push("/admin/diary");
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  // 取消 blog 發布
  async function handleUnpublishFromBlog() {
    if (!form.publishedPostId) return;
    if (!confirm("確定要把這篇從 Blog 下架嗎？日記本身會保留。")) return;
    setIsSaving(true);
    try {
      const { error: postErr } = await supabase
        .from("posts")
        .delete()
        .eq("id", form.publishedPostId);
      if (postErr) {
        alert("下架失敗：" + postErr.message);
        return;
      }
      if (diaryId) {
        await supabase
          .from("diaries")
          .update({ is_published_to_blog: false, published_post_id: null })
          .eq("id", diaryId);
      }
      setForm((f) => ({ ...f, isPublishedToBlog: false, publishedPostId: null }));
      alert("已從 Blog 下架");
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/diary" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-full bg-[var(--home-text-strong)] text-[var(--home-bg)] grid place-items-center font-bold group-hover:scale-110 transition-transform duration-200">
                日
              </div>
              <span className="text-xl font-semibold text-[var(--home-text-strong)]">
                {mode === "new" ? "新日記" : "編輯日記"}
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[var(--home-surface)] border border-[var(--home-border)] px-2.5 py-0.5 text-xs font-medium text-[var(--home-muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse-soft" />
              私人 · 只有你看得到
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isSaving || isUploading}
              className="px-4 py-2 rounded-xl border-2 border-[var(--home-text-strong)] text-[var(--home-text-strong)] font-semibold text-sm hover:bg-[var(--home-text-strong)] hover:text-[var(--home-bg)] transition-all duration-200 disabled:opacity-50"
            >
              {isSaving ? "儲存中…" : "儲存日記"}
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isSaving || isUploading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] text-white font-semibold text-sm hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
              </svg>
              {form.publishedPostId ? "更新 Blog" : "發布到 Blog"}
            </button>
            {form.publishedPostId && (
              <button
                type="button"
                onClick={handleUnpublishFromBlog}
                disabled={isSaving}
                className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                title="從 Blog 移除（保留日記）"
              >
                從 Blog 下架
              </button>
            )}
            <Link
              href="/admin/diary"
              className="text-sm text-[var(--home-muted)] hover:text-[var(--home-text-strong)] transition-colors ml-2"
            >
              ← 返回
            </Link>
          </div>
        </header>

        {/* Meta panel */}
        <div className="bg-[var(--home-surface)] rounded-2xl border border-[var(--home-border)] p-5 shadow-sm mb-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-[var(--home-text)] mb-1.5">標題</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="今天的標題…"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--home-bg)] border border-[var(--home-border)] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200 text-sm text-[var(--home-text-strong)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--home-text)] mb-1.5">日期</label>
              <input
                type="date"
                value={form.entryDate}
                onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--home-bg)] border border-[var(--home-border)] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200 text-sm text-[var(--home-text-strong)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--home-text)] mb-1.5">心情</label>
              <select
                value={form.mood}
                onChange={(e) => setForm({ ...form, mood: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--home-bg)] border border-[var(--home-border)] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200 text-sm text-[var(--home-text-strong)] cursor-pointer"
              >
                <option value="">未指定</option>
                {MOOD_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--home-text)] mb-1.5">天氣</label>
              <select
                value={form.weather}
                onChange={(e) => setForm({ ...form, weather: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--home-bg)] border border-[var(--home-border)] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200 text-sm text-[var(--home-text-strong)] cursor-pointer"
              >
                <option value="">未指定</option>
                {WEATHER_OPTIONS.map((w) => (
                  <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-[var(--home-text)] mb-1.5">封面圖（選填）</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="圖片 URL…"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--home-bg)] border border-[var(--home-border)] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200 text-sm text-[var(--home-text-strong)]"
                />
                <label className="px-3 py-2.5 rounded-xl bg-[var(--home-surface-muted)] text-[var(--home-text)] font-medium hover:bg-[var(--home-border)] transition-colors cursor-pointer text-sm">
                  {isUploading ? "上傳中…" : "上傳"}
                  <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={isUploading} />
                </label>
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-[var(--home-text)] mb-1.5">
                <span className="inline-flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                  Spotify 曲目（選填）
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.spotifyTrackId}
                  onChange={(e) =>
                    setForm({ ...form, spotifyTrackId: parseSpotifyTrackId(e.target.value) })
                  }
                  onPaste={(e) => {
                    const txt = e.clipboardData.getData("text");
                    const id = parseSpotifyTrackId(txt);
                    if (id && id !== txt) {
                      e.preventDefault();
                      setForm({ ...form, spotifyTrackId: id });
                    }
                  }}
                  placeholder="貼上 Spotify 連結，或直接輸入 track ID"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--home-bg)] border border-[var(--home-border)] focus:border-[#1DB954] focus:ring-2 focus:ring-[#1DB954]/25 outline-none transition-all duration-200 text-sm text-[var(--home-text-strong)] font-mono"
                />
                {form.spotifyTrackId && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, spotifyTrackId: "" })}
                    className="px-3 py-2.5 rounded-xl bg-[var(--home-surface-muted)] text-[var(--home-text)] font-medium hover:bg-[var(--home-border)] transition-colors text-sm"
                    title="清除 Spotify 曲目"
                  >
                    清除
                  </button>
                )}
              </div>
              {form.spotifyTrackId && (
                <p className="mt-1.5 text-[11px] text-[var(--home-muted-soft)]">
                  Track ID:{" "}
                  <span className="font-mono text-[var(--home-muted)]">
                    {form.spotifyTrackId}
                  </span>
                </p>
              )}
            </div>

            {/* publish-to-blog config */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-[var(--home-text)] mb-1.5">發布到 Blog 時的分類</label>
              <select
                value={publishCategory}
                onChange={(e) => setPublishCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--home-bg)] border border-[var(--home-border)] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200 text-sm text-[var(--home-text-strong)] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {form.coverImage && (
            <div className="mt-3 rounded-xl overflow-hidden border border-[var(--home-border)] max-w-xs">
              <img src={form.coverImage} alt="cover" className="w-full h-24 object-cover" />
            </div>
          )}

          {form.publishedPostId && (
            <div className="mt-4 flex items-center gap-2 text-xs text-[#047857] bg-[#ECFDF5] border border-[#10B981]/30 rounded-lg px-3 py-2 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              已同步發布到 Blog （Post ID: {form.publishedPostId}）
            </div>
          )}
        </div>

        {/* Editor + Preview */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-[var(--home-surface)] rounded-2xl border border-[var(--home-border)] shadow-sm flex flex-col backdrop-blur-sm">
            <div className="flex items-center justify-between p-4 border-b border-[var(--home-border)]">
              <h2 className="text-base font-bold text-[var(--home-text-strong)]">寫日記</h2>
              <span className="text-xs text-[var(--home-muted-soft)]">Markdown 支援，可貼圖</span>
            </div>

            <div className="flex flex-wrap gap-1 p-2 bg-[var(--home-surface-muted)] border-b border-[var(--home-border)]">
              <button type="button" onClick={() => insertMarkdown("bold", "bold")} className="p-2 rounded-lg hover:bg-[var(--home-bg)] transition-colors text-sm font-bold">B</button>
              <button type="button" onClick={() => insertMarkdown("italic", "italic")} className="p-2 rounded-lg hover:bg-[var(--home-bg)] transition-colors text-sm italic">I</button>
              <div className="w-px h-6 bg-[var(--home-border)] mx-1 self-center" />
              <button type="button" onClick={() => insertMarkdown("h2", "Heading")} className="p-2 rounded-lg hover:bg-[var(--home-bg)] transition-colors text-sm font-bold">H2</button>
              <button type="button" onClick={() => insertMarkdown("h3", "Subheading")} className="p-2 rounded-lg hover:bg-[var(--home-bg)] transition-colors text-sm font-bold">H3</button>
              <div className="w-px h-6 bg-[var(--home-border)] mx-1 self-center" />
              <button type="button" onClick={() => insertMarkdown("link", "link text")} className="p-2 rounded-lg hover:bg-[var(--home-bg)] transition-colors text-sm">🔗</button>
              <button type="button" onClick={() => insertMarkdown("image")} className="p-2 rounded-lg hover:bg-[var(--home-bg)] transition-colors text-sm">🖼️</button>
              <input id="diary-content-image-upload" type="file" accept="image/*" onChange={handleContentUpload} className="hidden" disabled={isUploading} />
              <button type="button" onClick={() => insertMarkdown("list", "item")} className="p-2 rounded-lg hover:bg-[var(--home-bg)] transition-colors text-sm">•</button>
              <button type="button" onClick={() => insertMarkdown("quote", "quote")} className="p-2 rounded-lg hover:bg-[var(--home-bg)] transition-colors text-sm">❝</button>
              <button type="button" onClick={() => insertMarkdown("code", "code")} className="p-2 rounded-lg hover:bg-[var(--home-bg)] transition-colors text-xs font-mono">{"</>"}</button>
            </div>

            <textarea
              ref={editorRef}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              onPaste={handlePaste}
              onScroll={handleEditorScroll}
              placeholder="把今天記下來吧，可貼圖、可寫 Markdown…"
              className="flex-1 w-full px-4 py-3 outline-none resize-none font-mono text-sm min-h-[480px] max-h-[480px] overflow-y-auto bg-transparent text-[var(--home-text-strong)]"
            />
          </div>

          <div className="bg-[var(--home-surface)] rounded-2xl border border-[var(--home-border)] shadow-sm flex flex-col backdrop-blur-sm">
            <div className="flex items-center justify-between p-4 border-b border-[var(--home-border)]">
              <h2 className="text-base font-bold text-[var(--home-text-strong)]">預覽</h2>
              <span className="text-xs text-[var(--home-muted-soft)]">即時同步</span>
            </div>

            <div
              ref={previewRef}
              onScroll={handlePreviewScroll}
              className="flex-1 overflow-y-auto p-4 min-h-[480px] max-h-[480px] prose prose-sm prose-slate max-w-none
                prose-headings:font-black prose-headings:text-[var(--home-text-strong)] prose-headings:tracking-tight
                prose-p:text-[var(--home-text)] prose-p:leading-relaxed
                prose-a:text-[#2563EB]
                prose-strong:text-[var(--home-text-strong)]
                prose-blockquote:border-l-[#2563EB] prose-blockquote:bg-[var(--home-surface-muted)] prose-blockquote:py-1 prose-blockquote:rounded-r-xl
                prose-img:rounded-xl"
            >
              <div className="flex items-center gap-2 flex-wrap mb-3 not-prose">
                {form.entryDate && (
                  <span className="text-xs font-medium text-[var(--home-muted)]">
                    {new Date(form.entryDate).toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                )}
                {form.mood && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--home-surface-muted)] text-[var(--home-text)]">
                    {MOOD_OPTIONS.find((m) => m.value === form.mood)?.label}
                  </span>
                )}
                {form.weather && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--home-surface-muted)] text-[var(--home-text)]">
                    {WEATHER_OPTIONS.find((w) => w.value === form.weather)?.label}
                  </span>
                )}
              </div>
              {form.title && (
                <h1 className="text-2xl font-black text-[var(--home-text-strong)] tracking-tight mb-3 not-prose">
                  {form.title}
                </h1>
              )}
              {form.spotifyTrackId && (
                <div className="mb-4 not-prose">
                  <SpotifyEmbed trackId={form.spotifyTrackId} />
                </div>
              )}
              {form.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content}</ReactMarkdown>
              ) : (
                <p className="text-[var(--home-muted-soft)] text-sm not-prose">開始寫，預覽會在這裡同步出現…</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
