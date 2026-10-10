import type { Project } from "./projects";
import type { PortfolioLocale } from "./portfolio-locale";
import { projectTranslations } from "./project-translations";

export function localizeProject(
  project: Project,
  locale: PortfolioLocale,
): Project {
  return locale === "zh-TW" && projectTranslations[project.slug]
    ? { ...project, ...projectTranslations[project.slug] }
    : project;
}
