import Navbar from "@/components/Navbar";
import Link from "next/link";
import { notFound } from "next/navigation";
import SpotifyEmbed from "@/components/SpotifyEmbed";
import ShareAndComments from "@/components/ShareAndComments";
import { createClient } from "@/lib/supabase/server";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 計算閱讀時間
function calculateReadTime(content: string): string {
  const wordsPerMinute = 40;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const supabase = await createClient();
  
  // 從 Supabase 取得單篇文章
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Navbar />

        {/* Back Navigation */}
        <div className="mt-12 mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-[#3F3F46] hover:text-[#09090B] transition-colors duration-200 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <article>
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-lg bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium">
                {post.category}
              </span>
              <span className="text-sm text-[#71717A]">{calculateReadTime(post.content)}</span>
              <span className="text-sm text-[#71717A]">•</span>
              <span className="text-sm text-[#71717A]">
                {new Date(post.created_at).toLocaleDateString("zh-TW", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-[#09090B] tracking-tight leading-tight mb-6">
              {post.title}
            </h1>
            
            <p className="text-xl text-[#3F3F46] leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Spotify Player */}
          {post.spotify_track_id && (
            <div className="mb-10">
              <SpotifyEmbed trackId={post.spotify_track_id} />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg prose-slate max-w-none 
            prose-headings:font-black prose-headings:text-[#09090B] prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-[#3F3F46] prose-p:leading-relaxed
            prose-a:text-[#2563EB] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[#09090B] prose-strong:font-semibold
            prose-ul:text-[#3F3F46] prose-ol:text-[#3F3F46]
            prose-li:marker:text-[#2563EB]
            prose-code:text-[#09090B] prose-code:bg-[#F4F4F5] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-[#18181B] prose-pre:text-white prose-pre:rounded-xl
            prose-blockquote:border-l-[#2563EB] prose-blockquote:bg-[#F4F4F5] prose-blockquote:py-1 prose-blockquote:rounded-r-xl
            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Share and Comments Section */}
          <ShareAndComments postId={post.id} postTitle={post.title} />
        </article>

        {/* Footer */}
        <footer className="mt-20 border-t border-[#18181B]/10 py-8 text-center text-sm text-[#71717A]">
          <p>© 2026 CdyTim. All rights reserved. Built with Next.js and Tailwind CSS.</p>
        </footer>
      </div>
    </main>
  );
}
