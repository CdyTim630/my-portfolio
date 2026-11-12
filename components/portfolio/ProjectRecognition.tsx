import Link from "next/link";
import { portfolioHref, type PortfolioLocale } from "@/lib/portfolio-locale";
import Icon from "./Icon";
import styles from "./ProjectRecognition.module.css";

const awards = [
  {
    slug: "sigmile", project: "SIGmile", rank: 1, year: 2026,
    competition: { en: "Uni-President Business Competition", zh: "統一商業競賽" },
    division: { en: "J-Sheng track", zh: "捷盛運輸組" },
    result: { en: "Champion", zh: "冠軍" },
  },
  {
    slug: "employa", project: "EmploYA", rank: 2, year: 2026,
    competition: { en: "YTP Hackathon", zh: "YTP 黑客松" },
    division: { en: "Youth division", zh: "青年組" },
    result: { en: "Runner-up", zh: "亞軍" },
  },
] as const;

function Medal({ rank }: { rank: number }) {
  return (
    <div className={styles.medal} aria-hidden="true">
      <span className={styles.ribbon} />
      <span className={styles.disc}>
        <span className={styles.rank}>
          {rank}
          <small>{rank === 1 ? "st" : "nd"}</small>
        </span>
      </span>
    </div>
  );
}

export function recognitionCount(publishedSlugs: string[]) {
  return awards.filter(award => publishedSlugs.includes(award.slug)).length;
}

export default function ProjectRecognition({ locale, publishedSlugs }: { locale: PortfolioLocale; publishedSlugs: string[] }) {
  const language = locale === "zh-TW" ? "zh" : "en";
  const visible = awards.filter(award => publishedSlugs.includes(award.slug));
  if (!visible.length) return null;
  return <section id="recognition" className={styles.section} aria-labelledby="recognition-title">
    <header className={styles.header}>
      <h2 id="recognition-title">{language === "zh" ? "獲獎紀錄" : "Recognition"}</h2>
      <span className="section-rule" aria-hidden="true" />
      <p>{language === "zh" ? "團隊競賽成果" : "Team achievements"}</p>
    </header>
    <div className={styles.grid}>
      {visible.map(award => (
        <Link
          key={award.slug}
          href={portfolioHref(`/projects/${award.slug}`, locale)}
          className={styles.card}
          data-rank={award.rank}
        >
          <span className={styles.watermark} aria-hidden="true">{String(award.rank).padStart(2, "0")}</span>
          <Medal rank={award.rank} />
          <div className={styles.body}>
            <p className={styles.result}>
              {award.result[language]}
              <span aria-hidden="true">·</span>
              <span className={styles.year}>{award.year}</span>
            </p>
            <h3>{award.competition[language]}</h3>
            <p className={styles.division}>{award.division[language]}</p>
            <span className={styles.project}>
              <span>
                <small>{language === "zh" ? "獲獎專案" : "Winning project"}</small>
                <strong>{award.project}</strong>
              </span>
              <Icon />
            </span>
          </div>
        </Link>
      ))}
    </div>
  </section>;
}
