// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

vi.mock("@/lib/local-admin", () => ({ isLocalAdminEnabled: vi.fn() }));
vi.mock("node:fs/promises", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs/promises")>();
  return { ...actual, rename: vi.fn(actual.rename) };
});

import { isLocalAdminEnabled } from "@/lib/local-admin";
import { createLocalProjectStore, LocalProjectStoreError } from "@/lib/local-project-store";
import { seedProjectDocuments } from "@/lib/project-cms-seeds";

function document(slug?: string) {
  const value = structuredClone(seedProjectDocuments[0]);
  if (slug) value.slug = value.en.slug = value.zh.slug = slug;
  return value;
}

describe("local project storage", () => {
  let directory: string;
  let filePath: string;
  let store: ReturnType<typeof createLocalProjectStore>;

  beforeEach(async () => {
    vi.mocked(isLocalAdminEnabled).mockReturnValue(true);
    directory = await mkdtemp(join(tmpdir(), "portfolio-project-store-"));
    filePath = join(directory, "projects.json");
    store = createLocalProjectStore(filePath);
  });

  afterEach(async () => { await rm(directory, { recursive: true, force: true }); });

  it("starts with the reviewed catalog without creating or modifying data", async () => {
    const catalog = await store.getCatalog();
    expect(catalog.available).toBe(true);
    expect(catalog.entries).toHaveLength(20);
    expect(catalog.entries.every((entry) => entry.status === "seed")).toBe(true);
    expect(await store.getPublishedDocuments()).toHaveLength(20);
    expect(await readdir(directory)).toEqual([]);
  });

  it("persists draft edits across store reloads without leaking into published content", async () => {
    const draft = document();
    draft.en.title = "Local draft title";
    const entry = await store.save("save", draft);
    expect(entry.status).toBe("draft");
    expect(entry.hasDraftChanges).toBe(true);
    const reloaded = createLocalProjectStore(filePath);
    expect((await reloaded.getCatalog()).entries.find((item) => item.document.slug === draft.slug)?.document.en.title).toBe("Local draft title");
    expect((await reloaded.getPublishedDocuments()).find((item) => item.slug === draft.slug)?.en.title).toBe(seedProjectDocuments[0].en.title);
  });

  it("keeps published snapshots separate from subsequent draft changes", async () => {
    const draft = document();
    draft.en.title = "Published version";
    const published = await store.save("publish", draft);
    expect(published.status).toBe("published");
    expect(published.hasDraftChanges).toBe(false);
    draft.en.title = "Next draft";
    await store.save("save", draft);
    const reloaded = createLocalProjectStore(filePath);
    expect((await reloaded.getPublishedDocuments()).find((item) => item.slug === draft.slug)?.en.title).toBe("Published version");
    const entry = (await reloaded.getCatalog()).entries.find((item) => item.document.slug === draft.slug);
    expect(entry?.document.en.title).toBe("Next draft");
    expect(entry?.publishedDocument?.en.title).toBe("Published version");
    expect(entry?.hasDraftChanges).toBe(true);
  });

  it("persists unpublish tombstones for seed works and can publish them again", async () => {
    const draft = document();
    draft.en.title = "Hidden work";
    const hidden = await store.save("unpublish", draft);
    expect(hidden.status).toBe("unpublished");
    expect(hidden.publishedDocument).toBe(null);
    const reloaded = createLocalProjectStore(filePath);
    expect((await reloaded.getPublishedDocuments()).some((item) => item.slug === draft.slug)).toBe(false);
    expect((await reloaded.getCatalog()).entries.find((item) => item.document.slug === draft.slug)?.document.en.title).toBe("Hidden work");
    await reloaded.save("publish", draft);
    expect((await store.getPublishedDocuments()).find((item) => item.slug === draft.slug)?.en.title).toBe("Hidden work");
  });

  it("only adds new works to the public collection after publication", async () => {
    const draft = document("new-local-work");
    await store.save("save", draft);
    expect((await store.getCatalog()).entries).toHaveLength(21);
    expect(await store.getPublishedDocuments()).toHaveLength(20);
    await store.save("publish", draft);
    expect(await store.getPublishedDocuments()).toHaveLength(21);
  });

  it("serializes concurrent writes from multiple instances sharing a path", async () => {
    const stores = [store, createLocalProjectStore(filePath), createLocalProjectStore(filePath)];
    const documents = Array.from({ length: 12 }, (_, index) => document(`concurrent-work-${index}`));
    await Promise.all(documents.map((draft, index) => stores[index % stores.length].save("publish", draft)));
    const catalog = await store.getCatalog();
    const published = await store.getPublishedDocuments();
    for (const draft of documents) {
      expect(catalog.entries.some((entry) => entry.document.slug === draft.slug)).toBe(true);
      expect(published.some((entry) => entry.slug === draft.slug)).toBe(true);
    }
    expect(await readdir(directory)).toEqual(["projects.json"]);
  });

  it.each([
    ["malformed JSON", "{broken"],
    ["unsupported version", JSON.stringify({ version: 2, drafts: [], published: [] })],
    ["invalid content", JSON.stringify({ version: 1, drafts: [], published: [{ slug: "bad-project", content: {} }] })],
    ["duplicate rows", JSON.stringify({ version: 1, drafts: [], published: [{ slug: "duplicate", content: null }, { slug: "duplicate", content: null }] })],
  ])("rejects %s without silently resetting or overwriting the file", async (_name, contents) => {
    await writeFile(filePath, contents);
    await expect(store.getCatalog()).rejects.toThrow(LocalProjectStoreError);
    await expect(store.getPublishedDocuments()).rejects.toThrow("invalid");
    await expect(store.save("save", document())).rejects.toThrow("invalid");
    expect(await readFile(filePath, "utf8")).toBe(contents);
  });

  it("preserves the previous file on replacement failure and permits a later retry", async () => {
    const draft = document();
    await store.save("publish", draft);
    const previous = await readFile(filePath, "utf8");
    draft.en.title = "New version";
    vi.mocked(rename).mockRejectedValueOnce(new Error("Disk unavailable"));
    await expect(store.save("publish", draft)).rejects.toThrow("previous data file was preserved");
    expect(await readFile(filePath, "utf8")).toBe(previous);
    expect(await readdir(directory)).toEqual(["projects.json"]);
    await store.save("publish", draft);
    expect((await store.getPublishedDocuments()).find((item) => item.slug === draft.slug)?.en.title).toBe("New version");
  });

  it("validates publication while allowing an unfinished draft", async () => {
    const draft = document();
    draft.en.summary = "";
    await store.save("save", draft);
    const previous = await readFile(filePath, "utf8");
    await expect(store.save("publish", draft)).rejects.toThrow("summary");
    expect(await readFile(filePath, "utf8")).toBe(previous);
  });

  it("blocks reading and writing when local mode is disabled", async () => {
    await store.save("save", document());
    const previous = await readFile(filePath, "utf8");
    vi.mocked(isLocalAdminEnabled).mockReturnValue(false);
    await expect(store.getCatalog()).rejects.toThrow("disabled");
    await expect(store.getPublishedDocuments()).rejects.toThrow("disabled");
    await expect(store.save("publish", document())).rejects.toThrow("disabled");
    expect(await readFile(filePath, "utf8")).toBe(previous);
  });
});
