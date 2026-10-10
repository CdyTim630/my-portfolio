import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import HomeThemeSwitcher from "@/components/HomeThemeSwitcher";
import ProjectCard from "@/components/portfolio/ProjectCard";
import FeaturedArchiveCard from "@/components/portfolio/FeaturedArchiveCard";
import SectionHeading from "@/components/portfolio/SectionHeading";
import ProjectRecognition from "@/components/portfolio/ProjectRecognition";
import CollectionFolderArtwork from "@/components/portfolio/CollectionFolderArtwork";
import SiteFooter from "@/components/portfolio/SiteFooter";
import Icon from "@/components/portfolio/Icon";
import ContactIcon from "@/components/portfolio/ContactIcon";
import { getPublicProjectDocuments } from "@/lib/project-cms";
import { projectArchiveEntry, projectForLocale, projectGalleryEntry } from "@/lib/project-presentation";
import { getResumeUrl } from "@/lib/site-settings";
import { siteUrl } from "@/lib/seo";
import type { Metadata } from "next";
import { getPortfolioLocale } from "@/lib/portfolio-locale-server";
import { portfolioHref } from "@/lib/portfolio-locale";
import { projectCollections } from "@/lib/project-collections";
import "@/components/portfolio/showcase.css";

const englishMetadata: Metadata = {
  title: "Engineering Portfolio",
  description:
    "Engineering work by Ding-Yuan Chen: data systems, backend APIs and applied AI, with personal contributions and source-backed case studies.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Ding-Yuan Chen — Engineering Portfolio",
    description: "Building reliable data systems and intelligent applications.",
    url: "/portfolio",
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[] }>;
}): Promise<Metadata> {
  const locale = await getPortfolioLocale(searchParams);
  return {
    ...englishMetadata,
    title: locale === "zh-TW" ? "工程作品集" : "Engineering Portfolio",
    description:
      locale === "zh-TW"
        ? "陳鼎元的作品集，收錄資料工程、後端開發、AI 應用與競賽專案，介紹開發過程、個人貢獻與技術取捨。"
        : englishMetadata.description,
    alternates: {
      canonical: portfolioHref("/portfolio", locale),
      languages: { en: "/portfolio?lang=en", "zh-TW": "/portfolio?lang=zh-TW" },
    },
    openGraph: {
      title:
        locale === "zh-TW"
          ? "陳鼎元 — 工程作品集"
          : "Ding-Yuan Chen — Engineering Portfolio",
      description:
        locale === "zh-TW"
          ? "資料工程、後端開發、AI 應用與競賽專案。"
          : "Building reliable data systems and intelligent applications.",
      url: portfolioHref("/portfolio", locale),
      locale: locale === "zh-TW" ? "zh_TW" : "en_US",
    },
  };
}
export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const [resumeUrl, locale, documents] = await Promise.all([
    getResumeUrl(),
    getPortfolioLocale(searchParams),
    getPublicProjectDocuments(),
  ]);
  const zh = locale === "zh-TW";
  const t = (en: string, chinese: string) => (zh ? chinese : en);
  const selectedProjects = documents.filter((document) => document.en.featured);
  const experiences = [
    {
      period: "2025.09 —",
      title: t("Calculus Teaching Assistant", "微積分課程助教"),
      context: t("NTU Information Management", "臺大資訊管理學系"),
    },
    {
      period: "2025.09 —",
      title: t("Student Association · Information Team", "系學會資訊部"),
      context: t("Website development & maintenance", "系上網站開發與維護"),
    },
    {
      period: "2025.08",
      title: t("Orientation Camp Deputy Coordinator", "迎新宿營副總召"),
      context: t("3 days · Around 100 participants", "三天兩夜・約 100 人"),
    },
  ];
  return (
    <HomeThemeSwitcher locale={locale}>
      <div className="site-container">
        <Navbar resumeUrl={resumeUrl} locale={locale} />
        <main id="main-content" className="portfolio-home">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Ding-Yuan Chen",
                alternateName: "陳鼎元",
                url: siteUrl,
                image: `${siteUrl}/Personal_photo.jpg`,
                sameAs: [
                  "https://github.com/CdyTim630",
                  "https://www.linkedin.com/in/cdytim",
                ],
                affiliation: {
                  "@type": "CollegeOrUniversity",
                  name: "National Taiwan University",
                },
              }).replace(/</g, "\\u003c"),
            }}
          />
          <section className="portfolio-hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <p className="availability-pill">
                <span /> {t("OPEN TO INTERNSHIPS", "尋找工程實習機會")}
              </p>
              <p className="hero-identity">
                {t("Ding-Yuan Chen", "陳鼎元")} <span> / </span>{" "}
                {t("NTU Information Management", "臺大資訊管理學系")}
              </p>
              <h1 id="hero-title">
                {t("Curious mind.", "研究問題，")}
                <br />
                <span className="gradient-ink">
                  {t("Hands-on builder.", "動手實作。")}
                </span>
              </h1>
              <p className="hero-intro">
                {t(
                  "Building useful software with data, backend systems and applied AI.",
                  "用資料、後端開發與 AI，把想法做成好用的作品。",
                )}
              </p>
              <div className="hero-actions">
                <Link
                  className="button-primary"
                  href={portfolioHref("/projects", locale)}
                >
                  {t("View projects", "查看作品")} <Icon name="external" />
                </Link>
                <a
                  className="button-secondary"
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("Download resume", "查看履歷")}
                </a>
              </div>
            </div>
            <div className="hero-studio">
              <figure className="studio-portrait">
                <div className="studio-photo">
                  <Image
                    src="/Personal_photo.jpg"
                    alt={t("Ding-Yuan Chen", "陳鼎元的個人照片")}
                    width={864}
                    height={1152}
                    loading="eager"
                    fetchPriority="high"
                    sizes="(max-width: 760px) 240px, 300px"
                  />
                </div>
              </figure>
            </div>
          </section>
          <section className="portfolio-section" id="projects">
            <SectionHeading
              title={t("Selected work", "精選專案")}
            >
              <Link
                className="text-link"
                href={portfolioHref("/projects", locale)}
              >
                {t("All projects", "所有作品")} <Icon />
              </Link>
            </SectionHeading>
            <div className="projects-grid">
              {selectedProjects.map((document, index) => document.archived ? (
                <FeaturedArchiveCard
                  key={document.slug}
                  project={projectArchiveEntry(document, locale)}
                  meta={projectGalleryEntry(document)}
                  cover={projectForLocale(document, locale).images[0]}
                  visual={projectForLocale(document, locale).visual}
                  index={index}
                  locale={locale}
                />
              ) : (
                <ProjectCard
                  key={document.slug}
                  project={projectForLocale(document, locale)}
                  index={index}
                  locale={locale}
                />
              ))}
            </div>
          </section>
          <ProjectRecognition locale={locale} publishedSlugs={documents.map(document => document.slug)} />
          <section
            className="portfolio-section collection-section"
            id="collections"
          >
            <SectionHeading
              title={t("Explore by field", "依領域探索")}
            >
              <Link
                className="text-link"
                href={portfolioHref("/projects#more-work", locale)}
              >
                {t("Explore all", "查看全部")} <Icon />
              </Link>
            </SectionHeading>
            <div className="collection-folders">
              {projectCollections.map((collection) => (
                <Link
                  className="collection-folder"
                  data-category={collection.id}
                  key={collection.id}
                  href={portfolioHref(
                    `/projects#collection-${collection.id}`,
                    locale,
                  )}
                >
                  <CollectionFolderArtwork category={collection.id} />
                  <div className="folder-label">
                    <h3>{collection.label[zh ? "zh" : "en"]}</h3>
                    <span className="folder-count">
                      {
                        documents.filter(
                          (project) => project.archived && project.collection === collection.id,
                        ).length
                      }{" "}
                      {t("projects", "件作品")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
          <section className="portfolio-section glance-section" id="about">
            <SectionHeading
              title={t("Beyond the projects", "關於我")}
            />
            <div className="glance-grid">
              <div className="glance-intro">
                <p>
                  {t(
                    "I study Information Management at NTU and build with data, backend systems and AI. Along the way, I teach, organize and learn with others.",
                    "除了專案開發，我也擔任微積分助教、參與系學會網站維護，並協助籌辦迎新宿營。",
                  )}
                </p>
                <div className="glance-links">
                  <a
                    className="text-link"
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("My resume", "完整履歷")} <Icon name="download" />
                  </a>
                  <Link className="text-link" href="/blog">
                    {t("My notes", "生活與筆記")} <Icon />
                  </Link>
                </div>
              </div>
              <div
                className="glance-timeline"
                aria-label={t("Experience", "經歷")}
              >
                {experiences.map((experience) => (
                  <article key={experience.title}>
                    <span>{experience.period}</span>
                    <div>
                      <h3>{experience.title}</h3>
                      <p>{experience.context}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
          <section className="contact-section" id="contact" aria-labelledby="contact-title">
            <div className="contact-content">
              <div className="contact-intro">
                <span className="contact-symbol" aria-hidden="true"><ContactIcon name="chat" /></span>
                <h2 id="contact-title">
                  {t("Let’s connect.", "歡迎聊聊。")}
                </h2>
                <p>
                  {t(
                    "For internships, collaborations, or just a quick hello.",
                    "實習機會、專案合作，或只是打聲招呼。",
                  )}
                </p>
              </div>
              <div className="contact-options">
                <a className="contact-email" href="mailto:b13705020@ntu.edu.tw">
                  <span className="contact-email-icon"><Icon name="mail" /></span>
                  <span>b13705020@ntu.edu.tw</span>
                  <Icon />
                </a>
                <nav className="contact-links" aria-label={t("Social profiles and resume", "社群與履歷")}>
                  <a
                    data-contact="github"
                    href="https://github.com/CdyTim630"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ContactIcon name="github" />
                    <span>GitHub</span>
                  </a>
                  <a
                    data-contact="linkedin"
                    href="https://www.linkedin.com/in/cdytim"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ContactIcon name="linkedin" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    data-contact="instagram"
                    href="https://instagram.com/cdy.tim"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ContactIcon name="instagram" />
                    <span>Instagram</span>
                  </a>
                  <a data-contact="resume" href={resumeUrl} target="_blank" rel="noreferrer">
                    <ContactIcon name="resume" />
                    <span>{t("Resume", "履歷")}</span>
                  </a>
                </nav>
              </div>
            </div>
          </section>
        </main>
        <SiteFooter locale={locale} compact />
      </div>
    </HomeThemeSwitcher>
  );
}
