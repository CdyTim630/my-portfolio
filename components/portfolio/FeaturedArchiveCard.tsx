import Link from "next/link";
import Image from "next/image";
import type { AdditionalProject } from "@/lib/project-archive";
import type { Project } from "@/lib/projects";
import {
  projectCollections,
  projectGalleryMeta,
} from "@/lib/project-collections";
import { portfolioHref, type PortfolioLocale } from "@/lib/portfolio-locale";
import ProjectArtwork, { ProjectAwardBadge } from "./ProjectArtwork";
import "./project-gallery.css";
import "./project-card-compact.css";
import "./featured-archive-card.css";

export default function FeaturedArchiveCard({
  project,
  locale = "en",
  headingLevel = 3,
  meta: galleryMeta,
  cover,
  visual,
}: {
  project: AdditionalProject;
  index?: number;
  locale?: PortfolioLocale;
  headingLevel?: 2 | 3;
  meta?: (typeof projectGalleryMeta)[string];
  cover?: Project["images"][number];
  visual?: Project["visual"];
}) {
  const language = locale === "zh-TW" ? "zh" : "en";
  const zh = language === "zh";
  const meta = galleryMeta ?? projectGalleryMeta[project.id];
  const collection = projectCollections.find(
    (item) => item.id === meta.category,
  )!;
  const href = portfolioHref(`/projects/${project.id}`, locale);
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article
      className="work-card compact-card featured-archive-card"
      data-category={meta.category}
      data-featured-project={project.id}
    >
      <Link
        href={href}
        className="work-cover-link"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="featured-archive-cover">
          {cover ? (
            <Image
              src={cover.src}
              alt={cover.alt}
              width={1440}
              height={1000}
              sizes="(max-width: 760px) 90vw, 560px"
              unoptimized={!cover.src.startsWith("/")}
              className="featured-cover-image"
            />
          ) : (
            <ProjectArtwork slug={project.id} visual={visual} title={project.title[language]} locale={locale} />
          )}
        </div>
      </Link>
      <div className="work-card-body">
        <div className="work-card-meta">
          <span>{collection.label[language]}</span>
          <ProjectAwardBadge slug={project.id} locale={locale} />
        </div>
        <Heading className="work-card-title">
          <Link href={href}>
            <span>{project.title[language]}</span>
          </Link>
        </Heading>
        <p className="work-card-summary">{meta.teaser[language]}</p>
        <ul className="work-tags" aria-label={zh ? "使用技術" : "Technologies"}>
          {project.stack.slice(0, 3).map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
        <div className="work-card-links">
          <Link href={href} className="work-case-link">
            {zh ? "閱讀專案" : "Read project"}
          </Link>
          <div>
            {project.repository && (
              <a
                href={project.repository}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title[language]} ${zh ? "的 GitHub 原始碼" : "source on GitHub"}`}
              >
                {zh ? "原始碼" : "Source"}
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer">
                {zh ? "線上展示" : "Demo"}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
