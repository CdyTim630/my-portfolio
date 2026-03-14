"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

interface ResumeLinkManagerProps {
  initialResumeUrl: string;
}

export default function ResumeLinkManager({ initialResumeUrl }: ResumeLinkManagerProps) {
  const [resumeUrl, setResumeUrl] = useState(initialResumeUrl);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/settings/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeUrl }),
      });

      const result = (await response.json()) as { error?: string; resumeUrl?: string };
      if (!response.ok) {
        setError(result.error || "更新履歷連結失敗。");
        return;
      }

      setResumeUrl(result.resumeUrl || resumeUrl);
      setMessage("履歷連結已更新。");
    } catch {
      setError("更新履歷連結失敗。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-[#71717A]">Admin</p>
            <h1 className="text-3xl font-black text-[#09090B]">履歷連結管理</h1>
          </div>
          <Link
            href="/admin"
            className="rounded-xl bg-[#3F3F46] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#18181B]"
          >
            返回後台
          </Link>
        </header>

        <section className="rounded-2xl border border-[#18181B]/10 bg-white p-6 shadow-sm">
          <p className="mb-6 text-sm text-[#3F3F46]">
            只要更新下方履歷連結，主頁所有 `Download CV` 按鈕都會自動套用最新連結。
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="resume-url" className="mb-2 block text-sm font-medium text-[#18181B]">
                履歷 URL
              </label>
              <input
                id="resume-url"
                type="url"
                value={resumeUrl}
                onChange={(event) => setResumeUrl(event.target.value)}
                placeholder="https://..."
                required
                className="w-full rounded-xl border border-[#18181B]/10 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "儲存中..." : "儲存履歷連結"}
              </button>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[#18181B]/10 px-5 py-2.5 text-sm font-semibold text-[#3F3F46] transition-all duration-200 hover:border-[#2563EB] hover:text-[#2563EB]"
              >
                預覽連結
              </a>
            </div>
          </form>

          {message && (
            <p className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </p>
          )}
          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
