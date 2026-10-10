import PersonalNavbar from "@/components/personal/PersonalNavbar";
import BlogList from "@/components/BlogList";
import Link from "next/link";
import { getPublicContent } from "@/lib/public-content";
import type { Metadata } from "next";
import { getResumeUrl } from "@/lib/site-settings";
import Reveal from "@/components/Reveal";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on software, learning, and life at National Taiwan University.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const [{ posts, categories: categoryList, available }, resumeUrl] =
    await Promise.all([getPublicContent(), getResumeUrl()]);

  return (
    <main
      id="main-content"
      className="min-h-screen bg-transparent text-[var(--home-text)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-10">
        <PersonalNavbar resumeUrl={resumeUrl} />

        {/* Header */}
        <section className="mt-16 mb-12">
          <Reveal variant="up">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[var(--home-text)] hover:text-[var(--home-text-strong)] transition-colors duration-200 mb-8 group"
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
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
              Back to Home
            </Link>
          </Reveal>
          <Reveal variant="up" delay={60}>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">
              <span className="animate-gradient-text">Blog</span>
            </h1>
          </Reveal>
          <Reveal variant="up" delay={120}>
            <p className="mt-4 text-lg text-[var(--home-text)] max-w-2xl">
              記錄生活、課業、心得等等。共{" "}
              <span className="font-semibold text-[var(--home-text-strong)]">
                {posts.length}
              </span>{" "}
              篇文章。
            </p>
          </Reveal>
        </section>

        {/* Blog List with Filtering */}
        {!available && posts.length === 0 ? (
          <div
            role="status"
            className="rounded-2xl border border-[var(--home-border)] bg-[var(--home-surface)] p-8"
          >
            <h2 className="text-xl font-semibold">
              Writing is temporarily unavailable
            </h2>
            <p className="mt-3">
              The article archive could not be loaded. You can still explore the
              project case studies.
            </p>
            <Link
              href="/portfolio"
              className="mt-4 inline-block text-[var(--home-primary)]"
            >
              View portfolio →
            </Link>
          </div>
        ) : (
          <BlogList posts={posts} categories={categoryList} />
        )}

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
