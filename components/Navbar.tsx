"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import LanguageSwitcher from "@/components/portfolio/LanguageSwitcher";
import { portfolioHref, type PortfolioLocale } from "@/lib/portfolio-locale";
import Icon from "@/components/portfolio/Icon";
const navigation = [
  { label: "Projects", zh: "作品", href: "/projects" },
  { label: "About", zh: "關於", href: "/portfolio#about" },
  { label: "Writing", zh: "文章", href: "/blog" },
  { label: "Contact", zh: "聯絡", href: "/portfolio#contact" },
  { label: "Personal website", zh: "個人網站", href: "/" },
];
const fallbackResume =
  "https://drive.google.com/file/d/1ydMe7BYLDkXabV9UNFn5D9Nby9zaH6HA/view";
export default function Navbar({
  resumeUrl = fallbackResume,
  locale = "en",
}: {
  resumeUrl?: string;
  locale?: PortfolioLocale;
}) {
  const zh = locale === "zh-TW";
  const items = navigation.map((item) => ({
    ...item,
    label: zh ? item.zh : item.label,
  }));
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <Link
        href={portfolioHref("/portfolio", locale)}
        className="wordmark"
        title={zh ? "作品集首頁" : "Portfolio home"}
      >
        <span className="wordmark-icon">
          Tim<span>.</span>
        </span>
        <span className="wordmark-name">Ding-Yuan Chen</span>
      </Link>
      <nav
        className="desktop-nav"
        aria-label={zh ? "主要導覽" : "Main navigation"}
      >
        {items.map((item) => (
          <Link
            key={item.label}
            href={portfolioHref(item.href, locale)}
            aria-current={
              (item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)) && !item.href.includes("#")
                ? "page"
                : undefined
            }
          >
            {item.label}
          </Link>
        ))}
        <a
          className="nav-resume"
          href={resumeUrl}
          target="_blank"
          rel="noreferrer"
        >
          {zh ? "履歷" : "Resume"} <Icon name="external" />
        </a>
      </nav>
      <LanguageSwitcher locale={locale} />
      <button
        ref={toggle}
        type="button"
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label={
          zh
            ? open
              ? "關閉選單"
              : "開啟選單"
            : open
              ? "Close menu"
              : "Open menu"
        }
        aria-expanded={open}
        aria-controls="mobile-navigation"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d={open ? "M6 6l12 12M6 18 18 6" : "M4 7h16M4 12h16M4 17h16"} />
        </svg>
      </button>
      {open && (
        <nav
          className="mobile-nav"
          id="mobile-navigation"
          aria-label={zh ? "行動版導覽" : "Mobile navigation"}
        >
          {items.map((item) => (
            <Link
              key={item.label}
              href={portfolioHref(item.href, locale)}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            {zh ? "履歷" : "Resume"} <Icon name="external" />
          </a>
        </nav>
      )}
    </header>
  );
}
