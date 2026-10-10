import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import LanguageSwitcher from "@/components/portfolio/LanguageSwitcher";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  usePathname: () => "/projects/employa",
  useRouter: () => ({ push }),
}));

afterEach(() => {
  document.cookie = "portfolio-locale=; Path=/; Max-Age=0";
  document.cookie = "personal-preference=; Path=/; Max-Age=0";
  window.history.replaceState({}, "", "/");
});

describe("portfolio language switch", () => {
  it("exposes one direct link to the other language on the current project route", () => {
    render(<LanguageSwitcher locale="en" />);
    const navigation = screen.getByRole("navigation", {
      name: "Portfolio language",
    });
    const toggle = within(navigation).getByRole("link", {
      name: "切換至繁體中文",
    });

    expect(within(navigation).getAllByRole("link")).toHaveLength(1);
    expect(toggle).toHaveAttribute("href", "/projects/employa?lang=zh-TW");
    expect(toggle).toHaveAttribute("title", "切換至繁體中文");
    expect(toggle).toHaveAttribute("lang", "zh-TW");
    expect(toggle).toHaveAttribute("hreflang", "zh-TW");
    expect(toggle).toHaveTextContent("文A");
    expect(toggle).not.toHaveAttribute("aria-current");
  });

  it("is keyboard focusable and announces the new target after the language changes", () => {
    const { rerender } = render(<LanguageSwitcher locale="en" />);
    screen.getByRole("link", { name: "切換至繁體中文" }).focus();
    expect(screen.getByRole("link", { name: "切換至繁體中文" })).toHaveFocus();

    rerender(<LanguageSwitcher locale="zh-TW" />);
    const toggle = screen.getByRole("link", { name: "Switch to English" });
    expect(screen.getByRole("navigation", { name: "作品集語言" })).toBeVisible();
    expect(toggle).toHaveAttribute("href", "/projects/employa?lang=en");
    expect(toggle).toHaveAttribute("hreflang", "en");
    expect(toggle).toHaveAttribute("title", "Switch to English");
  });

  it("persists only the portfolio language preference and navigates to the target", () => {
    document.cookie = "personal-preference=dark; Path=/";
    render(<LanguageSwitcher locale="en" />);
    fireEvent.click(screen.getByRole("link", { name: "切換至繁體中文" }));

    expect(document.cookie).toContain("portfolio-locale=zh-TW");
    expect(document.cookie).toContain("personal-preference=dark");
    expect(push).toHaveBeenCalledWith("/projects/employa?lang=zh-TW", {
      scroll: false,
    });
  });

  it("preserves the open project section and query parameters while switching language", () => {
    window.history.replaceState(
      {},
      "",
      "/projects/employa?lang=en&open=architecture#system",
    );
    render(<LanguageSwitcher locale="en" />);
    fireEvent.click(screen.getByRole("link", { name: "切換至繁體中文" }));

    expect(push).toHaveBeenCalledWith(
      "/projects/employa?lang=zh-TW&open=architecture#system",
      { scroll: false },
    );
  });
});
