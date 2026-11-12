"use client";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import localFont from "next/font/local";
import ScrollProgress from "@/components/ScrollProgress";
import "@/components/portfolio/portfolio.css";
import "@/components/portfolio/projects.css";
import "@/components/portfolio/harmony.css";
const portfolioHeading = localFont({
  src: [
    {
      path: "../public/fonts/portfolio/archivo-bold-latin.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/portfolio/archivo-black-latin.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-portfolio-heading",
  display: "swap",
  preload: false,
});
const portfolioBody = localFont({
  src: "../public/fonts/portfolio/space-grotesk-variable-latin.woff2",
  weight: "300 700",
  style: "normal",
  variable: "--font-portfolio-body",
  display: "swap",
});
import type { PortfolioLocale } from "@/lib/portfolio-locale";

type Theme = "light" | "color" | "dark";
const modes: { id: Theme; en: string; zh: string }[] = [
  { id: "light", en: "Light", zh: "淺色" },
  { id: "color", en: "Color", zh: "繽紛" },
  { id: "dark", en: "Dark", zh: "深色" },
];

export default function HomeThemeSwitcher({
  children,
  locale = "en",
}: {
  children: ReactNode;
  locale?: PortfolioLocale;
}) {
  const zh = locale === "zh-TW";
  const [mode, setMode] = useState<Theme>("light");
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousColorScheme = document.documentElement.style.colorScheme;
    const frame = requestAnimationFrame(() => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("home-theme-mode");
      } catch {
        /* Storage can be disabled. */
      }
      const next: Theme =
        saved === "dark" || saved === "color" || saved === "light"
          ? saved
          : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
      setMode(next);
    });
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.style.colorScheme = previousColorScheme;
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.colorScheme =
      mode === "dark" ? "dark" : "light";
  }, [mode]);

  useEffect(() => {
    if (!open) return;
    panelRef.current
      ?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')
      ?.focus();
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function changeTheme(next: Theme) {
    setMode(next);
    setOpen(false);
    try {
      localStorage.setItem("home-theme-mode", next);
    } catch {
      /* Theme works without persistence. */
    }
    toggleRef.current?.focus();
  }

  return (
    <div
      className={`home-theme portfolio-theme site-harmony ${portfolioHeading.variable} ${portfolioBody.variable}`}
      data-mode={mode}
      lang={locale}
    >
      <div aria-hidden="true" className="portfolio-ambient" />
      <ScrollProgress />
      {children}
      <div
        ref={wrapperRef}
        className="harmony-theme-control"
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            setOpen(false);
            toggleRef.current?.focus();
          }
        }}
      >
        {open && (
          <div
            ref={panelRef}
            id={panelId}
            role="group"
            aria-label={zh ? "色彩主題" : "Color theme"}
            className="harmony-theme-panel"
          >
            {modes.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={mode === item.id}
                onClick={() => changeTheme(item.id)}
              >
                {zh ? item.zh : item.en}
              </button>
            ))}
          </div>
        )}
        <button
          ref={toggleRef}
          type="button"
          className="harmony-theme-toggle"
          aria-label={
            zh
              ? open
                ? "關閉色彩主題選單"
                : "開啟色彩主題選單"
              : open
                ? "Close color theme selector"
                : "Open color theme selector"
          }
          aria-controls={panelId}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2m0 14v2M5.64 5.64l1.42 1.42m9.88 9.88l1.42 1.42M3 12h2m14 0h2M5.64 18.36l1.42-1.42m9.88-9.88l1.42-1.42M12 7a5 5 0 100 10 5 5 0 000-10z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
