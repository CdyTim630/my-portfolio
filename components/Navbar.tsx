'use client';

import Link from "next/link";
import { useState } from "react";

const items = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FAFAFA]/80 backdrop-blur-md py-4 -mt-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-[#18181B] text-white grid place-items-center font-bold group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            Tim
          </div>
          <div className="text-xl font-semibold tracking-tight group-hover:text-[#2563EB] transition-colors duration-200">CdyTim</div>
        </Link>

        {/* Desktop Navigation - 靠右對齊 */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8 text-sm text-[#3F3F46] font-medium">
            {items.map((it) => (
              <Link 
                key={it.label} 
                href={it.href} 
                className="relative hover:text-[#09090B] transition-colors duration-200 cursor-pointer after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#2563EB] after:transition-all after:duration-300 hover:after:w-full"
              >
                {it.label}
              </Link>
            ))}
          </nav>

          <Link
            href="https://drive.google.com/file/d/1ydMe7BYLDkXabV9UNFn5D9Nby9zaH6HA/view"
            target="_blank"
            className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            Download CV
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-[#18181B]/10 transition-colors"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-4 pb-4 space-y-3 border-t border-[#18181B]/10 pt-4 animate-fade-in">
          {items.map((it) => (
            <Link
              key={it.label}
              href={it.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg text-[#3F3F46] hover:bg-[#18181B]/5 hover:text-[#09090B] transition-all duration-200 cursor-pointer"
            >
              {it.label}
            </Link>
          ))}
          <Link
            href="https://drive.google.com/file/d/1ydMe7BYLDkXabV9UNFn5D9Nby9zaH6HA/view"
            target="_blank"
            onClick={() => setMobileMenuOpen(false)}
            className="block mx-4 mt-2 text-center rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8] transition-all duration-200 cursor-pointer"
          >
            Download CV
          </Link>
        </nav>
      )}
    </header>
  );
}
