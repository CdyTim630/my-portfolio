import { cookies } from "next/headers";
import { parsePortfolioLocale, type PortfolioLocale } from "./portfolio-locale";

export async function getPortfolioLocale(
  searchParams?: Promise<{ lang?: string | string[] }>,
): Promise<PortfolioLocale> {
  const explicit = parsePortfolioLocale((await searchParams)?.lang);
  if (explicit) return explicit;
  return (
    parsePortfolioLocale((await cookies()).get("portfolio-locale")?.value) ||
    "en"
  );
}
