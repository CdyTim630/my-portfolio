// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  categoryLabel,
  parsePortfolioLocale,
  portfolioHref,
} from "@/lib/portfolio-locale";
import { getPortfolioLocale } from "@/lib/portfolio-locale-server";

const { readCookie } = vi.hoisted(() => ({ readCookie: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: readCookie }) }));

beforeEach(() => {
  readCookie.mockReset();
});

describe("portfolio-only language selection", () => {
  it("accepts only the two supported language identifiers", () => {
    expect(parsePortfolioLocale("en")).toBe("en");
    expect(parsePortfolioLocale("zh-TW")).toBe("zh-TW");
    for (const value of ["zh", "zh-CN", "fr", ["en"], null, undefined])
      expect(parsePortfolioLocale(value)).toBeNull();
  });

  it("preserves queries and anchors while replacing the portfolio language", () => {
    expect(portfolioHref("/portfolio#contact", "zh-TW")).toBe(
      "/portfolio?lang=zh-TW#contact",
    );
    expect(
      portfolioHref("/projects/employa?lang=en&view=detail#my-role", "zh-TW"),
    ).toBe("/projects/employa?lang=zh-TW&view=detail#my-role");
  });

  it("does not attach a portfolio locale to the personal site, Blog or external links", () => {
    for (const path of [
      "/",
      "/#about",
      "/blog",
      "/blog/123",
      "/login",
      "/projects-other",
      "https://github.com/CdyTim630",
    ]) {
      expect(portfolioHref(path, "zh-TW")).toBe(path);
    }
    expect(categoryLabel("Backend", "zh-TW")).toBe("後端開發");
    expect(categoryLabel("Backend", "en")).toBe("Backend");
  });

  it("gives an explicit language precedence over a saved preference", async () => {
    readCookie.mockReturnValue({ value: "zh-TW" });
    expect(await getPortfolioLocale(Promise.resolve({ lang: "en" }))).toBe(
      "en",
    );
    expect(readCookie).not.toHaveBeenCalled();
  });

  it("uses a valid saved preference and defaults safely for an invalid value", async () => {
    readCookie.mockReturnValue({ value: "zh-TW" });
    expect(await getPortfolioLocale()).toBe("zh-TW");
    expect(
      await getPortfolioLocale(Promise.resolve({ lang: "unsupported" })),
    ).toBe("zh-TW");
    readCookie.mockReturnValue({ value: "unsupported" });
    expect(await getPortfolioLocale()).toBe("en");
  });
});
