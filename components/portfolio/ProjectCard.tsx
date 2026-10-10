import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import {
  categoryLabel,
  portfolioHref,
  type PortfolioLocale,
} from "@/lib/portfolio-locale";
import ProjectArtwork, { ProjectAwardBadge } from "./ProjectArtwork";
import artworkStyles from "./ProjectArtwork.module.css";
import "./project-card-compact.css";

export function ProjectVisual({
  project,
  large = false,
  compact = false,
  locale = "en",
}: {
  project: Project;
  large?: boolean;
  compact?: boolean;
  locale?: PortfolioLocale;
}) {
  const cover = project.images[0];
  return (
    <div
      className={`${!cover ? artworkStyles.frame : ""} work-visual work-visual-clean visual-${project.visual}${cover ? " work-visual-media" : ""}${large ? " work-visual-large" : ""}${compact ? " work-visual-compact" : ""}`}
    >
      {cover ? (
        <div className="work-cover-media">
            <Image
              src={cover.src}
              alt={cover.alt}
              width={1440}
              height={1000}
              sizes="(max-width: 700px) 90vw, 560px"
              className="work-screenshot"
              unoptimized={!cover.src.startsWith("/")}
            />
        </div>
      ) : (
        <ProjectArtwork slug={project.slug} visual={project.visual} title={project.title} locale={locale} />
      )}
      {large && cover?.caption && (
        <p className="work-cover-caption">{cover.caption}</p>
      )}
    </div>
  );
}

export default function ProjectCard({
  project,
  headingLevel = 3,
  locale = "en",
}: {
  project: Project;
  index?: number;
  headingLevel?: 2 | 3;
  locale?: PortfolioLocale;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const zh = locale === "zh-TW";
  const caseHref = portfolioHref(`/projects/${project.slug}`, locale);
  return (
    <article className="project-card work-card compact-card">
      <Link
        href={caseHref}
        className="work-cover-link"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProjectVisual project={project} locale={locale} compact />
      </Link>
      <div className="work-card-body">
        <div className="work-card-meta">
          <span>
            {project.category
              .slice(0, 1)
              .map((category) => categoryLabel(category, locale))
              .join(" / ")}
          </span>
          <ProjectAwardBadge slug={project.slug} locale={locale} />
        </div>
        <Heading className="work-card-title">
          <Link href={caseHref}>
            <span>{project.title}</span>
          </Link>
        </Heading>
        <p className="work-card-summary">{project.summary}</p>
        <ul className="work-tags" aria-label={zh ? "使用技術" : "Technologies"}>
          {project.stack.slice(0, 3).map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <div className="work-card-links">
          <Link href={caseHref} className="work-case-link">
            {zh ? "閱讀專案" : "Read project"}
          </Link>
          <div>
            {project.repository && (
              <a
                href={project.repository}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} ${zh ? "的 GitHub 原始碼" : "source on GitHub"}`}
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
