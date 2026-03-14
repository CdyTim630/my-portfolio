"use client";

import { useState } from "react";
import Link from "next/link";

interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
  sort_order: number;
}

interface ExperienceManagerProps {
  initialExperiences: Experience[];
}

const emptyForm = {
  title: "",
  company: "",
  period: "",
  description: "",
  skills: "",
  sort_order: 0,
};

export default function ExperienceManager({ initialExperiences }: ExperienceManagerProps) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState<Omit<typeof emptyForm, "sort_order"> & { sort_order: number }>({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  // ── 新增 ──────────────────────────────────────────
  async function handleAdd() {
    setSaving(true);
    const body = {
      ...form,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      sort_order: experiences.length + 1,
    };
    const res = await fetch("/api/admin/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const newExp = await res.json();
      setExperiences([...experiences, newExp]);
      setForm(emptyForm);
      setShowAddForm(false);
    }
    setSaving(false);
  }

  // ── 開始編輯 ──────────────────────────────────────
  function startEdit(exp: Experience) {
    setEditingId(exp.id);
    setEditForm({
      title: exp.title,
      company: exp.company,
      period: exp.period,
      description: exp.description,
      skills: exp.skills.join(", "),
      sort_order: exp.sort_order,
    });
  }

  // ── 儲存編輯 ──────────────────────────────────────
  async function handleSaveEdit(id: number) {
    setSaving(true);
    const body = {
      ...editForm,
      skills: editForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
    };
    const res = await fetch(`/api/admin/experiences/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const updated = await res.json();
      setExperiences(experiences.map((e) => (e.id === id ? updated : e)));
      setEditingId(null);
    }
    setSaving(false);
  }

  // ── 刪除 ──────────────────────────────────────────
  async function handleDelete(id: number) {
    if (!confirm("確定要刪除這筆 Experience 嗎？")) return;
    const res = await fetch(`/api/admin/experiences/${id}`, { method: "DELETE" });
    if (res.ok) {
      setExperiences(experiences.filter((e) => e.id !== id));
    }
  }

  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-[#71717A] hover:text-[#09090B] transition-colors">
              ← 返回後台
            </Link>
            <h1 className="text-2xl font-bold text-[#09090B]">Experience 管理</h1>
          </div>
          <button
            onClick={() => { setShowAddForm(!showAddForm); setForm(emptyForm); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新增 Experience
          </button>
        </header>

        {/* 新增表單 */}
        {showAddForm && (
          <div className="mb-8 p-6 rounded-2xl bg-white border border-[#2563EB]/30 shadow-sm">
            <h2 className="text-lg font-semibold text-[#09090B] mb-4">新增項目</h2>
            <ExperienceForm
              value={form}
              onChange={setForm}
              onSubmit={handleAdd}
              onCancel={() => setShowAddForm(false)}
              saving={saving}
              submitLabel="新增"
            />
          </div>
        )}

        {/* 清單 */}
        <div className="space-y-4">
          {experiences.length === 0 && (
            <div className="p-12 text-center text-[#71717A] bg-white rounded-2xl border border-[#18181B]/10">
              尚無 Experience，點擊右上角新增。
            </div>
          )}
          {experiences
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((exp) => (
              <div key={exp.id} className="rounded-2xl bg-white border border-[#18181B]/10 shadow-sm overflow-hidden">
                {editingId === exp.id ? (
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-[#09090B] mb-4">編輯項目</h2>
                    <ExperienceForm
                      value={editForm}
                      onChange={setEditForm}
                      onSubmit={() => handleSaveEdit(exp.id)}
                      onCancel={() => setEditingId(null)}
                      saving={saving}
                      submitLabel="儲存"
                    />
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-medium text-[#71717A] bg-[#F4F4F5] px-2 py-0.5 rounded-full">
                            #{exp.sort_order}
                          </span>
                          <h3 className="text-base font-semibold text-[#09090B]">{exp.title}</h3>
                        </div>
                        <p className="text-sm text-[#2563EB] font-medium mb-1">{exp.company}</p>
                        <p className="text-xs text-[#71717A] mb-2">{exp.period}</p>
                        <p className="text-sm text-[#3F3F46] leading-relaxed mb-3">{exp.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill) => (
                            <span key={skill} className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#F4F4F5] text-[#3F3F46]">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => startEdit(exp)}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#F4F4F5] text-[#3F3F46] hover:bg-[#E4E4E7] transition-all duration-200"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-200"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}

// ── 可重用的表單元件 ──────────────────────────────────
interface FormValue {
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string;
  sort_order: number;
}

function ExperienceForm({
  value,
  onChange,
  onSubmit,
  onCancel,
  saving,
  submitLabel,
}: {
  value: FormValue;
  onChange: (v: FormValue) => void;
  onSubmit: () => void;
  onCancel: () => void;
  saving: boolean;
  submitLabel: string;
}) {
  const field = (key: keyof FormValue) => ({
    value: value[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...value, [key]: e.target.value }),
  });

  const inputCls =
    "w-full rounded-xl border border-[#18181B]/15 bg-[#FAFAFA] px-4 py-2.5 text-sm text-[#09090B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#3F3F46] mb-1.5">職稱 / 角色 *</label>
          <input className={inputCls} placeholder="e.g. Backend Engineer Intern" {...field("title")} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#3F3F46] mb-1.5">公司 / 機構 *</label>
          <input className={inputCls} placeholder="e.g. National Taiwan University" {...field("company")} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#3F3F46] mb-1.5">期間 *</label>
          <input className={inputCls} placeholder="e.g. 2025 - Present" {...field("period")} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#3F3F46] mb-1.5">排序（數字越小越前面）</label>
          <input
            type="number"
            className={inputCls}
            value={value.sort_order}
            onChange={(e) => onChange({ ...value, sort_order: Number(e.target.value) })}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#3F3F46] mb-1.5">描述 *</label>
        <textarea
          className={`${inputCls} min-h-[80px] resize-y`}
          placeholder="描述工作內容或成就..."
          {...field("description")}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[#3F3F46] mb-1.5">技能（用逗號分隔）</label>
        <input className={inputCls} placeholder="e.g. TypeScript, Node.js, PostgreSQL" {...field("skills")} />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={onSubmit}
          disabled={saving || !value.title || !value.company || !value.period || !value.description}
          className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1d4ed8] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {saving ? "處理中…" : submitLabel}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl bg-[#F4F4F5] text-[#3F3F46] text-sm font-semibold hover:bg-[#E4E4E7] transition-all duration-200"
        >
          取消
        </button>
      </div>
    </div>
  );
}
