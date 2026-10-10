"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import type { PortfolioLocale } from "@/lib/portfolio-locale";
import CollectionFolderArtwork from "./CollectionFolderArtwork";
import {
  projectCollections,
  type ProjectCollectionId,
} from "@/lib/project-collections";

type SearchEntry = {
  id: string;
  category: ProjectCollectionId;
  title: { en: string; zh: string };
  summary: { en: string; zh: string };
  tags: string[];
  card: ReactNode;
};
const normalize = (value: string) => value.normalize("NFKC").toLowerCase();

export default function ArchiveSearch({
  entries,
  locale,
}: {
  entries: SearchEntry[];
  locale: PortfolioLocale;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProjectCollectionId | "all">("all");
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const zh = locale === "zh-TW";
  const language = zh ? "zh" : "en";
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const selected = entries.filter(
    (entry) => category === "all" || entry.category === category,
  );
  const visible = selected.filter((entry) => {
    const searchable = normalize(
      [
        entry.title.en,
        entry.title.zh,
        entry.summary.en,
        entry.summary.zh,
        ...entry.tags,
      ].join(" "),
    );
    return terms.every((term) => searchable.includes(term));
  });
  function clearSearch() {
    setQuery("");
    input.current?.focus();
  }

  return (
    <>
      <div className="catalog-controls">
        <div
          className="collection-tabs"
          role="group"
          aria-label={zh ? "依分類瀏覽作品" : "Browse project categories"}
        >
          <button
            type="button"
            data-category="all"
            aria-pressed={category === "all"}
            onClick={() => setCategory("all")}
          >
            <span>{zh ? "全部作品" : "All work"}</span>
          </button>
          {projectCollections.map((collection) => (
            <button
              type="button"
              key={collection.id}
              data-category={collection.id}
              aria-pressed={category === collection.id}
              onClick={() => setCategory(collection.id)}
            >
              <span>{collection.label[language]}</span>
            </button>
          ))}
        </div>
        <div className="catalog-toolbar">
          <div className="catalog-search">
            <label className="gallery-visually-hidden" htmlFor={`${id}-search`}>
              {zh ? "搜尋更多作品" : "Search more projects"}
            </label>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            <input
              ref={input}
              id={`${id}-search`}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                zh ? "搜尋名稱、技術…" : "Search titles, technologies…"
              }
              aria-controls={`${id}-results`}
            />
            {query && (
              <button type="button" onClick={clearSearch}>
                {zh ? "清除" : "Clear"}
              </button>
            )}
          </div>
          <p className="archive-result-count" role="status" aria-atomic="true">
            {zh
              ? `${visible.length} 項作品`
              : `${visible.length} projects`}
          </p>
        </div>
      </div>
      <div id={`${id}-results`}>
        {projectCollections.map((collection) => {
          const group = visible.filter(
            (entry) => entry.category === collection.id,
          );
          if (!group.length) return null;
          return (
            <section
              className="archive-collection"
              id={`collection-${collection.id}`}
              data-category={collection.id}
              key={collection.id}
              aria-labelledby={`${id}-${collection.id}`}
            >
              <header className="collection-heading">
                <div className="collection-heading-art">
                  <CollectionFolderArtwork category={collection.id} />
                </div>
                <h3 id={`${id}-${collection.id}`}>
                  {collection.label[language]}
                </h3>
                <p className="collection-count">
                  <span>{String(group.length).padStart(2, "0")}</span>
                  {zh ? "項專案" : "projects"}
                </p>
              </header>
              <div className="gallery-grid">
                {group.map((entry) => (
                  <div className="gallery-item" key={entry.id}>
                    {entry.card}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
        {!visible.length && (
          <p className="archive-search-empty">
            {zh
              ? "這個分類裡沒有符合的作品，試試其他關鍵字或分類。"
              : "No matches in this collection. Try another keyword or category."}
          </p>
        )}
      </div>
    </>
  );
}
