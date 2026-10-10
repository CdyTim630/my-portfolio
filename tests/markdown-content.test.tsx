import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MarkdownContent from "@/components/MarkdownContent";

describe("published Markdown rendering policy", () => {
  it("escapes injected HTML instead of creating executable elements or handlers", () => {
    const payload = '<script>alert("xss")</script>\n\n<iframe src="https://attacker.example"></iframe>\n\n<img src="x" onerror="alert(1)">';
    const { container } = render(<MarkdownContent>{payload}</MarkdownContent>);

    expect(container.querySelector("script, iframe, img, [onerror]")).toBeNull();
    expect(container.textContent).toContain('<script>alert("xss")</script>');
    expect(container.textContent).toContain('<iframe src="https://attacker.example"></iframe>');
  });

  it("removes executable link schemes while preserving their readable labels", () => {
    const { container } = render(<MarkdownContent>{'[Unsafe](javascript:alert%281%29)\n\n[Encoded](java&#x73;cript:alert%281%29)\n\n[Data](data:text/html,hello)'}</MarkdownContent>);

    for (const link of container.querySelectorAll("a")) {
      expect(link.getAttribute("href") || "").not.toMatch(/^(javascript|data):/i);
    }
    expect(screen.getByText("Unsafe")).toBeVisible();
    expect(screen.getByText("Encoded")).toBeVisible();
    expect(screen.getByText("Data")).toBeVisible();
  });

  it("preserves normal article headings, HTTP links and GFM tables", () => {
    render(<MarkdownContent>{'## Architecture\n\n[Read the source](https://github.com/CdyTim630)\n\n| Component | Role |\n| --- | --- |\n| API | Validation |'}</MarkdownContent>);

    expect(screen.getByRole("heading", { level: 2, name: "Architecture" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Read the source" })).toHaveAttribute("href", "https://github.com/CdyTim630");
    expect(screen.getByRole("table")).toBeVisible();
    expect(screen.getByRole("cell", { name: "Validation" })).toBeVisible();
  });
});
