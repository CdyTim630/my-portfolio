import type { ProjectCollectionId } from "@/lib/project-collections";
import styles from "./CollectionFolderArtwork.module.css";

function CollectionMark({ category }: { category: ProjectCollectionId }) {
  switch (category) {
    case "products":
      return <><path d="m7 17 10-9 10 9M17 8v19" /><circle cx="7" cy="17" r="3" /><circle cx="17" cy="8" r="3" /><circle cx="27" cy="17" r="3" /><circle cx="17" cy="27" r="3" /></>;
    case "data":
      return <><path d="M5 27V17h5v10M15 27V7h5v20M25 27V12h5v15M4 27h27" /></>;
    case "systems":
      return <><path d="m17 4 12 7v14l-12 7-12-7V11Z M5 11l12 7 12-7M17 18v14" /></>;
    case "community":
      return <><circle cx="12" cy="11" r="4" /><path d="M4 27v-3a8 8 0 0 1 16 0v3M23 7a4 4 0 0 1 0 8M25 19a7 7 0 0 1 6 7" /></>;
    case "play":
      return <><path d="m10 6 18 11-18 11Z" /><path d="M4 11v12" /></>;
  }
}

/** A single open folder, with the same fine-line language as project artwork. */
export default function CollectionFolderArtwork({ category }: { category: ProjectCollectionId }) {
  return (
    <svg className={styles.artwork} data-category={category} viewBox="0 0 220 148" fill="none" aria-hidden="true" focusable="false">
      <path className={styles.back} d="M25 126c-6.6 0-12-5.4-12-12V30c0-6.6 5.4-12 12-12h47c4 0 6.5 1.4 9.2 4.4L91 33h97c6.6 0 12 5.4 12 12v69c0 6.6-5.4 12-12 12Z" />
      <path className={styles.tab} d="M27 30h38" />
      <path className={styles.front} d="M26 50h169c7.7 0 13.3 7.1 11.5 14.6L194 117c-1.3 5.3-6 9-11.5 9H25c-6.6 0-12-5.4-12-12V63c0-7.2 5.8-13 13-13Z" />
      <g className={styles.mark} transform="translate(29 72)">
        <CollectionMark category={category} />
      </g>
      <path className={styles.rule} d="M143 105h28" />
    </svg>
  );
}
