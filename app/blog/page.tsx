import Navbar from "@/components/Navbar";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// 計算閱讀時間
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export default async function BlogPage() {
  const supabase = await createClient();
  
  // 從 Supabase 取得已發布的文章
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  // 從 Supabase 取得所有分類
  const { data: categories } = await supabase
    .from("categories")
    .select("name")
    .order("display_order", { ascending: true });

  const categoryNames = categories?.map(c => c.name) || ["台大資管生活", "生活紀錄"];

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Navbar />

        {/* Header */}
        <section className="mt-16 mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[#3F3F46] hover:text-[#09090B] transition-colors duration-200 mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-black text-[#09090B] tracking-tight">
            Blog
          </h1>
          <p className="mt-4 text-lg text-[#3F3F46] max-w-2xl">
            記錄生活、課業、心得等等。
          </p>
        </section>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 mb-10">
          {["All", ...categoryNames].map((tag, index) => (
            <button
              key={tag}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                index === 0 
                  ? "bg-[#18181B] text-white" 
                  : "bg-white border border-[#18181B]/10 text-[#3F3F46] hover:border-[#2563EB] hover:text-[#2563EB]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts && posts.length > 0 ? posts.map((post) => (
            <Link 
              key={post.id}
              href={`/blog/${post.id}`}
              className="group flex flex-col p-6 rounded-2xl bg-white border border-[#18181B]/10 hover:border-[#2563EB]/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Cover Image Placeholder */}
              <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-[#E4E4E7] to-[#D4D4D8] mb-5 overflow-hidden">
                {post.cover_image ? (
                  <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#A1A1AA] text-sm">
                    Cover Image
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 rounded-md bg-[#F4F4F5] text-xs font-medium text-[#3F3F46]">
                  {post.category}
                </span>
                <span className="text-xs text-[#71717A]">{calculateReadTime(post.content)}</span>
                {post.spotify_track_id && (
                  <span className="ml-auto">
                    <svg className="w-4 h-4 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-[#09090B] group-hover:text-[#2563EB] transition-colors duration-200 line-clamp-2 mb-3">
                {post.title}
              </h2>
              <p className="text-sm text-[#71717A] line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-[#18181B]/10">
                <span className="text-xs text-[#A1A1AA]">
                  {new Date(post.created_at).toLocaleDateString("zh-TW", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-[#2563EB] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                  Read article 
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          )) : (
            <div className="col-span-full text-center py-16">
              <svg className="w-16 h-16 mx-auto text-[#D4D4D8] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-[#71717A]">還沒有文章，敬請期待！</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-[#18181B]/10 py-8 text-center text-sm text-[#71717A]">
          <p>© 2026 CdyTim. All rights reserved. Built with Next.js and Supabase.</p>
        </footer>
      </div>
    </main>
  );
}
