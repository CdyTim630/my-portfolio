import { randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, unlink } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { isLocalAdminEnabled } from "./local-admin";
import { createProjectAdminCatalog, createProjectAdminEntry, mergePublicProjectRows, type ProjectStorageRow } from "./project-cms-catalog";
import type { ProjectAction, ProjectAdminEntry, ProjectDocument } from "./project-cms-types";
import { parseProjectDocument, parseProjectMutation, parseProjectSlug } from "./project-cms-validation";

type Snapshot = { version: 1; drafts: ProjectStorageRow[]; published: ProjectStorageRow[] };
const queueKey = Symbol.for("my-portfolio.local-project-writes");

export class LocalProjectStoreError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "LocalProjectStoreError";
  }
}

function assertEnabled() {
  if (!isLocalAdminEnabled()) throw new LocalProjectStoreError("Local project storage is disabled.");
}

function parseRows(value: unknown, published: boolean): ProjectStorageRow[] {
  if (!Array.isArray(value)) throw new Error("Project rows must be an array.");
  const slugs = new Set<string>();
  return value.map((raw: unknown) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Invalid project row.");
    const row = raw as Record<string, unknown>;
    if (Object.keys(row).some((key) => !["slug", "content", "updated_at"].includes(key))) throw new Error("Unexpected project row field.");
    const slug = parseProjectSlug(row.slug);
    if (slugs.has(slug)) throw new Error("Duplicate project row.");
    slugs.add(slug);
    const content = published && row.content === null ? null : parseProjectDocument(row.content, published);
    if (content && content.slug !== slug) throw new Error("Stored project slug mismatch.");
    if (row.updated_at !== undefined && (typeof row.updated_at !== "string" || !Number.isFinite(Date.parse(row.updated_at)))) throw new Error("Invalid project timestamp.");
    return { slug, content, ...(typeof row.updated_at === "string" ? { updated_at: row.updated_at } : {}) };
  });
}

function parseSnapshot(raw: string): Snapshot {
  const snapshot: unknown = JSON.parse(raw);
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) throw new Error("Invalid project snapshot.");
  const record = snapshot as Record<string, unknown>;
  if (record.version !== 1 || Object.keys(record).some((key) => !["version", "drafts", "published"].includes(key))) throw new Error("Unsupported project snapshot.");
  return { version: 1, drafts: parseRows(record.drafts, false), published: parseRows(record.published, true) };
}

function serializeWrite<T>(path: string, operation: () => Promise<T>): Promise<T> {
  // Next development reloads can create multiple module instances. Share their queue.
  const registry = globalThis as unknown as Record<symbol, Map<string, Promise<void>> | undefined>;
  const queues = registry[queueKey] ??= new Map();
  const result = (queues.get(path) ?? Promise.resolve()).then(operation);
  const settled = result.then(() => undefined, () => undefined);
  queues.set(path, settled);
  void settled.then(() => { if (queues.get(path) === settled) queues.delete(path); });
  return result;
}

/** Each store uses a fixed server-side path; request content never chooses a filename. */
export function createLocalProjectStore(filePath: string) {
  const path = resolve(filePath);

  async function readSnapshot(): Promise<Snapshot> {
    assertEnabled();
    let raw: string;
    try { raw = await readFile(path, "utf8"); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return { version: 1, drafts: [], published: [] };
      throw new LocalProjectStoreError("Unable to read local project data.", { cause: error });
    }
    try { return parseSnapshot(raw); }
    catch (error) { throw new LocalProjectStoreError("Local project data is invalid. Restore the data file before saving again.", { cause: error }); }
  }

  async function writeSnapshot(snapshot: Snapshot): Promise<void> {
    const temporaryPath = resolve(dirname(path), `.${basename(path)}.${process.pid}.${randomUUID()}.tmp`);
    try {
      await mkdir(dirname(path), { recursive: true, mode: 0o700 });
      const file = await open(temporaryPath, "wx", 0o600);
      try {
        await file.writeFile(`${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
        await file.sync();
      } finally { await file.close(); }
      // Same-directory replacement ensures readers see the entire old or new snapshot.
      await rename(temporaryPath, path);
    } catch (error) {
      throw new LocalProjectStoreError("Unable to save local project data. The previous data file was preserved.", { cause: error });
    } finally {
      await unlink(temporaryPath).catch(() => undefined);
    }
  }

  async function getCatalog(): Promise<{ entries: ProjectAdminEntry[]; available: true }> {
    const snapshot = await readSnapshot();
    return { entries: createProjectAdminCatalog(snapshot.drafts, snapshot.published), available: true };
  }

  async function getPublishedDocuments(): Promise<ProjectDocument[]> {
    return mergePublicProjectRows((await readSnapshot()).published);
  }

  async function save(action: ProjectAction, document: ProjectDocument): Promise<ProjectAdminEntry> {
    assertEnabled();
    const mutation = parseProjectMutation({ action, document });
    return serializeWrite(path, async () => {
      // Recheck the runtime gate after waiting for preceding writes.
      const snapshot = await readSnapshot();
      const updated_at = new Date().toISOString();
      const draft: ProjectStorageRow = { slug: mutation.document.slug, content: mutation.document, updated_at };
      const drafts = new Map(snapshot.drafts.map((row) => [row.slug, row]));
      const published = new Map(snapshot.published.map((row) => [row.slug, row]));
      drafts.set(draft.slug, draft);
      if (mutation.action !== "save") {
        published.set(draft.slug, { slug: draft.slug, content: mutation.action === "publish" ? mutation.document : null, updated_at });
      }
      const entry = createProjectAdminEntry(draft.slug, draft, published.get(draft.slug));
      if (!entry) throw new LocalProjectStoreError("Unable to verify the local project before saving.");
      await writeSnapshot({ version: 1, drafts: [...drafts.values()], published: [...published.values()] });
      return entry;
    });
  }

  return { getCatalog, getPublishedDocuments, save };
}

const localStore = createLocalProjectStore(resolve(process.cwd(), ".local-data", "projects.json"));
export const getLocalProjectCatalog = localStore.getCatalog;
export const getLocalPublishedProjectDocuments = localStore.getPublishedDocuments;
export const saveLocalProject = localStore.save;
