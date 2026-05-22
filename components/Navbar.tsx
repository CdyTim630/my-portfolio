'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

const items = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

interface NavbarProps {
  resumeUrl?: string;
}

export default function Navbar({ resumeUrl }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const safeResumeUrl =
    resumeUrl || "https://drive.google.com/file/d/1ydMe7BYLDkXabV9UNFn5D9Nby9zaH6HA/view";

  useEffect(() => {
    let raf = 0;
    function check() {
      setScrolled(window.scrollY > 16);
    }
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    }
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 -mt-4 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--home-nav-bg)] backdrop-blur-xl py-3 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.18)]"
          : "bg-transparent backdrop-blur-md py-4"
      }`}
    >
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div
            className={`relative grid place-items-center rounded-full bg-[var(--home-text-strong)] text-[var(--home-bg)] font-bold transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${
              scrolled ? "h-9 w-9 text-sm" : "h-10 w-10"
            }`}
          >
            <span className="absolute inset-0 rounded-full animate-ring-pulse pointer-events-none" />
            Tim
          </div>
          <div
            className={`font-semibold tracking-tight text-[var(--home-text-strong)] transition-all duration-300 group-hover:text-[var(--home-primary)] ${
              scrolled ? "text-lg" : "text-xl"
            }`}
          >
            CdyTim
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8 text-sm text-[var(--home-text)] font-medium">
            {items.map((it) => (
              <Link
                key={it.label}
                href={it.href}
                className="relative hover:text-[var(--home-text-strong)] transition-colors duration-200 cursor-pointer after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[var(--home-primary)] after:transition-all after:duration-300 hover:after:w-full"
              >
                {it.label}
              </Link>
            ))}
          </nav>

          <Link
            href={safeResumeUrl}
            target="_blank"
            className="rounded-xl bg-[var(--home-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--home-primary-hover)] hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            Download CV
          </Link>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[var(--home-text)] hover:bg-[var(--home-surface-muted)] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden mt-4 pb-4 space-y-3 border border-[var(--home-border)] rounded-2xl bg-[var(--home-surface)]/95 backdrop-blur-xl pt-4 animate-fade-in">
          {items.map((it) => (
            <Link
              key={it.label}
              href={it.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg text-[var(--home-text)] hover:bg-[var(--home-surface-muted)] hover:text-[var(--home-text-strong)] transition-all duration-200 cursor-pointer"
            >
              {it.label}
            </Link>
          ))}
          <Link
            href={safeResumeUrl}
            target="_blank"
            onClick={() => setMobileMenuOpen(false)}
            className="block mx-4 mt-2 text-center rounded-xl bg-[var(--home-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--home-primary-hover)] transition-all duration-200 cursor-pointer"
          >
            Download CV
          </Link>
        </nav>
      )}
    </header>
  );
}
