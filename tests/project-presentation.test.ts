import { describe, expect, it } from "vitest";
import { seedProjectDocuments } from "@/lib/project-cms-seeds";
import { projectArchiveEntry } from "@/lib/project-presentation";

describe("published archive content", () => {
  it("uses the reference published for the visitor's language", () => {
    const document = structuredClone(seedProjectDocuments[0]);
    document.zh.evidence[0].url = "https://example.com/chinese-report";
    expect(projectArchiveEntry(document, "zh-TW").evidence).toBe("https://example.com/chinese-report");
    expect(projectArchiveEntry(document, "en").evidence).toBe(document.en.evidence[0].url);
  });

  it("removes a stale private-source note after the owner publishes a repository", () => {
    const document = structuredClone(seedProjectDocuments.find((entry) => entry.slug === "internship-radar")!);
    expect(projectArchiveEntry(document).sourceLabel).toBeDefined();
    document.en.repository = "https://github.com/example/public-project";
    document.zh.repository = document.en.repository;
    document.en.status = "Public project";
    document.zh.status = "公開專案";
    expect(projectArchiveEntry(document).sourceLabel).toBeUndefined();
    expect(projectArchiveEntry(document, "zh-TW").sourceLabel).toBeUndefined();
  });
});
