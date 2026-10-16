import type { Project } from "./projects";

export type ProjectCopy = { en: string; zh: string };
export type ProjectNarrative = {
  sections: {
    id: string;
    title: ProjectCopy;
    paragraphs: ProjectCopy[];
    bullets?: ProjectCopy[];
  }[];
  architecture?: { label: ProjectCopy; detail: ProjectCopy }[];
  evidence?: { label: ProjectCopy; url: string; detail: ProjectCopy }[];
  images?: { src: string; alt: ProjectCopy; caption: ProjectCopy }[];
};

/** Keep narrative structure and source destinations identical in both languages. */
export function applyProjectNarrative(
  project: Project,
  narrative: ProjectNarrative,
  locale: "en" | "zh",
): Project {
  return {
    ...project,
    sections: narrative.sections.map((section) => ({
      id: section.id,
      title: section.title[locale],
      paragraphs: section.paragraphs.map((paragraph) => paragraph[locale]),
      ...(section.bullets
        ? { bullets: section.bullets.map((bullet) => bullet[locale]) }
        : {}),
    })),
    ...(narrative.architecture
      ? {
          architecture: narrative.architecture.map((node) => ({
            label: node.label[locale],
            detail: node.detail[locale],
          })),
        }
      : {}),
    ...(narrative.evidence
      ? {
          evidence: narrative.evidence.map((item) => ({
            label: item.label[locale],
            url: item.url,
            detail: item.detail[locale],
          })),
        }
      : {}),
    ...(narrative.images
      ? {
          images: narrative.images.map((item) => ({
            src: item.src,
            alt: item.alt[locale],
            caption: item.caption[locale],
          })),
        }
      : {}),
  };
}

export const copy = (en: string, zh: string): ProjectCopy => ({ en, zh });
