import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import HomeThemeSwitcher from "@/components/HomeThemeSwitcher";
import SiteFooter from "@/components/portfolio/SiteFooter";
import ProjectCard from "@/components/portfolio/ProjectCard";
import ProjectFilter from "@/components/portfolio/ProjectFilter";
import ProjectArchive from "@/components/portfolio/ProjectArchive";
import { getPublicProjectDocuments } from "@/lib/project-cms";
import { projectArchiveEntry, projectForLocale, projectGalleryEntry } from "@/lib/project-presentation";
import { getResumeUrl } from "@/lib/site-settings";
import { portfolioHref } from "@/lib/portfolio-locale";
import { getPortfolioLocale } from "@/lib/portfolio-locale-server";

type Props = {
  searchParams: Promise<{
    lang?: string | string[];
    open?: string | string[];
  }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const locale = await getPortfolioLocale(searchParams);
  const zh = locale === "zh-TW";
  const description = zh
    ? "陳鼎元的專案作品，涵蓋後端開發、資料分析與 AI 應用，介紹系統架構、開發過程與個人貢獻。"
    : "Engineering case studies by Ding-Yuan Chen: backend APIs, data systems and applied AI, with architecture, personal contributions and source evidence.";
  return {
    title: zh ? "專案作品" : "Projects",
    description,
    alternates: {
      canonical: portfolioHref("/projects", locale),
      languages: {
        en: portfolioHref("/projects", "en"),
        "zh-TW": portfolioHref("/projects", "zh-TW"),
      },
    },
    openGraph: {
      title: zh ? "專案作品 — 陳鼎元" : "Projects — Ding-Yuan Chen",
      description,
      url: portfolioHref("/projects", locale),
      locale: zh ? "zh_TW" : "en_US",
    },
  };
}
export const revalidate = 300;
export default async function ProjectsPage({ searchParams }: Props) {
  const [resumeUrl, locale, params, documents] = await Promise.all([
    getResumeUrl(),
    getPortfolioLocale(searchParams),
    searchParams,
    getPublicProjectDocuments(),
  ]);
  const zh = locale === "zh-TW";
  const localizedProjects = documents.filter((document) => document.listed).map((document) =>
    projectForLocale(document, locale),
  );
  const archiveProjects = documents.filter((document) => document.archived).map((document) => projectArchiveEntry(document, locale));
  const galleryMeta = Object.fromEntries(documents.map((document) => [document.slug, projectGalleryEntry(document)]));
  const visuals = Object.fromEntries(documents.map((document) => [document.slug, projectForLocale(document, locale).visual]));
  const covers = Object.fromEntries(documents.flatMap((document) => {
    const cover = projectForLocale(document, locale).images[0];
    return cover ? [[document.slug, cover]] : [];
  }));
  return (
    <HomeThemeSwitcher locale={locale}>
      <div className="site-container">
        <Navbar resumeUrl={resumeUrl} locale={locale} />
        <main id="main-content">
          <header className="gallery-index-header">
            <div className="gallery-index-title">
              <h1>
                {zh ? "專案作品" : "Projects"}
              </h1>
              <p>
                {zh
                  ? "收錄課程專題、競賽作品與個人開發專案。"
                  : "Selected projects, experiments and collaborations."}
              </p>
            </div>
            <nav
              className="gallery-index-nav"
              aria-label={zh ? "作品分類" : "Project collections"}
            >
              <a href="#case-studies">
                {zh ? "專案作品" : "Selected projects"}
                <span>{localizedProjects.length}</span>
              </a>
              <a href="#more-work">
                {zh ? "依分類瀏覽" : "Browse the collection"}
                <span>{archiveProjects.length}</span>
              </a>
            </nav>
          </header>
          <div id="case-studies" className="case-study-collection">
            <ProjectFilter
              locale={locale}
              entries={localizedProjects.map((project, index) => ({
                slug: project.slug,
                category: project.category,
                card: (
                  <ProjectCard
                    project={project}
                    index={index}
                    headingLevel={2}
                    locale={locale}
                  />
                ),
              }))}
            />
          </div>
          <ProjectArchive
            locale={locale}
            projects={archiveProjects}
            galleryMeta={galleryMeta}
            covers={covers}
            visuals={visuals}
            detailSlugs={documents.map((document) => document.slug)}
            openProjectId={
              typeof params.open === "string" &&
              archiveProjects.some((project) => project.id === params.open)
                ? params.open
                : undefined
            }
          />
          <div className="projects-closing">
            <p>
              {zh
                ? "有合作想法？"
                : "Have a project in mind?"}
            </p>
            <Link
              href={portfolioHref("/portfolio#contact", locale)}
              className="text-link"
            >
              {zh ? "聯絡我" : "Get in touch"}
            </Link>
          </div>
        </main>
        <SiteFooter locale={locale} />
      </div>
    </HomeThemeSwitcher>
  );
}
