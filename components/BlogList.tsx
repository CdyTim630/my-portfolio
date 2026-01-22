'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  excerpt?: string;
  content: string;
  category?: string;
  cover_image?: string;
  spotify_track_id?: string;
  created_at: string;
}

interface Category {
  name: string;
  color: string;
}

interface BlogListProps {
  posts: Post[];
  categories: Category[];
}

// 根據顏色名稱生成 Tailwind 類別
function getColorClasses(colorName: string) {
  const colorMap: Record<string, { bg: string; text: string; border: string; hover: string }> = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:border-blue-500 hover:bg-blue-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      hover: 'hover:border-emerald-500 hover:bg-emerald-100',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      hover: 'hover:border-purple-500 hover:bg-purple-100',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      hover: 'hover:border-amber-500 hover:bg-amber-100',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      hover: 'hover:border-rose-500 hover:bg-rose-100',
    },
    cyan: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200',
      hover: 'hover:border-cyan-500 hover:bg-cyan-100',
    },
    pink: {
      bg: 'bg-pink-50',
      text: 'text-pink-700',
      border: 'border-pink-200',
      hover: 'hover:border-pink-500 hover:bg-pink-100',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      hover: 'hover:border-indigo-500 hover:bg-indigo-100',
    },
  };

  return colorMap[colorName] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    hover: 'hover:border-gray-500 hover:bg-gray-100',
  };
}

// 計算閱讀時間
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export default function BlogList({ posts, categories }: BlogListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // 篩選文章
  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <>
      {/* Filter Tags */}
      <div className="flex flex-wrap gap-2 mb-10">
        {/* All 按鈕 */}
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            selectedCategory === 'All'
              ? 'bg-[#18181B] text-white shadow-lg shadow-[#18181B]/25 scale-105'
              : 'bg-white border-2 border-[#18181B]/10 text-[#3F3F46] hover:border-[#18181B] hover:scale-105'
          }`}
        >
          All
        </button>
        
        {/* 分類按鈕 */}
        {categories.map((category) => {
          const colors = getColorClasses(category.color);
          const isActive = selectedCategory === category.name;
          
          return (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border-2 ${
                isActive
                  ? `${colors.bg} ${colors.text} ${colors.border} shadow-lg scale-105`
                  : `bg-white border-[#18181B]/10 text-[#3F3F46] ${colors.hover} hover:scale-105`
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts && filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            // 找到該文章分類對應的顏色
            const category = categories.find(c => c.name === post.category);
            const colors = getColorClasses(category?.color || 'blue');
            
            return (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group flex flex-col p-6 rounded-2xl bg-white border border-[#18181B]/10 hover:border-[#2563EB]/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-[#E4E4E7] to-[#D4D4D8] mb-5 overflow-hidden">
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#A1A1AA] text-sm">
                      Cover Image
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-[#71717A]">
                    {calculateReadTime(post.content)}
                  </span>
                  {post.spotify_track_id && (
                    <span className="ml-auto">
                      <svg
                        className="w-4 h-4 text-[#1DB954]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-[#09090B] mb-3 group-hover:text-[#2563EB] transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="text-sm text-[#71717A] mb-4 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-[#71717A] mt-auto pt-4 border-t border-[#18181B]/5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(post.created_at).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full text-center py-20">
            <svg
              className="w-20 h-20 mx-auto mb-4 text-[#D4D4D8]"
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
            <p className="text-[#71717A] text-lg">此分類尚無文章</p>
          </div>
        )}
      </div>
    </>
  );
}
