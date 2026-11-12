import Link from "next/link";
import type { ProjectCollectionId } from "@/lib/project-collections";
import Icon from "./Icon";
import styles from "./FieldExplorer.module.css";

export type FieldSummary = {
  id: ProjectCollectionId;
  href: string;
  label: string;
  note: string;
  projects: string[];
};

function FieldMark({ category }: { category: ProjectCollectionId }) {
  switch (category) {
    case "products":
      return <><path d="m7 17 10-9 10 9M17 8v19" /><circle cx="7" cy="17" r="3" /><circle cx="17" cy="8" r="3" /><circle cx="27" cy="17" r="3" /><circle cx="17" cy="27" r="3" /></>;
    case "data":
      return <path d="M5 27V17h5v10M15 27V7h5v20M25 27V12h5v15M4 27h27" />;
    case "systems":
      return <path d="m17 4 12 7v14l-12 7-12-7V11Z M5 11l12 7 12-7M17 18v14" />;
    case "community":
      return <><circle cx="12" cy="11" r="4" /><path d="M4 27v-3a8 8 0 0 1 16 0v3M23 7a4 4 0 0 1 0 8M25 19a7 7 0 0 1 6 7" /></>;
    case "play":
      return <><path d="m10 6 18 11-18 11Z" /><path d="M4 11v12" /></>;
  }
}

const PREVIEW_LIMIT = 3;

/** Folder-tab cards: what each field holds, before the visitor clicks in. */
export default function FieldExplorer({
  fields,
  zh,
}: {
  fields: FieldSummary[];
  zh: boolean;
}) {
  return (
    <div className={styles.grid}>
      {fields.map((field) => {
        const preview = field.projects.slice(0, PREVIEW_LIMIT);
        const more = field.projects.length - preview.length;
        return (
          <Link
            key={field.id}
            href={field.href}
            className={styles.card}
            data-category={field.id}
          >
            <span className={styles.tab} aria-hidden="true" />
            <div className={styles.top}>
              <span className={styles.icon} aria-hidden="true">
                <svg viewBox="0 0 34 34" fill="none">
                  <FieldMark category={field.id} />
                </svg>
              </span>
              <span className={styles.count}>
                <strong>{String(field.projects.length).padStart(2, "0")}</strong>
                <small>{zh ? "件作品" : field.projects.length === 1 ? "project" : "projects"}</small>
              </span>
            </div>
            <h3>{field.label}</h3>
            <p className={styles.note}>{field.note}</p>
            {preview.length > 0 && (
              <ul className={styles.projects}>
                {preview.map((title) => (
                  <li key={title}>{title}</li>
                ))}
                {more > 0 && (
                  <li className={styles.more}>
                    {zh ? `還有 ${more} 件` : `+${more} more`}
                  </li>
                )}
              </ul>
            )}
            <span className={styles.cta}>
              {zh ? "瀏覽此領域" : "Browse field"} <Icon />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
