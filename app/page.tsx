import Navbar from "@/components/Navbar";
import Link from "next/link";
import { experiences } from "@/lib/experience-data";
import { createClient } from "@/lib/supabase/server";

// 計算閱讀時間（支援中文和圖片）
function calculateReadTime(content: string): string {
  // 中文閱讀速度約 400-600 字/分鐘，取中間值 500
  const chineseCharsPerMinute = 500;
  // 英文閱讀速度約 200 字/分鐘
  const englishWordsPerMinute = 200;
  // 每張圖片增加 10 秒閱讀時間
  const secondsPerImage = 10;

  // 計算中文字數（匹配中文字符）
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
  
  // 計算英文單字數（移除中文後計算）
  const textWithoutChinese = content.replace(/[\u4e00-\u9fa5]/g, ' ');
  const englishWords = textWithoutChinese.split(/\s+/).filter(word => word.length > 0).length;
  
  // 計算圖片數量（markdown 圖片語法）
  const imageCount = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
  
  // 計算總時間（分鐘）
  const chineseMinutes = chineseChars / chineseCharsPerMinute;
  const englishMinutes = englishWords / englishWordsPerMinute;
  const imageMinutes = (imageCount * secondsPerImage) / 60;
  
  const totalMinutes = Math.ceil(chineseMinutes + englishMinutes + imageMinutes);
  const minutes = Math.max(1, totalMinutes); // 至少 1 分鐘
  
  return `${minutes} min read`;
}

export default async function Home() {
  const supabase = await createClient();
  
  // 從 Supabase 取得最新 3 篇已發布文章
  const { data: latestPosts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Navbar />

        {/* Hero Section */}
        <section className="mt-20 grid items-center gap-16 md:grid-cols-2">
          {/* Left */}
          <div>
            <p className="text-[#3F3F46] font-medium tracking-wide uppercase text-sm animate-fade-in">Hello, I&apos;m</p>
            <h1 className="mt-4 text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] text-[#09090B] tracking-tight">
              Ding-Yuan<br/>Chen
            </h1>
            <p className="mt-8 max-w-xl text-[#3F3F46] leading-relaxed text-lg">
              Student majoring in{" "}
              <span className="font-semibold text-[#09090B]">Information Management</span> at{" "}
              <span className="font-semibold text-[#09090B]">National Taiwan University</span>.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://drive.google.com/file/d/1ydMe7BYLDkXabV9UNFn5D9Nby9zaH6HA/view"
                download
                className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group"
              >
                <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download CV
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#18181B] px-6 py-3.5 text-sm font-semibold text-[#18181B] hover:bg-[#18181B] hover:text-white hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                Say Hello!
              </a>
            </div>

            {/* Social Links */}
            <div className="mt-10 flex items-center gap-4">
              <span className="text-sm font-medium text-[#3F3F46]">Connect with me:</span>
              <div className="flex gap-3">
                <a
                  href="https://github.com/CdyTim630"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 rounded-xl bg-white border border-[#18181B]/10 text-[#3F3F46] hover:border-[#09090B] hover:bg-[#09090B] hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="mailto:b13705020@ntu.edu.tw"
                  className="group p-3 rounded-xl bg-white border border-[#18181B]/10 text-[#3F3F46] hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  aria-label="Email"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/cdytim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 rounded-xl bg-white border border-[#18181B]/10 text-[#3F3F46] hover:border-[#0077B5] hover:bg-[#0077B5] hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://instagram.com/cdy.tim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 rounded-xl bg-white border border-[#18181B]/10 text-[#3F3F46] hover:border-[#E4405F] hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Right */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-[340px] sm:w-[420px] aspect-[4/5] rounded-3xl bg-gradient-to-br from-[#18181B] to-[#3F3F46] shadow-2xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              {/* 之後換成自己的照片 */}
                <img
                  src="/Personal_photo.jpg"
                  alt="Ding-Yuan Chen"
                  className="w-full h-full object-cover"
                />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="mt-32 scroll-mt-24">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-black text-[#09090B]">About Me</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#18181B]/20 to-transparent"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-[#3F3F46] leading-relaxed text-lg">
              <p>
                I&apos;m a B.B.A. student in Information Management at National Taiwan University, passionate about full-stack web development and coding.
              </p>
              <p>
                Currently, I am a teaching assistant for Calculus in the Department of Information Management at National Taiwan University. Meanwhile, I&apos;m enhancing my skills in React and Next.js through hands-on projects and internships. I enjoy collaborating with others to create user-friendly web applications.
              </p>
            </div>
            <div className="flex flex-col gap-3 justify-center">
              {["Web Development", "System Administration", "Coding"].map((skill) => (
                <div 
                  key={skill}
                  className="px-6 py-5 rounded-xl bg-white border border-[#18181B]/10 text-center font-semibold text-[#09090B] hover:border-[#2563EB] hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-default"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="mt-32 scroll-mt-24">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-black text-[#09090B]">Experience</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#18181B]/20 to-transparent"></div>
          </div>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div 
                key={exp.id}
                className="group p-6 rounded-2xl bg-white border border-[#18181B]/10 hover:border-[#2563EB]/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 cursor-default"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#09090B] group-hover:text-[#2563EB] transition-colors duration-200">
                      {exp.title}
                    </h3>
                    <p className="text-[#3F3F46] font-medium">{exp.company}</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F4F4F5] text-sm font-medium text-[#3F3F46] w-fit">
                    {exp.period}
                  </span>
                </div>
                <p className="text-[#3F3F46] leading-relaxed mb-4">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-3 py-1 rounded-lg bg-[#2563EB]/10 text-[#2563EB] text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Articles Section */}
        <section id="blog" className="mt-32 scroll-mt-24">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-black text-[#09090B]">Latest Articles</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[#18181B]/20 to-transparent hidden md:block w-32"></div>
            </div>
            <Link 
              href="/blog" 
              className="text-[#2563EB] font-semibold hover:underline flex items-center gap-1 group"
            >
              View All 
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {latestPosts && latestPosts.length > 0 ? latestPosts.map((post) => (
              <Link 
                key={post.id}
                href={`/blog/${post.id}`}
                className="group p-6 rounded-2xl bg-white border border-[#18181B]/10 hover:border-[#2563EB]/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 rounded-md bg-[#F4F4F5] text-xs font-medium text-[#3F3F46]">
                    {post.category}
                  </span>
                  <span className="text-xs text-[#71717A]">{calculateReadTime(post.content)}</span>
                </div>
                <h3 className="text-lg font-bold text-[#09090B] group-hover:text-[#2563EB] transition-colors duration-200 line-clamp-2 mb-3">
                  {post.title}
                </h3>
                <p className="text-sm text-[#71717A] line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#A1A1AA]">
                    {new Date(post.created_at).toLocaleDateString("zh-TW", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-[#2563EB] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Read more →
                  </span>
                </div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-8 text-[#71717A]">
                還沒有文章，敬請期待！
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mt-32 mb-20 scroll-mt-24">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-[#18181B] to-[#3F3F46] text-white text-center">
            <h2 className="text-4xl font-black mb-4">Let&apos;s Work Together</h2>
            <p className="text-white/70 max-w-lg mx-auto mb-8">
              Have a project in mind? Let&apos;s create something amazing together. 
              I&apos;m always open to discussing new opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="mailto:b13705020@ntu.edu.tw"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#18181B] font-semibold hover:bg-[#F4F4F5] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Get in Touch
              </a>
              <a 
                href="https://drive.google.com/file/d/1ydMe7BYLDkXabV9UNFn5D9Nby9zaH6HA/view"
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white text-white font-semibold hover:bg-white hover:text-[#18181B] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download CV
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#18181B]/10 py-8 text-center text-sm text-[#71717A]">
          <p>© 2026 CdyTim. All rights reserved. Built with Next.js and Supabase.</p>
        </footer>
      </div>
    </main>
  );
}
