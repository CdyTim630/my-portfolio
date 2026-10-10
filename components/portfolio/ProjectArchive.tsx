import Link from "next/link";
import Image from "next/image";
import { additionalProjects, type AdditionalProject } from "@/lib/project-archive";
import { getProjectBySlug, type Project } from "@/lib/projects";
import { projectGalleryMeta } from "@/lib/project-collections";
import { portfolioHref, type PortfolioLocale } from "@/lib/portfolio-locale";
import ArchiveSearch from "./ArchiveSearch";
import ProjectArtwork from "./ProjectArtwork";
import "./project-gallery.css";

export default function ProjectArchive({
  locale,
  openProjectId,
  projects = additionalProjects,
  galleryMeta = projectGalleryMeta,
  detailSlugs,
  covers = {},
  visuals = {},
}: {
  locale: PortfolioLocale;
  openProjectId?: string;
  projects?: AdditionalProject[];
  galleryMeta?: typeof projectGalleryMeta;
  detailSlugs?: string[];
  covers?: Record<string, Project["images"][number]>;
  visuals?: Record<string, Project["visual"]>;
}) {
  const zh = locale === "zh-TW";
  const language = zh ? "zh" : "en";
  return (
    <section
      className="project-archive project-catalog"
      id="more-work"
      aria-labelledby="archive-heading"
    >
      <header className="catalog-heading">
        <div>
          <h2 id="archive-heading">
            {zh ? "更多專案" : "More projects"}
          </h2>
        </div>
      </header>
      <ArchiveSearch
        locale={locale}
        entries={projects.map((project) => {
          const meta = galleryMeta[project.id];
          const cover = covers[project.id];
          const hasDistinctSummary = project.summary[language].trim() !== meta.teaser[language].trim();
          return {
            id: project.id,
            category: meta.category,
            title: project.title,
            summary: project.summary,
            tags: project.stack,
            card: (
              <article
                className="archive-card gallery-card"
                key={project.id}
                id={project.id}
                data-project-id={project.id}
                data-category={meta.category}
              >
                <div className={`gallery-cover${cover ? " gallery-cover-with-image" : ""}`}>
                  {cover ? (
                    <Image
                      src={cover.src}
                      alt={cover.alt}
                      width={1440}
                      height={1000}
                      sizes="(max-width: 760px) 90vw, 400px"
                      unoptimized={!cover.src.startsWith("/")}
                      className="gallery-cover-image"
                    />
                  ) : (
                    <ProjectArtwork
                      slug={project.id}
                      visual={visuals[project.id]}
                      title={project.title[language]}
                      locale={locale}
                    />
                  )}
                </div>
                <div className="gallery-card-body">
                  <h4>{project.title[language]}</h4>
                  <p className="gallery-teaser">{meta.teaser[language]}</p>
                  <ul
                    className="gallery-tech"
                    aria-label={zh ? "主要技術" : "Key technologies"}
                  >
                    {project.stack.slice(0, 3).map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <details
                    className="gallery-details"
                    open={project.id === openProjectId}
                  >
                    <summary>
                      <span>{zh ? "專案詳情" : "Details"}</span>
                      <span className="gallery-expand" aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <div className="gallery-detail-content">
                      <p className="gallery-kind">{project.kind[language]}</p>
                      {hasDistinctSummary && (
                        <p className="archive-summary">
                          {project.summary[language]}
                        </p>
                      )}
                      <p className="archive-contribution">
                        <strong>{zh ? "我的貢獻" : "My contribution"}</strong>
                        {project.contribution[language]}
                      </p>
                      {project.stack.length > 3 && (
                        <p className="gallery-full-stack">
                          <span>{zh ? "其他技術：" : "Also used: "}</span>
                          {project.stack.slice(3).join(" · ")}
                        </p>
                      )}
                      <div className="archive-links">
                        {(detailSlugs
                          ? detailSlugs.includes(project.id)
                          : getProjectBySlug(project.id)) && (
                          <Link
                            href={portfolioHref(
                              `/projects/${project.id}`,
                              locale,
                            )}
                          >
                            {zh ? "閱讀專案" : "Read project"}
                          </Link>
                        )}
                        {project.repository && (
                          <a
                            href={project.repository}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {zh ? "原始碼" : "Source"}
                          </a>
                        )}
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {zh ? "查看作品" : "Visit project"}
                          </a>
                        )}
                        {project.evidence &&
                          project.evidence !== project.demo && (
                            <a
                              href={project.evidence}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {zh ? "參考資料" : "Evidence"}
                            </a>
                          )}
                        {project.sourceLabel && (
                          <span className="archive-source-note">
                            {project.sourceLabel[language]}
                          </span>
                        )}
                      </div>
                    </div>
                  </details>
                </div>
              </article>
            ),
          };
        })}
      />
    </section>
  );
}
