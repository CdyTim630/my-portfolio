// @vitest-environment node
import { describe, expect, it } from "vitest";
import { projects } from "@/lib/projects";
import { projectTranslations } from "@/lib/project-translations";

describe("complete Traditional Chinese case studies", () => {
  it("covers every published project without an orphaned translation", () => {
    expect(Object.keys(projectTranslations).sort()).toEqual(projects.map(project => project.slug).sort());
  });

  for (const source of projects) {
    it(`${source.slug} preserves evidence, anchors and source excerpts while translating the full narrative`, () => {
      const translated = projectTranslations[source.slug];
      expect(translated.sections.map(section => section.id)).toEqual(source.sections.map(section => section.id));
      expect(translated.architecture).toHaveLength(source.architecture.length);
      expect(translated.evidence.map(item => item.url)).toEqual(source.evidence.map(item => item.url));
      expect(translated.images.map(item => item.src)).toEqual(source.images.map(item => item.src));
      expect(translated.title.trim()).not.toBe("");
      const narrative = [translated.summary, translated.role, translated.team, translated.status, translated.contribution];
      translated.sections.forEach((section, index) => {
        const original = source.sections[index];
        expect(section.paragraphs).toHaveLength(original.paragraphs.length);
        expect(section.bullets?.length ?? 0).toBe(original.bullets?.length ?? 0);
        expect(section.code?.language).toBe(original.code?.language);
        expect(section.code?.content).toBe(original.code?.content);
        narrative.push(section.title, ...section.paragraphs, ...(section.bullets ?? []));
        if (original.code?.caption) narrative.push(section.code?.caption ?? "");
      });
      translated.architecture.forEach(item => narrative.push(item.label, item.detail));
      translated.evidence.forEach(item => narrative.push(item.label, item.detail));
      translated.images.forEach((item, index) => {
        narrative.push(item.alt);
        if (source.images[index].caption) narrative.push(item.caption ?? "");
      });
      for (const text of narrative) expect(text).toMatch(/\p{Script=Han}/u);
    });
  }
});
