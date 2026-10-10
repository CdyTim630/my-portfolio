"use client";
import { useState, type ReactNode } from "react";
import type { ProjectCategory } from "@/lib/projects";
import { categoryLabel, type PortfolioLocale } from "@/lib/portfolio-locale";
const filters = [
  "All",
  "Backend",
  "Data",
  "AI",
  "Full-stack",
  "Frontend",
] as const;
export default function ProjectFilter({
  entries,
  locale = "en",
}: {
  locale?: PortfolioLocale;
  entries: { slug: string; category: ProjectCategory[]; card: ReactNode }[];
}) {
  const zh = locale === "zh-TW";
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const visible = entries.filter(
    (entry) => filter === "All" || entry.category.includes(filter),
  );
  return (
    <>
      <div className="filter-bar">
        <div
          className="filter-buttons"
          role="group"
          aria-label={zh ? "依領域篩選專案" : "Filter projects by domain"}
        >
          {filters.map((value) => (
            <button
              key={categoryLabel(value, locale)}
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
            >
              {categoryLabel(value, locale)}
            </button>
          ))}
        </div>
        <p className="filter-count" role="status">
          {visible.length}{" "}
          {zh ? "個專案" : visible.length === 1 ? "project" : "projects"}
        </p>
      </div>
      <div className="projects-grid">
        {visible.map((entry) => (
          <div key={entry.slug}>{entry.card}</div>
        ))}
      </div>
      {!visible.length && (
        <p className="empty-state">
          {zh
            ? "目前沒有這個領域的專案。"
            : "No published projects in this domain yet."}
        </p>
      )}
    </>
  );
}
