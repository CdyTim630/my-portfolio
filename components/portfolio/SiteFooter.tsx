import Link from "next/link";
import { portfolioHref, type PortfolioLocale } from "@/lib/portfolio-locale";
export default function SiteFooter({
  locale = "en",
  compact = false,
}: {
  locale?: PortfolioLocale;
  compact?: boolean;
}) {
  const zh = locale === "zh-TW";
  return (
    <footer className="site-footer">
      <p>
        © {new Date().getFullYear()} Ding-Yuan Chen
      </p>
      <div>
        {!compact && (
          <a href="https://github.com/CdyTim630" target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
        <Link href="/blog">{zh ? "文章" : "Writing"}</Link>
        {!compact && (
          <Link href={portfolioHref("/portfolio#contact", locale)}>
            {zh ? "聯絡" : "Contact"}
          </Link>
        )}
        <Link href="/">{zh ? "個人網站" : "Personal website"}</Link>
      </div>
    </footer>
  );
}
