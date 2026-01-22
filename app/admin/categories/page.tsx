'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  display_order: number;
  created_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', color: 'blue' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', slug: '', color: 'blue' });
  const [message, setMessage] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessage('讀取分類失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      setMessage('請輸入分類名稱');
      return;
    }

    try {
      const slug = newCategory.slug.trim() || 
        newCategory.name.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-\u4e00-\u9fa5]/g, '');

      // 計算新分類的順序（最大值 + 1）
      const maxOrder = categories.length > 0 
        ? Math.max(...categories.map(c => c.display_order || 0))
        : 0;

      const { error } = await supabase
        .from('categories')
        .insert([{ 
          name: newCategory.name.trim(), 
          slug, 
          color: newCategory.color,
          display_order: maxOrder + 1 
        }]);

      if (error) throw error;

      setMessage('分類新增成功！');
      setNewCategory({ name: '', slug: '', color: 'blue' });
      fetchCategories();
    } catch (error: any) {
      console.error('Error creating category:', error);
      if (error.code === '23505') {
        setMessage('此分類名稱已存在');
      } else {
        setMessage('新增分類失敗');
      }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditForm({ name: category.name, slug: category.slug, color: category.color || 'blue' });
  };

  const handleUpdate = async (id: string) => {
    if (!editForm.name.trim()) {
      setMessage('請輸入分類名稱');
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .update({ 
          name: editForm.name.trim(),
          slug: editForm.slug.trim() || editForm.name.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-\u4e00-\u9fa5]/g, ''),
          color: editForm.color
        })
        .eq('id', id);

      if (error) throw error;

      setMessage('分類更新成功！');
      setEditingId(null);
      fetchCategories();
    } catch (error: any) {
      console.error('Error updating category:', error);
      if (error.code === '23505') {
        setMessage('此分類名稱已存在');
      } else {
        setMessage('更新分類失敗');
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`確定要刪除「${name}」分類嗎？`)) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage('分類刪除成功！');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      setMessage('刪除分類失敗');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return; // 已經是第一個

    const current = categories[index];
    const previous = categories[index - 1];

    try {
      // 交換順序
      await supabase
        .from('categories')
        .update({ display_order: previous.display_order })
        .eq('id', current.id);

      await supabase
        .from('categories')
        .update({ display_order: current.display_order })
        .eq('id', previous.id);

      setMessage('順序更新成功！');
      fetchCategories();
    } catch (error) {
      console.error('Error moving category:', error);
      setMessage('更新順序失敗');
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === categories.length - 1) return; // 已經是最後一個

    const current = categories[index];
    const next = categories[index + 1];

    try {
      // 交換順序
      await supabase
        .from('categories')
        .update({ display_order: next.display_order })
        .eq('id', current.id);

      await supabase
        .from('categories')
        .update({ display_order: current.display_order })
        .eq('id', next.id);

      setMessage('順序更新成功！');
      fetchCategories();
    } catch (error) {
      console.error('Error moving category:', error);
      setMessage('更新順序失敗');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-[#3F3F46]">載入中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#18181B]">分類管理</h1>
          <Link
            href="/admin"
            className="px-6 py-2 bg-[#3F3F46] text-white rounded-xl hover:bg-[#18181B] transition-all duration-200"
          >
            返回後台
          </Link>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-xl text-[#2563EB]">
            {message}
          </div>
        )}

        {/* Create New Category */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#18181B]/10 p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#18181B] mb-4">新增分類</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#18181B] mb-2">
                分類名稱 *
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="例如：台大資管生活"
                className="w-full px-4 py-3 rounded-xl border border-[#18181B]/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#18181B] mb-2">
                URL 代稱（可選）
              </label>
              <input
                type="text"
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                placeholder="例如：ntu-im-life（留空則自動生成）"
                className="w-full px-4 py-3 rounded-xl border border-[#18181B]/10 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#18181B] mb-2">
                顏色主題 *
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: 'blue', label: '藍色', bg: 'bg-blue-500', border: 'border-blue-500' },
                  { name: 'emerald', label: '綠色', bg: 'bg-emerald-500', border: 'border-emerald-500' },
                  { name: 'purple', label: '紫色', bg: 'bg-purple-500', border: 'border-purple-500' },
                  { name: 'amber', label: '琥珀色', bg: 'bg-amber-500', border: 'border-amber-500' },
                  { name: 'rose', label: '玫瑰色', bg: 'bg-rose-500', border: 'border-rose-500' },
                  { name: 'cyan', label: '青色', bg: 'bg-cyan-500', border: 'border-cyan-500' },
                  { name: 'pink', label: '粉色', bg: 'bg-pink-500', border: 'border-pink-500' },
                  { name: 'indigo', label: '靛藍色', bg: 'bg-indigo-500', border: 'border-indigo-500' },
                ].map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, color: color.name })}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      newCategory.color === color.name
                        ? `${color.border} shadow-lg scale-105`
                        : 'border-[#18181B]/10 hover:border-[#18181B]/30'
                    }`}
                  >
                    <div className={`w-full h-8 rounded-lg ${color.bg} mb-2`}></div>
                    <p className="text-xs text-[#3F3F46] text-center">{color.label}</p>
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#2563EB] text-white rounded-xl hover:bg-[#2563EB]/90 transition-all duration-200 font-medium"
            >
              新增分類
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#18181B]/10 p-6">
          <h2 className="text-xl font-semibold text-[#18181B] mb-4">所有分類</h2>
          {categories.length === 0 ? (
            <p className="text-[#3F3F46] text-center py-8">尚無分類</p>
          ) : (
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="flex items-center gap-3 p-4 rounded-xl border border-[#18181B]/10 hover:border-[#2563EB]/30 transition-all duration-200"
                >
                  {/* 上下移動按鈕 */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className={`p-1 rounded transition-all ${
                        index === 0
                          ? 'text-[#D4D4D8] cursor-not-allowed'
                          : 'text-[#3F3F46] hover:bg-[#F4F4F5] hover:text-[#2563EB]'
                      }`}
                      title="上移"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === categories.length - 1}
                      className={`p-1 rounded transition-all ${
                        index === categories.length - 1
                          ? 'text-[#D4D4D8] cursor-not-allowed'
                          : 'text-[#3F3F46] hover:bg-[#F4F4F5] hover:text-[#2563EB]'
                      }`}
                      title="下移"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {editingId === category.id ? (
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-lg border border-[#18181B]/10 focus:border-[#2563EB] outline-none"
                          placeholder="分類名稱"
                        />
                        <input
                          type="text"
                          value={editForm.slug}
                          onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-lg border border-[#18181B]/10 focus:border-[#2563EB] outline-none"
                          placeholder="URL 代稱"
                        />
                      </div>
                      <div className="flex gap-2">
                        {[
                          { name: 'blue', bg: 'bg-blue-500', border: 'border-blue-500' },
                          { name: 'emerald', bg: 'bg-emerald-500', border: 'border-emerald-500' },
                          { name: 'purple', bg: 'bg-purple-500', border: 'border-purple-500' },
                          { name: 'amber', bg: 'bg-amber-500', border: 'border-amber-500' },
                          { name: 'rose', bg: 'bg-rose-500', border: 'border-rose-500' },
                          { name: 'cyan', bg: 'bg-cyan-500', border: 'border-cyan-500' },
                          { name: 'pink', bg: 'bg-pink-500', border: 'border-pink-500' },
                          { name: 'indigo', bg: 'bg-indigo-500', border: 'border-indigo-500' },
                        ].map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => setEditForm({ ...editForm, color: color.name })}
                            className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                              editForm.color === color.name
                                ? `${color.border} scale-110`
                                : 'border-[#18181B]/10 hover:border-[#18181B]/30'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded ${color.bg}`}></div>
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(category.id)}
                          className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB]/90 transition-all"
                        >
                          儲存
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 bg-[#3F3F46] text-white rounded-lg hover:bg-[#18181B] transition-all"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-${category.color || 'blue'}-500 flex-shrink-0`}></div>
                        <div>
                          <h3 className="font-medium text-[#18181B]">{category.name}</h3>
                          <p className="text-sm text-[#3F3F46]">{category.slug}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="px-4 py-2 text-[#2563EB] hover:bg-[#2563EB]/10 rounded-lg transition-all"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          刪除
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
