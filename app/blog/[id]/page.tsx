import PersonalNavbar from "@/components/personal/PersonalNavbar";
import Link from "next/link";
import { notFound } from "next/navigation";
import SpotifyEmbed from "@/components/SpotifyEmbed";
import ShareAndComments from "@/components/ShareAndComments";
import { getPublishedPost } from "@/lib/public-content";
import { calculateReadTime } from "@/lib/reading-time";
import type { Metadata } from "next";
import { getResumeUrl } from "@/lib/site-settings";
import Reveal from "@/components/Reveal";

export const revalidate = 300;
import MarkdownContent from "@/components/MarkdownContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { post } = await getPublishedPost(id);
  if (!post)
    return {
      title: "Article unavailable",
      robots: { index: false, follow: true },
    };
  return {
    title: post.title,
    description: post.excerpt || post.content.slice(0, 160),
    alternates: { canonical: `/blog/${post.id}` },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ post, available }, resumeUrl] = await Promise.all([
    getPublishedPost(id),
    getResumeUrl(),
  ]);
  if (!available)
    return (
      <main id="main-content" className="min-h-screen text-[var(--home-text)]">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <PersonalNavbar resumeUrl={resumeUrl} />
          <section className="py-20" role="status">
            <h1 className="text-3xl font-bold text-[var(--home-text-strong)]">
              Article temporarily unavailable
            </h1>
            <p className="mt-4">
              The archive could not be reached. Please try again later.
            </p>
            <Link
              href="/blog"
              className="mt-6 inline-block text-[var(--home-primary)]"
            >
              Back to Blog
            </Link>
          </section>
        </div>
      </main>
    );

  if (!post) {
    notFound();
  }

  return (
    <main
      id="main-content"
      className="min-h-screen bg-transparent text-[var(--home-text)]"
    >
      <div className="mx-auto max-w-4xl px-6 py-10">
        <PersonalNavbar resumeUrl={resumeUrl} />

        {/* Back Navigation */}
        <div className="mt-12 mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[var(--home-text)] hover:text-[var(--home-text-strong)] transition-colors duration-200 group"
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <article>
          <Reveal variant="up">
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className="px-3 py-1 rounded-lg bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium">
                  {post.category}
                </span>
                <span className="text-sm text-[var(--home-muted)]">
                  {calculateReadTime(post.content)}
                </span>
                <span className="text-sm text-[var(--home-muted)]">•</span>
                <span className="text-sm text-[var(--home-muted)]">
                  {new Date(post.created_at).toLocaleDateString("zh-TW", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "Asia/Taipei",
                  })}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-[var(--home-text-strong)] tracking-tight leading-tight mb-6">
                {post.title}
              </h1>

              <p className="text-xl text-[var(--home-text)] leading-relaxed">
                {post.excerpt}
              </p>
            </header>
          </Reveal>

          {/* Spotify Player */}
          {post.spotify_track_id && (
            <div className="mb-10">
              <SpotifyEmbed trackId={post.spotify_track_id} />
            </div>
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg prose-slate max-w-none
            prose-headings:font-black prose-headings:text-[var(--home-text-strong)] prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-[var(--home-text)] prose-p:leading-relaxed
            prose-a:text-[#2563EB] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[var(--home-text-strong)] prose-strong:font-semibold
            prose-ul:text-[var(--home-text)] prose-ol:text-[var(--home-text)]
            prose-li:marker:text-[#2563EB]
            prose-code:text-[var(--home-text-strong)] prose-code:bg-[var(--home-surface-muted)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-[#18181B] prose-pre:text-white prose-pre:rounded-xl
            prose-blockquote:border-l-[#2563EB] prose-blockquote:bg-[var(--home-surface-muted)] prose-blockquote:py-1 prose-blockquote:rounded-r-xl
            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
          "
          >
            <MarkdownContent>{post.content}</MarkdownContent>
          </div>

          {/* Share and Comments Section */}
          <ShareAndComments postId={post.id} postTitle={post.title} />
        </article>

        {/* Footer */}
        <footer className="mt-20 border-t border-[var(--home-border)] py-8 text-center text-sm text-[var(--home-muted)]">
          <p>
            © 2026 CdyTim. All rights reserved. Built with Next.js and Tailwind
            CSS.
          </p>
        </footer>
      </div>
    </main>
  );
}
