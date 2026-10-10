import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PersonalNavbar from "@/components/personal/PersonalNavbar";
import PersonalThemeSwitcher from "@/components/personal/PersonalThemeSwitcher";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("next/font/local", () => ({ default: () => ({ variable: "test-personal-font" }) }));

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

describe("personal website theme", () => {
  it("restores its own preference without overwriting the portfolio theme", async () => {
    localStorage.setItem("personal-theme-mode", "dark");
    localStorage.setItem("home-theme-mode", "color");
    const { container } = render(<PersonalThemeSwitcher><p>Personal website</p></PersonalThemeSwitcher>);
    await waitFor(() => expect(container.querySelector(".personal-site")).toHaveAttribute("data-mode", "dark"));
    fireEvent.click(screen.getByRole("button", { name: "Open personal theme selector" }));
    const choices = screen.getByRole("group", { name: "Personal website color theme" });
    expect(within(choices).getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(within(choices).getByRole("button", { name: "Light" }));
    expect(container.querySelector(".personal-site")).toHaveAttribute("data-mode", "light");
    expect(localStorage.getItem("personal-theme-mode")).toBe("light");
    expect(localStorage.getItem("home-theme-mode")).toBe("color");
  });

  it("keeps closed choices out of keyboard navigation and restores focus on Escape", () => {
    render(<PersonalThemeSwitcher><p>Personal website</p></PersonalThemeSwitcher>);
    const toggle = screen.getByRole("button", { name: "Open personal theme selector" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("button", { name: "Dark" })).not.toBeInTheDocument();
    fireEvent.click(toggle);
    const choice = screen.getByRole("button", { name: "Light" });
    expect(choice).toHaveFocus();
    fireEvent.keyDown(choice, { key: "Escape" });
    expect(screen.queryByRole("group", { name: "Personal website color theme" })).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});

describe("personal website navigation", () => {
  it("preserves personal anchors and exposes the separate portfolio in both menus", () => {
    render(<PersonalNavbar />);
    expect(screen.getByRole("link", { name: "CdyTim — personal homepage" })).toHaveAttribute("href", "/");
    const desktop = screen.getByRole("navigation", { name: "Personal website navigation" });
    expect(within(desktop).getByRole("link", { name: "About" })).toHaveAttribute("href", "/#about");
    expect(within(desktop).getByRole("link", { name: "Portfolio" })).toHaveAttribute("href", "/portfolio");
    const toggle = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(toggle);
    const mobile = screen.getByRole("navigation", { name: "Personal website mobile navigation" });
    const portfolio = within(mobile).getByRole("link", { name: "Portfolio" });
    expect(portfolio).toHaveAttribute("href", "/portfolio");
    portfolio.focus();
    fireEvent.keyDown(portfolio, { key: "Escape" });
    expect(screen.queryByRole("navigation", { name: "Personal website mobile navigation" })).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });
});
