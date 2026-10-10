// @vitest-environment node
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { featuredProjects, getProjectBySlug, projects } from "@/lib/projects";
import { featuredAdditionalProjects } from "@/lib/project-archive";

const requiredSections = [
  "overview",
  "my-role",
  "problem-and-constraints",
  "architecture",
  "data-flow",
  "technical-implementation",
  "engineering-decisions",
  "challenges-and-tradeoffs",
  "results-and-evidence",
  "lessons-learned",
];

describe("publishable project content", () => {
  it("has unique, stable routes and a curated homepage selection", () => {
    expect(new Set(projects.map((project) => project.slug)).size).toBe(
      projects.length,
    );
    expect(featuredProjects.length).toBeGreaterThanOrEqual(2);
    expect(featuredProjects.length).toBeLessThanOrEqual(3);
    expect(
      featuredProjects.every(
        (project) => project.featured && projects.includes(project),
      ),
    ).toBe(true);
    for (const featured of featuredAdditionalProjects) {
      const caseStudy = getProjectBySlug(featured.id);
      expect(
        caseStudy,
        `${featured.title.en} needs a dedicated case route`,
      ).toBeDefined();
      expect(caseStudy?.repository).toBe(featured.repository);
      expect(caseStudy?.featured).toBe(false);
    }
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });

  for (const project of projects) {
    it(`${project.title} has complete authorship, sections, and evidence`, () => {
      expect(project.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(getProjectBySlug(project.slug)).toEqual(project);
      for (const value of [
        project.title,
        project.summary,
        project.role,
        project.team,
        project.contribution,
        project.status,
      ]) {
        expect(value.trim().length).toBeGreaterThan(0);
      }
      expect(project.stack.length).toBeGreaterThan(0);
      expect(project.category.length).toBeGreaterThan(0);
      expect(
        project.category.every((category) =>
          ["Backend", "Data", "AI", "Full-stack", "Frontend"].includes(
            category,
          ),
        ),
      ).toBe(true);
      expect(Number.isInteger(project.year)).toBe(true);
      expect(project.sections.map((section) => section.id)).toEqual(
        requiredSections,
      );
      for (const section of project.sections) {
        expect(section.title.trim()).not.toBe("");
        expect(section.paragraphs.length).toBeGreaterThan(0);
        expect(
          section.paragraphs.every((paragraph) => paragraph.trim().length > 0),
        ).toBe(true);
      }
      expect(project.architecture.length).toBeGreaterThan(0);
      for (const node of project.architecture) {
        expect(node.label.trim()).not.toBe("");
        expect(node.detail.trim()).not.toBe("");
      }
      expect(project.evidence.length).toBeGreaterThan(0);
      for (const evidence of project.evidence) {
        expect(evidence.label.trim()).not.toBe("");
        expect(evidence.detail.trim()).not.toBe("");
      }
      const urls = [
        project.repository,
        project.demo,
        ...project.evidence.map((evidence) => evidence.url),
      ].filter((url): url is string => Boolean(url));
      for (const value of urls) {
        const url = new URL(value);
        expect(url.protocol).toBe("https:");
        expect(url.username).toBe("");
        expect(url.hostname).not.toMatch(/^(localhost|example\.)/);
      }
      for (const image of project.images) {
        expect(image.alt.trim()).not.toBe("");
        if (image.src.startsWith("/"))
          expect(existsSync(resolve("public", image.src.slice(1)))).toBe(true);
        else expect(new URL(image.src).protocol).toBe("https:");
      }
    });
  }
});
