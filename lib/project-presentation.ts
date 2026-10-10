import type { ProjectDocument } from "./project-cms-types";
import { additionalProjects, type AdditionalProject } from "./project-archive";
import { projectCollections, projectGalleryMeta } from "./project-collections";
import type { PortfolioLocale } from "./portfolio-locale";
import { seedProjectDocuments } from "./project-cms-seeds";

export function projectForLocale(document: ProjectDocument, locale: PortfolioLocale) {
  return locale === "zh-TW" ? document.zh : document.en;
}

/** Cards and detail pages read the same published snapshot. */
export function projectArchiveEntry(document: ProjectDocument, locale: PortfolioLocale = "en"): AdditionalProject {
  const original = additionalProjects.find((project) => project.id === document.slug);
  const localized = projectForLocale(document, locale);
  const seed = seedProjectDocuments.find((project) => project.slug === document.slug);
  const originalContent = seed && projectForLocale(seed, locale);
  const sourceUnchanged = originalContent && localized.repository === originalContent.repository &&
    localized.status === originalContent.status &&
    JSON.stringify(localized.evidence.map(({ label, url, detail }) => [label, url, detail])) ===
    JSON.stringify(originalContent.evidence.map(({ label, url, detail }) => [label, url, detail]));
  return {
    id: document.slug,
    title: { en: document.en.title, zh: document.zh.title },
    summary: { en: document.en.summary, zh: document.zh.summary },
    contribution: { en: document.en.contribution, zh: document.zh.contribution },
    kind: { en: document.en.status, zh: document.zh.status },
    stack: localized.stack,
    repository: localized.repository || undefined,
    demo: localized.demo,
    evidence: localized.evidence[0]?.url,
    sourceLabel: sourceUnchanged ? original?.sourceLabel : undefined,
  };
}

export function projectGalleryEntry(document: ProjectDocument) {
  return {
    category: document.collection,
    mark: projectGalleryMeta[document.slug]?.mark ??
      projectCollections.find((collection) => collection.id === document.collection)?.symbol ?? "✦",
    teaser: { en: document.en.summary, zh: document.zh.summary },
  };
}
