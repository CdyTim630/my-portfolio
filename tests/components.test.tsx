import { fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HomeThemeSwitcher from "@/components/HomeThemeSwitcher";
import Navbar from "@/components/Navbar";
import ProjectFilter from "@/components/portfolio/ProjectFilter";

vi.mock("next/navigation", () => ({
  usePathname: () => "/projects",
  useRouter: () => ({ push: vi.fn() }),
}));

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
});

describe("project discovery", () => {
  it("filters actual cards and announces the result count", () => {
    render(<ProjectFilter entries={[
      { slug: "pipeline", category: ["Data", "AI"], card: <article>Data pipeline</article> },
      { slug: "api", category: ["Backend"], card: <article>Backend API</article> },
    ]} />);
    expect(screen.getAllByRole("article")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "Data" }));
    expect(screen.getByText("Data pipeline")).toBeVisible();
    expect(screen.queryByText("Backend API")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("1 project");
    expect(screen.getByRole("button", { name: "Data" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("shows an honest empty state for an unrepresented category", () => {
    render(<ProjectFilter entries={[{ slug: "api", category: ["Backend"], card: <article>Backend API</article> }]} />);
    fireEvent.click(screen.getByRole("button", { name: "AI" }));
    expect(screen.getByRole("status")).toHaveTextContent("0 projects");
    expect(screen.getByText("No published projects in this domain yet.")).toBeVisible();
  });
});

describe("keyboard navigation", () => {
  it("keeps engineering anchors separate from the personal website", () => {
    render(<Navbar />);
    expect(screen.getByTitle("Portfolio home")).toHaveAttribute("href", "/portfolio?lang=en");
    const menu = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(menu).getByRole("link", { name: "About" })).toHaveAttribute("href", "/portfolio?lang=en#about");
    expect(within(menu).getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/portfolio?lang=en#contact");
    expect(within(menu).getByRole("link", { name: "Personal website" })).toHaveAttribute("href", "/");
  });

  it("offers a shareable language switch and Chinese navigation without changing personal links", () => {
    render(<Navbar locale="zh-TW" />);
    const menu = screen.getByRole("navigation", { name: "主要導覽" });
    expect(within(menu).getByRole("link", { name: "作品" })).toHaveAttribute("href", "/projects?lang=zh-TW");
    expect(within(menu).getByRole("link", { name: "個人網站" })).toHaveAttribute("href", "/");
    expect(within(menu).getByRole("link", { name: "文章" })).toHaveAttribute("href", "/blog");
    const languages = screen.getByRole("navigation", { name: "作品集語言" });
    expect(within(languages).getAllByRole("link")).toHaveLength(1);
    expect(within(languages).getByRole("link", { name: "Switch to English" })).toHaveAttribute("href", "/projects?lang=en");
  });

  it("opens the mobile menu and restores toggle focus on Escape", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    const menu = screen.getByRole("navigation", { name: "Mobile navigation" });
    const projectsLink = within(menu).getByRole("link", { name: "Projects" });
    projectsLink.focus();
    fireEvent.keyDown(projectsLink, { key: "Escape" });
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile menu after a destination is selected", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const menu = screen.getByRole("navigation", { name: "Mobile navigation" });
    const link = within(menu).getByRole("link", { name: "Projects" });
    link.addEventListener("click", event => event.preventDefault(), { once: true });
    fireEvent.click(link);
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });
});

describe("theme preference", () => {
  it("restores and changes the persisted theme", async () => {
    localStorage.setItem("home-theme-mode", "dark");
    localStorage.setItem("personal-theme-mode", "color");
    render(<HomeThemeSwitcher><p>Portfolio content</p></HomeThemeSwitcher>);
    const select = screen.getByRole("combobox", { name: "Color theme" });
    await waitFor(() => expect(select).toHaveValue("dark"));
    expect(document.documentElement.style.colorScheme).toBe("dark");
    fireEvent.change(select, { target: { value: "light" } });
    expect(localStorage.getItem("home-theme-mode")).toBe("light");
    expect(localStorage.getItem("personal-theme-mode")).toBe("color");
    expect(document.documentElement.style.colorScheme).toBe("light");
  });

  it("remains usable when browser storage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Storage disabled"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage disabled"); });
    render(<HomeThemeSwitcher><p>Portfolio content</p></HomeThemeSwitcher>);
    const select = screen.getByRole("combobox", { name: "Color theme" });
    await waitFor(() => expect(select).toHaveValue("light"));
    fireEvent.change(select, { target: { value: "dark" } });
    expect(select).toHaveValue("dark");
  });
});
