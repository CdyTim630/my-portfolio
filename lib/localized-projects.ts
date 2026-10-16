import type { Project } from "./projects";
import type { PortfolioLocale } from "./portfolio-locale";
import { projectTranslations } from "./project-translations";
import { withReviewedProjectMedia } from "./project-media";

export function localizeProject(
  project: Project,
  locale: PortfolioLocale,
): Project {
  const localized =
    locale === "zh-TW" && projectTranslations[project.slug]
      ? { ...project, ...projectTranslations[project.slug] }
      : project;
  return withReviewedProjectMedia(localized, locale === "zh-TW" ? "zh" : "en");
}
