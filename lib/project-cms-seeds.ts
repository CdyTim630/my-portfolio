import { additionalProjects, featuredAdditionalProjectIds, type AdditionalProject } from "./project-archive";
import { projectGalleryMeta } from "./project-collections";
import { localizeProject } from "./localized-projects";
import { projects, type Project } from "./projects";
import type { ProjectDocument, ProjectCollectionId } from "./project-cms-types";

function collectionFor(slug: string): ProjectCollectionId {
  return projectGalleryMeta[slug]?.category ?? (slug === "ntu-grade-atlas" || slug === "social-media-text-mining" ? "data" : "products");
}

function archiveProject(source: AdditionalProject, locale: "en" | "zh"): Project {
  return {
    slug: source.id,
    title: source.title[locale],
    summary: source.summary[locale],
    year: 0,
    role: source.contribution[locale],
    team: source.kind[locale],
    stack: [...source.stack],
    category: [],
    featured: featuredAdditionalProjectIds.some((slug) => slug === source.id),
    repository: source.repository ?? "",
    ...(source.demo ? { demo: source.demo } : {}),
    images: [],
    sections: [
      { id: "overview", title: locale === "zh" ? "專案概覽" : "Overview", paragraphs: [source.summary[locale]] },
      { id: "my-role", title: locale === "zh" ? "我的貢獻" : "My contribution", paragraphs: [source.contribution[locale]] },
    ],
    evidence: source.evidence ? [{ label: locale === "zh" ? "專案來源" : "Project source", url: source.evidence, detail: source.sourceLabel?.[locale] ?? source.kind[locale] }] : [],
    architecture: [],
    status: source.kind[locale],
    contribution: source.contribution[locale],
    visual: "portfolio",
  };
}

const archiveIds = new Set(additionalProjects.map((project) => project.id));
const detailIds = new Set(projects.map((project) => project.slug));

/** Existing reviewed copy remains the starting point; archive summaries gain editable detail pages. */
export const seedProjectDocuments: ProjectDocument[] = [
  ...projects.map((project, index) => ({
    slug: project.slug,
    collection: collectionFor(project.slug),
    sortOrder: index * 10,
    listed: true,
    archived: archiveIds.has(project.slug),
    en: { ...localizeProject(project, "en"), featured: project.featured || featuredAdditionalProjectIds.some((slug) => slug === project.slug) },
    zh: { ...localizeProject(project, "zh-TW"), featured: project.featured || featuredAdditionalProjectIds.some((slug) => slug === project.slug) },
  })),
  ...additionalProjects.filter((project) => !detailIds.has(project.id)).map((project, index) => ({
    slug: project.id,
    collection: collectionFor(project.id),
    sortOrder: (projects.length + index) * 10,
    listed: false,
    archived: true,
    en: archiveProject(project, "en"),
    zh: archiveProject(project, "zh"),
  })),
];

export function createBlankProjectDocument(): ProjectDocument {
  const blank = (locale: "en" | "zh"): Project => ({
    slug: "", title: "", summary: "", year: 0, role: "", team: "", stack: [], category: [],
    featured: false, repository: "", images: [], evidence: [], architecture: [], status: "", contribution: "", visual: "portfolio",
    sections: [{ id: "overview", title: locale === "zh" ? "專案概覽" : "Overview", paragraphs: [] }],
  });
  return { slug: "", collection: "products", sortOrder: seedProjectDocuments.length * 10, listed: true, archived: true, en: blank("en"), zh: blank("zh") };
}
