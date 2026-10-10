import { seedProjectDocuments } from "./project-cms-seeds";
import { parseProjectDocument } from "./project-cms-validation";
import type { ProjectAdminEntry, ProjectDocument } from "./project-cms-types";

export type ProjectStorageRow = { slug: string; content: unknown; updated_at?: string };
const seeds = new Map(seedProjectDocuments.map((document) => [document.slug, document]));
export const compareProjectDocuments = (a: ProjectDocument, b: ProjectDocument) => a.sortOrder - b.sortOrder || a.slug.localeCompare(b.slug);

function readDocument(row: ProjectStorageRow, publish = false): ProjectDocument {
  const document = parseProjectDocument(row.content, publish);
  if (document.slug !== row.slug) throw new Error("Stored project slug mismatch.");
  return document;
}

/** A stored row always wins, including a null tombstone or invalid content. */
export function mergePublicProjectRows(rows: ProjectStorageRow[]): ProjectDocument[] {
  const merged = new Map(seeds);
  for (const row of rows) {
    merged.delete(row.slug);
    if (row.content === null) continue;
    try { merged.set(row.slug, readDocument(row, true)); } catch { /* Fail closed for invalid published content. */ }
  }
  return [...merged.values()].sort(compareProjectDocuments);
}

export function createProjectAdminEntry(slug: string, draft?: ProjectStorageRow | null, published?: ProjectStorageRow | null): ProjectAdminEntry | null {
  const liveDocument = published ? (published.content === null ? null : readDocument(published, true)) : seeds.get(slug) ?? null;
  const document = draft ? readDocument(draft) : liveDocument ?? seeds.get(slug);
  if (!document) return null;
  return {
    document,
    status: published ? (published.content === null ? "unpublished" : "published") : draft ? "draft" : "seed",
    hasDraftChanges: !!draft && JSON.stringify(document) !== JSON.stringify(liveDocument ? parseProjectDocument(liveDocument) : null),
    ...(draft?.updated_at || published?.updated_at ? { updatedAt: draft?.updated_at ?? published?.updated_at } : {}),
    publishedDocument: liveDocument,
  };
}

export function createSeedProjectCatalog(): ProjectAdminEntry[] {
  return seedProjectDocuments.map((document) => ({ document, status: "seed", hasDraftChanges: false, publishedDocument: document }));
}

export function createProjectAdminCatalog(drafts: ProjectStorageRow[], published: ProjectStorageRow[]): ProjectAdminEntry[] {
  const draftMap = new Map(drafts.map((row) => [row.slug, row]));
  const publishedMap = new Map(published.map((row) => [row.slug, row]));
  const slugs = new Set([...seeds.keys(), ...draftMap.keys(), ...publishedMap.keys()]);
  return [...slugs].flatMap((slug) => {
    const entry = createProjectAdminEntry(slug, draftMap.get(slug), publishedMap.get(slug));
    return entry ? [entry] : [];
  }).sort((a, b) => compareProjectDocuments(a.document, b.document));
}
