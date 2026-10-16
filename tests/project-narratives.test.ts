// @vitest-environment node
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { seedProjectDocuments } from "@/lib/project-cms-seeds";
import { parseProjectDocument } from "@/lib/project-cms-validation";

describe("complete project explanations", () => {
  for (const document of seedProjectDocuments) {
    it(`${document.slug} explains its purpose, work and limits in both languages`, () => {
      expect(() => parseProjectDocument(document, true)).not.toThrow();
      expect(document.zh.sections.map((section) => section.id)).toEqual(
        document.en.sections.map((section) => section.id),
      );
      for (const project of [document.en, document.zh]) {
        expect(project.sections.length).toBeGreaterThanOrEqual(6);
        expect(
          project.sections.some((section) => section.id === "my-role"),
        ).toBe(true);
        expect(
          project.sections.some((section) =>
            /tradeoff|scope|constraint/.test(section.id),
          ),
        ).toBe(true);
        expect(
          project.sections.every((section) => section.paragraphs.length > 0),
        ).toBe(true);
      }
      for (const [index, section] of document.zh.sections.entries()) {
        expect(section.title).toMatch(/\p{Script=Han}/u);
        expect(section.paragraphs).toHaveLength(
          document.en.sections[index].paragraphs.length,
        );
        expect(
          section.paragraphs.every((paragraph) =>
            /\p{Script=Han}/u.test(paragraph),
          ),
        ).toBe(true);
      }
      expect(document.zh.evidence.map((item) => item.url)).toEqual(
        document.en.evidence.map((item) => item.url),
      );
      expect(document.zh.images.map((image) => image.src)).toEqual(
        document.en.images.map((image) => image.src),
      );
      for (const image of document.zh.images) {
        expect(image.alt).toMatch(/\p{Script=Han}/u);
        expect(image.caption).toBeTruthy();
        if (image.src.startsWith("/"))
          expect(existsSync(resolve("public", image.src.slice(1)))).toBe(true);
      }
    });
  }

  it("links the water-map report, exact contribution and current route source", () => {
    const project = seedProjectDocuments.find(
      (entry) => entry.slug === "ntu-water-risk-map",
    )!.zh;
    expect(project.sections).toHaveLength(10);
    expect(
      project.evidence.some((item) => item.url.endsWith("/report/report.pdf")),
    ).toBe(true);
    expect(
      project.evidence.some((item) =>
        item.url.endsWith("/src/lib/denseGraph.ts"),
      ),
    ).toBe(true);
    expect(project.role).toBe("專案整合與路徑規劃演算法");
    expect(project.images).toHaveLength(2);
  });

  it("keeps private source, assets and live destinations out of private-project pages", () => {
    for (const slug of ["internship-radar", "pdao-2026", "one-more-time"]) {
      const document = seedProjectDocuments.find(
        (entry) => entry.slug === slug,
      )!;
      expect(document.en.repository).toBe("");
      expect(document.en.evidence).toEqual([]);
      expect(document.en.images).toEqual([]);
      expect(document.en.demo).toBeUndefined();
    }
  });
});
