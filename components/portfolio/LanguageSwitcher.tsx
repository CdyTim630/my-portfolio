"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { portfolioHref, type PortfolioLocale } from "@/lib/portfolio-locale";
import "./language-switch.css";

export default function LanguageSwitcher({
  locale,
}: {
  locale: PortfolioLocale;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const language = locale === "en" ? "zh-TW" : "en";
  const label = language === "en" ? "Switch to English" : "切換至繁體中文";

  return (
    <nav
      className="language-switch"
      data-language={locale}
      aria-label={locale === "zh-TW" ? "作品集語言" : "Portfolio language"}
    >
      <Link
        className="language-switch-control"
        href={portfolioHref(pathname, language)}
        hrefLang={language}
        lang={language}
        aria-label={label}
        title={label}
        prefetch={false}
        scroll={false}
        onClick={(event) => {
          document.cookie = `portfolio-locale=${language}; Path=/; Max-Age=31536000; SameSite=Lax`;
          // Read browser-only URL details on interaction, keeping server rendering stable.
          const href = portfolioHref(
            `${pathname}${window.location.search}${window.location.hash}`,
            language,
          );
          event.currentTarget.href = href;
          if (
            event.defaultPrevented ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          ) {
            return;
          }
          event.preventDefault();
          router.push(href, { scroll: false });
        }}
      >
        <span className="language-switch-glyph" aria-hidden="true">
          <span>文</span>
          <span>A</span>
        </span>
      </Link>
    </nav>
  );
}
