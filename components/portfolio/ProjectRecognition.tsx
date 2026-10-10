import Link from "next/link";
import { portfolioHref, type PortfolioLocale } from "@/lib/portfolio-locale";
import Icon from "./Icon";
import styles from "./ProjectRecognition.module.css";

const awards = [
  {
    slug: "sigmile", project: "SIGmile", rank: 1,
    competition: { en: "Uni-President Business Competition", zh: "統一商業競賽" },
    division: { en: "J-Sheng track", zh: "捷盛運輸組" },
    result: { en: "Champion", zh: "冠軍" },
  },
  {
    slug: "employa", project: "EmploYA", rank: 2,
    competition: { en: "YTP Hackathon", zh: "YTP 黑客松" },
    division: { en: "Youth division", zh: "青年組" },
    result: { en: "Runner-up", zh: "亞軍" },
  },
] as const;

function AwardMedal({ rank }: { rank: number }) {
  return <div className={styles.medal} aria-hidden="true">
    <svg viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="48" r="35" className={styles.medalRing} />
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M43 82C16 71 12 48 25 24M57 82C84 71 88 48 75 24" />
        <path d="M21 37C13 33 15 24 22 20C26 25 26 32 21 37ZM18 49C9 46 9 38 14 32C20 36 22 42 18 49ZM21 62C11 62 8 54 11 47C18 49 23 53 21 62ZM28 73C18 77 12 70 12 63C20 62 27 66 28 73ZM40 82C31 89 23 86 20 79C28 75 35 77 40 82" />
        <path d="M79 37C87 33 85 24 78 20C74 25 74 32 79 37ZM82 49C91 46 91 38 86 32C80 36 78 42 82 49ZM79 62C89 62 92 54 89 47C82 49 77 53 79 62ZM72 73C82 77 88 70 88 63C80 62 73 66 72 73ZM60 82C69 89 77 86 80 79C72 75 65 77 60 82" />
      </g>
    </svg>
    <span>{rank}<small>{rank === 1 ? "st" : "nd"}</small></span>
  </div>;
}

export default function ProjectRecognition({ locale, publishedSlugs }: { locale: PortfolioLocale; publishedSlugs: string[] }) {
  const language = locale === "zh-TW" ? "zh" : "en";
  const visible = awards.filter(award => publishedSlugs.includes(award.slug));
  if (!visible.length) return null;
  return <section id="recognition" className={styles.section} aria-labelledby="recognition-title">
    <header className={styles.header}>
      <h2 id="recognition-title">{language === "zh" ? "獲獎紀錄" : "Recognition"}</h2>
      <p>{language === "zh" ? "團隊競賽成果" : "Team achievements"}</p>
    </header>
    <div className={styles.grid}>
      {visible.map(award => <Link key={award.slug} href={portfolioHref(`/projects/${award.slug}`, locale)} className={styles.card} data-rank={award.rank}>
        <div className={styles.cardHeader}><span>{award.project}</span><span>2026</span></div>
        <div className={styles.main}>
          <AwardMedal rank={award.rank} />
          <div className={styles.copy}>
            <p className={styles.result}>{award.result[language]}</p>
            <h3>{award.competition[language]}</h3>
            <p className={styles.division}>{award.division[language]}</p>
          </div>
        </div>
        <div className={styles.footer}><span>{language === "zh" ? "閱讀獲獎專案" : "Explore the project"}</span><Icon /></div>
      </Link>)}
    </div>
  </section>;
}
