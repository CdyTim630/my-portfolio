import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import HomeThemeSwitcher from "@/components/HomeThemeSwitcher";
import SiteFooter from "@/components/portfolio/SiteFooter";
import ArchitectureDiagram from "@/components/portfolio/ArchitectureDiagram";
import { ProjectVisual } from "@/components/portfolio/ProjectCard";
import Icon from "@/components/portfolio/Icon";
import { getPublicProjectDocuments } from "@/lib/project-cms";
import { seedProjectDocuments } from "@/lib/project-cms-seeds";
import { projectForLocale } from "@/lib/project-presentation";
import { getResumeUrl } from "@/lib/site-settings";
import { siteUrl } from "@/lib/seo";
import { categoryLabel, portfolioHref } from "@/lib/portfolio-locale";
import { getPortfolioLocale } from "@/lib/portfolio-locale-server";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string | string[] }>;
};
export function generateStaticParams() {
  return seedProjectDocuments.map((project) => ({ slug: project.slug }));
}
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const [locale, documents, { slug }] = await Promise.all([
    getPortfolioLocale(searchParams),
    getPublicProjectDocuments(),
    params,
  ]);
  const sourceProject = documents.find((document) => document.slug === slug);
  if (!sourceProject)
    return { title: locale === "zh-TW" ? "找不到此專案" : "Project not found" };
  const project = projectForLocale(sourceProject, locale);
  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: portfolioHref(`/projects/${project.slug}`, locale),
      languages: {
        en: portfolioHref(`/projects/${project.slug}`, "en"),
        "zh-TW": portfolioHref(`/projects/${project.slug}`, "zh-TW"),
      },
    },
    openGraph: {
      title: `${project.title} — ${locale === "zh-TW" ? "專案作品" : "Engineering project"}`,
      description: project.summary,
      url: portfolioHref(`/projects/${project.slug}`, locale),
      locale: locale === "zh-TW" ? "zh_TW" : "en_US",
      type: "article",
    },
  };
}
export const revalidate = 300;
export default async function ProjectPage({ params, searchParams }: Props) {
  const [resumeUrl, locale, documents, { slug }] = await Promise.all([
    getResumeUrl(),
    getPortfolioLocale(searchParams),
    getPublicProjectDocuments(),
    params,
  ]);
  const sourceProject = documents.find((document) => document.slug === slug);
  if (!sourceProject) notFound();
  const zh = locale === "zh-TW";
  const project = projectForLocale(sourceProject, locale);
  const separateArchitecture =
    project.architecture.length > 0 &&
    !project.sections.some((section) => section.id === "architecture");
  const report = project.evidence.find(
    (item) =>
      /\.pdf(?:[?#]|$)/i.test(item.url) && /report|報告/i.test(item.label),
  );
  const next = projectForLocale(
    documents[
      (documents.findIndex((item) => item.slug === project.slug) + 1) %
        documents.length
    ],
    locale,
  );
  const sectionHref = (id: string) =>
    portfolioHref(`/projects/${project.slug}#${id}`, locale);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${project.title}: ${zh ? "專案作品" : "engineering project"}`,
    description: project.summary,
    author: { "@type": "Person", name: "Ding-Yuan Chen", url: siteUrl },
    mainEntityOfPage: `${siteUrl}${portfolioHref(`/projects/${project.slug}`, locale)}`,
    about: {
      "@type": "SoftwareSourceCode",
      name: project.title,
      codeRepository: project.repository,
    },
    inLanguage: locale,
  };
  return (
    <HomeThemeSwitcher locale={locale}>
      <div className="site-container">
        <Navbar resumeUrl={resumeUrl} locale={locale} />
        <main id="main-content">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
            }}
          />
          <header className="case-header">
            <Link
              className="back-link"
              href={portfolioHref("/projects", locale)}
            >
              {zh ? "← 返回作品列表" : "← All projects"}
            </Link>
            <div className="case-hero-grid">
              <div className="case-hero-copy">
                <p className="eyebrow">
                  {project.category
                    .map((category) => categoryLabel(category, locale))
                    .join(" / ")}{" "}
                  {project.year > 0 && (
                    <>
                      <span>·</span> {project.year}{" "}
                    </>
                  )}
                  {project.status && (
                    <>
                      <span>·</span> {project.status}
                    </>
                  )}
                </p>
                <h1>
                  {project.title}
                  <span className="blue-period">.</span>
                </h1>
                <p className="case-summary">{project.summary}</p>
                <div className="case-actions">
                  {report && (
                    <a
                      className="button-secondary"
                      href={report.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {zh ? "閱讀完整報告" : "Read full report"}{" "}
                      <Icon name="external" />
                    </a>
                  )}
                  {project.repository && (
                    <a
                      className="button-primary"
                      href={project.repository}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {zh ? "查看原始碼" : "View source"}{" "}
                      <Icon name="external" />
                    </a>
                  )}
                  {project.demo && (
                    <a
                      className="button-secondary"
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {zh ? "線上展示" : "Live demo"} <Icon name="external" />
                    </a>
                  )}
                  {project.evidence.length > 0 && (
                    <a className="text-link" href={sectionHref("evidence")}>
                      {zh ? "查看參考資料 ↓" : "Explore the evidence ↓"}
                    </a>
                  )}
                </div>
              </div>
              <div className="case-hero-visual">
                <ProjectVisual project={project} locale={locale} large />
              </div>
            </div>
            <dl className="case-facts">
              {project.role && (
                <div>
                  <dt>{zh ? "我的角色" : "MY ROLE"}</dt>
                  <dd>{project.role}</dd>
                </div>
              )}
              {project.team && (
                <div>
                  <dt>{zh ? "團隊" : "COLLABORATION"}</dt>
                  <dd>{project.team}</dd>
                </div>
              )}
              {project.stack.length > 0 && (
                <div>
                  <dt>{zh ? "使用技術" : "STACK"}</dt>
                  <dd>{project.stack.join(" · ")}</dd>
                </div>
              )}
            </dl>
            {project.contribution && (
              <div className="case-contribution-summary">
                <p className="eyebrow">{zh ? "個人貢獻" : "MY CONTRIBUTION"}</p>
                <p>{project.contribution}</p>
              </div>
            )}
          </header>
          {project.images.length > 0 && (
            <details className="case-gallery-disclosure">
              <summary>
                {zh
                  ? `查看實際畫面（${project.images.length}）`
                  : `View project screenshots (${project.images.length})`}
              </summary>
              <div className="case-gallery">
                {project.images.map((image) => (
                  <figure key={image.src}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={1280}
                      height={800}
                      sizes="(max-width: 1160px) 100vw, 1100px"
                      unoptimized={!image.src.startsWith("/")}
                    />
                    <figcaption>{image.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </details>
          )}
          {project.video && (
            <figure className="case-video">
              <video
                controls
                preload="metadata"
                poster={project.video.poster}
                aria-label={`${project.title} ${zh ? "展示影片" : "demo recording"}`}
              >
                <source src={project.video.src} />
                <a href={project.video.src}>
                  {zh ? "開啟展示影片" : "Open the demo recording"}
                </a>
              </video>
              <figcaption>{project.video.caption}</figcaption>
              {project.video.transcript && (
                <details>
                  <summary>
                    {zh ? "閱讀影片文字稿" : "Read the demo transcript"}
                  </summary>
                  <p>{project.video.transcript}</p>
                </details>
              )}
            </figure>
          )}
          <div className="case-layout">
            <aside className="case-toc">
              <nav aria-label={zh ? "專案目錄" : "Project contents"}>
                <p className="eyebrow">{zh ? "內容導覽" : "IN THIS PROJECT"}</p>
                {project.sections.map((section, index) => (
                  <a key={section.id} href={sectionHref(section.id)}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {section.title}
                  </a>
                ))}
                {separateArchitecture && (
                  <a href={sectionHref("project-architecture")}>
                    <span>↗</span>
                    {zh ? "專案架構" : "Project architecture"}
                  </a>
                )}
                {project.evidence.length > 0 && (
                  <a href={sectionHref("evidence")}>
                    <span>↗</span>
                    {zh ? "原始碼與參考資料" : "Source references"}
                  </a>
                )}
              </nav>
            </aside>
            <article className="case-article">
              {project.sections.map((section, index) => (
                <section
                  id={section.id}
                  key={section.id}
                  className="case-section"
                >
                  <div className="case-section-heading">
                    <span className="case-section-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2>{section.title}</h2>
                  </div>
                  {section.paragraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                  {section.id === "architecture" &&
                    project.architecture.length > 0 && (
                      <ArchitectureDiagram project={project} locale={locale} />
                    )}
                  {section.bullets && (
                    <ul>
                      {section.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.code && (
                    <figure className="code-example">
                      <figcaption>
                        {section.code.caption || section.code.language}
                      </figcaption>
                      <pre>
                        <code>{section.code.content}</code>
                      </pre>
                    </figure>
                  )}
                </section>
              ))}
              {separateArchitecture && (
                <section id="project-architecture" className="case-section">
                  <h2>{zh ? "專案架構" : "Project architecture"}</h2>
                  <ArchitectureDiagram project={project} locale={locale} />
                </section>
              )}
              {project.evidence.length > 0 && (
                <section
                  id="evidence"
                  className="case-section evidence-section"
                >
                  <div className="case-section-heading">
                    <span className="case-section-number" aria-hidden="true">
                      ↗
                    </span>
                    <div>
                      <p className="eyebrow">
                        {zh ? "延伸閱讀" : "READ THE SOURCE"}
                      </p>
                      <h2>
                        {zh ? "原始碼與參考資料" : "Evidence & references"}
                      </h2>
                    </div>
                  </div>
                  <p>
                    {zh
                      ? "以下連結包含專案原始碼、報告與開發紀錄，可進一步了解技術細節及我的貢獻。"
                      : "These links support the technical details above. Team implementation and my contribution are described separately."}
                  </p>
                  <ol>
                    {project.evidence.map((source) => (
                      <li key={source.url}>
                        <a href={source.url} target="_blank" rel="noreferrer">
                          {source.label}
                          <Icon name="external" />
                        </a>
                        <p>{source.detail}</p>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
            </article>
          </div>
          {documents.length > 1 && (
            <Link
              href={portfolioHref(`/projects/${next.slug}`, locale)}
              className="next-project"
            >
              <span className="eyebrow">
                {zh ? "下一個專案" : "NEXT PROJECT"}
              </span>
              <span>
                {next.title}
                <Icon />
              </span>
            </Link>
          )}
        </main>
        <SiteFooter locale={locale} />
      </div>
    </HomeThemeSwitcher>
  );
}
