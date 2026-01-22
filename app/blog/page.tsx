import Navbar from "@/components/Navbar";
import BlogList from "@/components/BlogList";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function BlogPage() {
  const supabase = await createClient();
  
  // 從 Supabase 取得已發布的文章
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  // 從 Supabase 取得所有分類（包含顏色）
  const { data: categories } = await supabase
    .from("categories")
    .select("name, color")
    .order("display_order", { ascending: true });

  const categoryList = categories || [];

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

        {/* Blog List with Filtering */}
        <BlogList posts={posts || []} categories={categoryList} />

        {/* Footer */}
        <footer className="mt-20 border-t border-[#18181B]/10 py-8 text-center text-sm text-[#71717A]">
          <p>© 2026 CdyTim. All rights reserved. Built with Next.js and Tailwind CSS.</p>
        </footer>
      </div>
    </main>
  );
}
