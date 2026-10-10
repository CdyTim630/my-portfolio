"use client";
import { type ReactNode, useEffect, useState } from "react";
import Icon from "@/components/portfolio/Icon";
import localFont from "next/font/local";
import "@/components/portfolio/portfolio.css";
import "@/components/portfolio/projects.css";
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
type Theme = "light" | "dark" | "color";
export default function HomeThemeSwitcher({
  children,
  locale = "en",
}: {
  children: ReactNode;
  locale?: PortfolioLocale;
}) {
  const zh = locale === "zh-TW";
  const [mode, setMode] = useState<Theme>("light");
  useEffect(() => {
    const previousColorScheme = document.documentElement.style.colorScheme;
    const frame = requestAnimationFrame(() => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("home-theme-mode");
      } catch {
        /* Storage can be disabled. */
      }
      const next =
        saved === "dark" || saved === "color" || saved === "light"
          ? saved
          : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
      setMode(next);
      document.documentElement.style.colorScheme =
        next === "dark" ? "dark" : "light";
    });
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.style.colorScheme = previousColorScheme;
    };
  }, []);
  function changeTheme(next: Theme) {
    setMode(next);
    document.documentElement.style.colorScheme =
      next === "dark" ? "dark" : "light";
    try {
      localStorage.setItem("home-theme-mode", next);
    } catch {
      /* Theme works without persistence. */
    }
  }
  return (
    <div
      className={`home-theme portfolio-theme ${portfolioHeading.variable} ${portfolioBody.variable}`}
      data-mode={mode}
      lang={locale}
    >
      {children}
      <div className="theme-control">
        <Icon name="sun" />
        <select
          aria-label={zh ? "色彩主題" : "Color theme"}
          value={mode}
          onChange={(event) => changeTheme(event.target.value as Theme)}
        >
          <option value="light">{zh ? "淺色" : "Light"}</option>
          <option value="dark">{zh ? "深色" : "Dark"}</option>
          <option value="color">{zh ? "繽紛" : "Color"}</option>
        </select>
      </div>
    </div>
  );
}
