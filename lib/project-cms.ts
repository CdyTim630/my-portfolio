import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createPublicClient } from "./supabase/public";
import { isLocalAdminEnabled } from "./local-admin";
import { seedProjectDocuments } from "./project-cms-seeds";
import { compareProjectDocuments, createProjectAdminCatalog, createSeedProjectCatalog, mergePublicProjectRows, type ProjectStorageRow } from "./project-cms-catalog";
import type { ProjectAdminEntry, ProjectDocument } from "./project-cms-types";

export { createProjectAdminEntry, mergePublicProjectRows, type ProjectStorageRow } from "./project-cms-catalog";

const columns = "slug,content,updated_at";

/** Request-scoped cache: this reader never inherits admin cookies or queries drafts. */
export const getPublicProjectDocuments = cache(async (): Promise<ProjectDocument[]> => {
  if (isLocalAdminEnabled()) {
    const { getLocalPublishedProjectDocuments } = await import("./local-project-store");
    try { return await getLocalPublishedProjectDocuments(); } catch { return []; }
  }
  const supabase = createPublicClient();
  if (!supabase) return [...seedProjectDocuments].sort(compareProjectDocuments);
  try {
    const { data, error } = await supabase.from("portfolio_projects").select(columns);
    if (error) {
      // Before the migration, the reviewed repository collection is still the source.
      // Other failures must not resurrect a project the administrator unpublished.
      return error.code === "42P01" || error.code === "PGRST205" ? [...seedProjectDocuments].sort(compareProjectDocuments) : [];
    }
    return mergePublicProjectRows((data ?? []) as ProjectStorageRow[]);
  } catch { return []; }
});

export async function getAdminProjectCatalog(supabase: SupabaseClient): Promise<{ entries: ProjectAdminEntry[]; available: boolean }> {
  try {
    const [drafts, published] = await Promise.all([
      supabase.from("portfolio_project_drafts").select(columns),
      supabase.from("portfolio_projects").select(columns),
    ]);
    if (drafts.error || published.error) return { entries: createSeedProjectCatalog(), available: false };
    return { entries: createProjectAdminCatalog((drafts.data ?? []) as ProjectStorageRow[], (published.data ?? []) as ProjectStorageRow[]), available: true };
  } catch { return { entries: createSeedProjectCatalog(), available: false }; }
}
