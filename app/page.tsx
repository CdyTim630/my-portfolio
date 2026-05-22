import Navbar from "@/components/Navbar";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HomeThemeSwitcher from "@/components/HomeThemeSwitcher";
import { getResumeUrl } from "@/lib/site-settings";
import Reveal from "@/components/Reveal";
import TypingHeadline from "@/components/TypingHeadline";

function calculateReadTime(content: string): string {
  const chineseCharsPerMinute = 500;
  const englishWordsPerMinute = 200;
  const secondsPerImage = 10;
  const chineseChars = (content.match(/[一-龥]/g) || []).length;
  const textWithoutChinese = content.replace(/[一-龥]/g, " ");
  const englishWords = textWithoutChinese.split(/\s+/).filter((w) => w.length > 0).length;
  const imageCount = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
  const totalMinutes = Math.ceil(
    chineseChars / chineseCharsPerMinute +
      englishWords / englishWordsPerMinute +
      (imageCount * secondsPerImage) / 60
  );
  return `${Math.max(1, totalMinutes)} min read`;
}

const roles = [
  "Full-stack Developer",
  "Information Management Student",
  "Web Tinkerer",
  "Coffee + Code",
];

export default async function Home() {
  const supabase = await createClient();
  const resumeUrl = await getResumeUrl();

  const { data: latestPosts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <HomeThemeSwitcher>
      <main className="relative min-h-screen bg-transparent text-[var(--home-text)] transition-colors duration-500">
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
          <Navbar resumeUrl={resumeUrl} />

          {/* Hero Section */}
          <section className="mt-16 md:mt-20 grid items-center gap-12 md:gap-16 md:grid-cols-2">
            <div>
              <Reveal variant="up" delay={0}>
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--home-border)] bg-[var(--home-surface)] backdrop-blur-sm px-3 py-1 text-xs font-semibold tracking-wide text-[var(--home-text)] shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--home-primary)] opacity-60 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--home-primary)]" />
                  </span>
                  Hello, I&apos;m
                </div>
              </Reveal>

              <Reveal variant="up" delay={60}>
                <h1 className="mt-5 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tight">
                  <span className="text-[var(--home-text-strong)]">Ding-Yuan</span>
                  <br />
                  <span className="animate-gradient-text">Chen</span>
                </h1>
              </Reveal>

              <Reveal variant="up" delay={140}>
                <p className="mt-6 max-w-xl text-[var(--home-text)] leading-relaxed text-lg">
                  <span className="font-semibold text-[var(--home-text-strong)]">
                    <TypingHeadline words={roles} />
                  </span>
                  <br />
                  Student majoring in{" "}
                  <span className="font-semibold text-[var(--home-text-strong)]">
                    Information Management
                  </span>{" "}
                  at{" "}
                  <span className="font-semibold text-[var(--home-text-strong)]">
                    National Taiwan University
                  </span>
                  .
                </p>
              </Reveal>

              <Reveal variant="up" delay={200}>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a
                    href={resumeUrl}
                    download
                    className="group inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 group-hover:translate-y-0.5 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download CV
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--home-text-strong)] px-6 py-3.5 text-sm font-semibold text-[var(--home-text-strong)] hover:bg-[var(--home-text-strong)] hover:text-[var(--home-bg)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                  >
                    Say Hello!
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </Reveal>

              <Reveal variant="up" delay={260}>
                <div className="mt-10 flex items-center gap-4 flex-wrap">
                  <span className="text-sm font-medium text-[var(--home-text)]">Connect:</span>
                  <div className="flex gap-3">
                    <SocialIcon href="https://github.com/CdyTim630" label="GitHub" colorClass="hover:bg-[var(--home-text-strong)] hover:text-[var(--home-bg)] hover:border-[var(--home-text-strong)]">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </SocialIcon>
                    <SocialIcon href="mailto:b13705020@ntu.edu.tw" label="Email" colorClass="hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB]" stroke>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </SocialIcon>
                    <SocialIcon href="https://www.linkedin.com/in/cdytim" label="LinkedIn" colorClass="hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5]">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </SocialIcon>
                    <SocialIcon href="https://instagram.com/cdy.tim" label="Instagram" colorClass="hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white hover:border-[#E4405F]">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </SocialIcon>
                  </div>
                </div>
              </Reveal>

            </div>

            <div className="flex justify-center md:justify-end">
              <div className="relative w-[300px] sm:w-[380px] md:w-[420px] aspect-[4/5] rounded-3xl bg-gradient-to-br from-[var(--home-photo-from)] to-[var(--home-photo-to)] shadow-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Personal_photo.jpg"
                  alt="Ding-Yuan Chen"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* Scroll hint */}
          <div className="hidden md:flex justify-center mt-16">
            <a href="#about" className="group inline-flex flex-col items-center gap-1.5 text-xs font-medium tracking-widest text-[var(--home-muted)] hover:text-[var(--home-text-strong)] transition-colors">
              SCROLL
              <span className="relative block w-[18px] h-[28px] rounded-full border border-[var(--home-divider)] overflow-hidden">
                <span className="absolute left-1/2 -translate-x-1/2 top-1.5 w-[2px] h-1.5 rounded-full bg-[var(--home-text-strong)] animate-float" />
              </span>
            </a>
          </div>

          {/* About Section */}
          <section id="about" className="mt-28 md:mt-32 scroll-mt-24">
            <Reveal variant="up">
              <div className="flex items-center gap-4 mb-10">
                <h2 className="heading-underline is-visible text-4xl font-black text-[var(--home-text-strong)]">
                  About Me
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[var(--home-divider)] to-transparent" />
              </div>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-10 md:gap-12">
              <Reveal variant="left" delay={80}>
                <div className="space-y-6 text-[var(--home-text)] leading-relaxed text-lg">
                  <p>
                    I&apos;m a B.B.A. student in Information Management at National Taiwan University, passionate about full-stack web development and coding.
                  </p>
                  <p>
                    Currently TA for Calculus in the Department of Information Management. Meanwhile sharpening React + Next.js through hands-on projects and internships. Always up for building user-friendly applications together.
                  </p>
                </div>
              </Reveal>
              <Reveal variant="right" delay={120}>
                <div className="flex flex-col gap-3 justify-center">
                  {[
                    { skill: "Web Development", icon: "</>" },
                    { skill: "System Administration", icon: "⚙" },
                    { skill: "Coding", icon: "{ }" },
                  ].map((s, i) => (
                    <div
                      key={s.skill}
                      className="lift-card group relative overflow-hidden px-6 py-5 rounded-xl bg-[var(--home-surface)] border border-[var(--home-border)] backdrop-blur-sm text-[var(--home-text-strong)] font-semibold flex items-center gap-3 cursor-default"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--home-surface-muted)] text-[var(--home-primary)] font-mono text-sm">
                        {s.icon}
                      </span>
                      <span>{s.skill}</span>
                      <span aria-hidden className="absolute inset-y-0 -right-full w-1/2 bg-gradient-to-r from-transparent to-[var(--home-primary)]/10 group-hover:right-0 transition-all duration-500" />
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="mt-28 md:mt-32 scroll-mt-24">
            <Reveal variant="up">
              <div className="flex items-center gap-4 mb-10">
                <h2 className="heading-underline is-visible text-4xl font-black text-[var(--home-text-strong)]">
                  Experience
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[var(--home-divider)] to-transparent" />
              </div>
            </Reveal>

            <div className="relative">
              {/* timeline rail */}
              <div aria-hidden className="hidden md:block absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--home-primary)]/50 via-[var(--home-border)] to-transparent" />
              <div className="space-y-5">
                {(experiences || []).map((exp, idx) => (
                  <Reveal key={exp.id} variant="up" delay={Math.min(idx * 60, 360)}>
                    <div className="md:pl-10 relative">
                      <span
                        aria-hidden
                        className="hidden md:block absolute left-0 top-7 h-4 w-4 rounded-full border-2 border-[var(--home-primary)] bg-[var(--home-bg)] shadow-[0_0_0_4px_var(--home-bg)] group-hover:scale-110 transition-transform"
                      />
                      <div className="group p-6 rounded-2xl bg-[var(--home-surface)] border border-[var(--home-border)] backdrop-blur-sm hover:border-[#2563EB]/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-[var(--home-text-strong)] group-hover:text-[#2563EB] transition-colors duration-200">
                              {exp.title}
                            </h3>
                            <p className="text-[var(--home-text)] font-medium">{exp.company}</p>
                          </div>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--home-surface-muted)] text-sm font-medium text-[var(--home-text)] w-fit">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-[var(--home-text)] leading-relaxed mb-4">{exp.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill: string) => (
                            <span
                              key={skill}
                              className="px-3 py-1 rounded-lg bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium transition-all duration-200 hover:bg-[#2563EB]/15 hover:-translate-y-0.5"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Latest Articles Section */}
          <section id="blog" className="mt-28 md:mt-32 scroll-mt-24">
            <Reveal variant="up">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <h2 className="heading-underline is-visible text-4xl font-black text-[var(--home-text-strong)]">
                    Latest Articles
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-[var(--home-divider)] to-transparent hidden md:block w-32" />
                </div>
                <Link
                  href="/blog"
                  className="text-[#2563EB] font-semibold hover:underline flex items-center gap-1 group"
                >
                  View All
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-6">
              {latestPosts && latestPosts.length > 0 ? (
                latestPosts.map((post, idx) => (
                  <Reveal key={post.id} variant="up" delay={idx * 80}>
                    <Link
                      href={`/blog/${post.id}`}
                      className="lift-card group flex flex-col h-full p-6 rounded-2xl bg-[var(--home-surface)] border border-[var(--home-border)] backdrop-blur-sm hover:border-[#2563EB]/55 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-2 py-1 rounded-md bg-[var(--home-surface-muted)] text-xs font-medium text-[var(--home-text)]">
                          {post.category}
                        </span>
                        <span className="text-xs text-[var(--home-muted)]">
                          {calculateReadTime(post.content)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[var(--home-text-strong)] group-hover:text-[#2563EB] transition-colors duration-200 line-clamp-2 mb-3">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[var(--home-muted)] line-clamp-2 mb-4 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--home-muted-soft)]">
                          {new Date(post.created_at).toLocaleDateString("zh-TW", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-[#2563EB] text-sm font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          Read more →
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-[var(--home-muted)]">
                  還沒有文章，敬請期待！
                </div>
              )}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="mt-28 md:mt-32 mb-20 scroll-mt-24">
            <Reveal variant="scale">
              <div className="relative overflow-hidden p-12 rounded-3xl bg-gradient-to-br from-[var(--home-contact-from)] to-[var(--home-contact-to)] text-[var(--home-contact-text)] text-center">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[var(--home-primary)]/30 blur-3xl"
                />
                <h2 className="relative text-4xl font-black mb-4">Let&apos;s Work Together</h2>
                <p className="relative max-w-lg mx-auto mb-8 text-[var(--home-contact-soft)]">
                  Have a project in mind? Let&apos;s create something amazing together. I&apos;m always open to discussing new opportunities.
                </p>
                <div className="relative flex flex-wrap justify-center gap-4">
                  <a
                    href="mailto:b13705020@ntu.edu.tw"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#0f172a] font-semibold hover:bg-[#E2E8F0] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Get in Touch
                  </a>
                  <a
                    href={resumeUrl}
                    download
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white text-white font-semibold hover:bg-white hover:text-[#0f172a] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download CV
                  </a>
                </div>
              </div>
            </Reveal>
          </section>

          <footer className="border-t border-[var(--home-border)] py-8 text-center text-sm text-[var(--home-muted)]">
            <p>© 2026 CdyTim. All rights reserved. Built with Next.js and Supabase.</p>
          </footer>
        </div>
      </main>
    </HomeThemeSwitcher>
  );
}

function SocialIcon({
  href,
  label,
  colorClass,
  stroke = false,
  children,
}: {
  href: string;
  label: string;
  colorClass: string;
  stroke?: boolean;
  children: React.ReactNode;
}) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`group p-3 rounded-xl bg-[var(--home-surface)] backdrop-blur-sm border border-[var(--home-border)] text-[var(--home-text)] hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer ${colorClass}`}
    >
      <svg
        className="w-5 h-5"
        fill={stroke ? "none" : "currentColor"}
        stroke={stroke ? "currentColor" : undefined}
        viewBox="0 0 24 24"
      >
        {children}
      </svg>
    </a>
  );
}

