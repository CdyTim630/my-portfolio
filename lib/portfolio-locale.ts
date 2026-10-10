export type PortfolioLocale = "en" | "zh-TW";

export function parsePortfolioLocale(value: unknown): PortfolioLocale | null {
  return value === "en" || value === "zh-TW" ? value : null;
}

/** Only showcase routes carry a language preference. Personal pages stay unchanged. */
export function portfolioHref(path: string, locale: PortfolioLocale): string {
  if (!/^\/(portfolio|projects)(?:[/?#]|$)/.test(path)) return path;
  const url = new URL(path, "https://portfolio.invalid");
  url.searchParams.set("lang", locale);
  return `${url.pathname}${url.search}${url.hash}`;
}

export function categoryLabel(
  category: string,
  locale: PortfolioLocale,
): string {
  if (locale === "en") return category;
  return (
    (
      {
        All: "全部",
        Backend: "後端開發",
        Data: "資料工程",
        AI: "AI 應用",
        "Full-stack": "全端開發",
        Frontend: "前端開發",
      } as Record<string, string>
    )[category] || category
  );
}
