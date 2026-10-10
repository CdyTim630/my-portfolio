// @vitest-environment node
import { describe, expect, it } from "vitest";
import { additionalProjects } from "@/lib/project-archive";
import { projectCollections, projectGalleryMeta } from "@/lib/project-collections";

describe("archive content and primary categories", () => {
  it("assigns every additional project to exactly one valid category without orphaned entries", () => {
    const ids = additionalProjects.map(project => project.id);
    const categories = projectCollections.map(collection => collection.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(categories).size).toBe(categories.length);
    expect(Object.keys(projectGalleryMeta).sort()).toEqual([...ids].sort());
    for (const id of ids) expect(categories).toContain(projectGalleryMeta[id].category);
    const assigned = projectCollections.flatMap(collection => ids.filter(id => projectGalleryMeta[id].category === collection.id));
    expect(assigned.sort()).toEqual([...ids].sort());
  });

  it("provides bilingual category labels and teasers while retaining complete contribution content", () => {
    for (const collection of projectCollections) {
      for (const language of ["en", "zh"] as const) {
        expect(collection.label[language].trim()).not.toBe("");
        expect(collection.note[language].trim()).not.toBe("");
      }
    }
    for (const project of additionalProjects) {
      for (const language of ["en", "zh"] as const) {
        for (const text of [projectGalleryMeta[project.id].teaser[language], project.title[language], project.summary[language], project.contribution[language]]) {
          expect(text.trim()).not.toBe("");
        }
      }
    }
  });

  it("keeps source destinations safe and private source entries unlinked", () => {
    for (const project of additionalProjects) {
      for (const value of [project.repository, project.evidence, project.demo].filter((value): value is string => Boolean(value))) {
        const url = new URL(value);
        expect(url.protocol).toBe("https:");
        expect(url.username).toBe("");
        expect(url.password).toBe("");
        expect(url.hostname).not.toMatch(/^(localhost|example\.)/);
      }
    }
    for (const id of ["one-more-time", "internship-radar", "pdao-2026"]) {
      const project = additionalProjects.find(project => project.id === id)!;
      expect(project).toBeDefined();
      expect(project.repository).toBeUndefined();
      expect(project.evidence).toBeUndefined();
      expect(project.demo).toBeUndefined();
      expect(project.sourceLabel?.en).toMatch(/private/i);
    }
  });
});
