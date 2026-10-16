// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/public", () => ({ createPublicClient: vi.fn() }));
vi.mock("@/lib/local-admin", () => ({ isLocalAdminEnabled: vi.fn() }));
vi.mock("@/lib/local-project-store", () => ({ getLocalPublishedProjectDocuments: vi.fn() }));

import { createPublicClient } from "@/lib/supabase/public";
import { isLocalAdminEnabled } from "@/lib/local-admin";
import { getLocalPublishedProjectDocuments } from "@/lib/local-project-store";
import { createBlankProjectDocument, seedProjectDocuments } from "@/lib/project-cms-seeds";
import { createProjectAdminEntry, getAdminProjectCatalog, getPublicProjectDocuments, mergePublicProjectRows } from "@/lib/project-cms";
import { isSafeProjectMediaUrl, parseProjectDocument, parseProjectMutation } from "@/lib/project-cms-validation";

function document() { return structuredClone(seedProjectDocuments[0]); }

describe("project content validation", () => {
  it("preserves all 20 reviewed works and their six current homepage picks", () => {
    expect(seedProjectDocuments).toHaveLength(20);
    expect(new Set(seedProjectDocuments.map((entry) => entry.slug)).size).toBe(20);
    expect(seedProjectDocuments.filter((entry) => entry.listed)).toHaveLength(8);
    expect(seedProjectDocuments.filter((entry) => entry.archived)).toHaveLength(17);
    expect(seedProjectDocuments.filter((entry) => entry.en.featured)).toHaveLength(6);
    for (const entry of seedProjectDocuments) expect(() => parseProjectDocument(entry, true)).not.toThrow();
  });

  it("does not invent dates for archive projects without a reviewed detail record", () => {
    expect(seedProjectDocuments.find((entry) => entry.slug === "internship-radar")?.en.year).toBe(0);
    const first = createBlankProjectDocument();
    first.en.sections.push({ id: "other", title: "Other", paragraphs: [] });
    expect(createBlankProjectDocument().en.sections).toHaveLength(1);
  });

  it("rejects unexpected nested fields, mismatched translations and duplicate anchors", () => {
    const extra = document();
    Object.assign(extra.en.images, { extra: true });
    expect(() => parseProjectMutation({ action: "publish", document: { ...extra, author_id: "other-user" } })).toThrow("Unexpected");
    expect(() => parseProjectDocument({ ...extra, en: { ...extra.en, admin: true } })).toThrow("Unexpected");
    const mismatch = document(); mismatch.zh.slug = "another-project";
    expect(() => parseProjectDocument(mismatch)).toThrow("translations");
    const duplicate = document(); duplicate.en.sections.push(duplicate.en.sections[0]);
    expect(() => parseProjectDocument(duplicate)).toThrow("unique");
    const reserved = document(); reserved.en.sections[0].id = "evidence";
    expect(() => parseProjectDocument(reserved)).toThrow("reserved");
  });

  it("checks publish readiness while allowing an unfinished summary in a draft", () => {
    const draft = document(); draft.en.summary = "";
    expect(parseProjectMutation({ action: "save", document: draft }).document.en.summary).toBe("");
    expect(() => parseProjectMutation({ action: "publish", document: draft })).toThrow("summary");
  });

  it("preserves unfinished draft blocks but requires complete images and references to publish", () => {
    const draft = document();
    draft.en.images = [{ src: "", alt: "" }];
    draft.en.evidence = [{ label: "", url: "", detail: "" }];
    draft.en.architecture = [{ label: "", detail: "" }];
    draft.en.sections = [{ id: "work-in-progress", title: "", paragraphs: [""], code: { language: "", content: "" } }];
    expect(parseProjectMutation({ action: "save", document: draft }).document.en.images).toEqual([{ src: "", alt: "" }]);
    expect(() => parseProjectMutation({ action: "publish", document: draft })).toThrow("image source");
    expect(mergePublicProjectRows([{ slug: draft.slug, content: draft }]).some((entry) => entry.slug === draft.slug)).toBe(false);
    draft.en.images[0].src = "javascript:alert(1)";
    expect(() => parseProjectMutation({ action: "save", document: draft })).toThrow("HTTP(S)");
  });

  it("preserves code indentation and trailing newlines", () => {
    const draft = document();
    draft.en.sections[0].code = { language: "python", content: "    indented_example()\n" };
    expect(parseProjectDocument(draft).en.sections[0].code?.content).toBe("    indented_example()\n");
  });

  it("rejects unsafe URL schemes, credentials, protocol-relative paths and oversized arrays", () => {
    for (const source of ["javascript:alert(1)", "//evil.example/picture.png", "/%2fevil.example", "data:image/svg+xml,x", "/../secret", "/%5cevil.example", "https://name:password@example.com/image.png"]) {
      expect(isSafeProjectMediaUrl(source), source).toBe(false);
    }
    expect(isSafeProjectMediaUrl("/projects/screen.png")).toBe(true);
    expect(isSafeProjectMediaUrl("https://images.example.com/screen.png")).toBe(true);
    const bad = document(); bad.en.evidence[0].url = "javascript:alert(1)";
    expect(() => parseProjectDocument(bad)).toThrow("HTTP(S)");
    const excessive = document(); excessive.en.stack = Array(41).fill("React");
    expect(() => parseProjectDocument(excessive)).toThrow("40");
  });
});

describe("project publication boundary", () => {
  beforeEach(() => vi.resetAllMocks());

  it("reads only the local published collection when local mode is enabled", async () => {
    const published = document();
    published.en.title = "Local publication";
    vi.mocked(isLocalAdminEnabled).mockReturnValue(true);
    vi.mocked(getLocalPublishedProjectDocuments).mockResolvedValue([published]);
    expect(await getPublicProjectDocuments()).toEqual([published]);
    expect(createPublicClient).not.toHaveBeenCalled();
  });

  it("never restores seeds if local project data cannot be read", async () => {
    vi.mocked(isLocalAdminEnabled).mockReturnValue(true);
    vi.mocked(getLocalPublishedProjectDocuments).mockRejectedValue(new Error("Invalid local file"));
    expect(await getPublicProjectDocuments()).toEqual([]);
    expect(createPublicClient).not.toHaveBeenCalled();
  });

  it("uses reviewed seeds before the CMS is configured", async () => {
    vi.mocked(createPublicClient).mockReturnValue(null);
    expect(await getPublicProjectDocuments()).toHaveLength(20);
  });

  it("keeps draft edits separate from current live content", () => {
    const live = document(); const draft = document(); draft.en.title = "Unpublished change";
    const entry = createProjectAdminEntry(live.slug, { slug: live.slug, content: draft }, { slug: live.slug, content: live });
    expect(entry?.document.en.title).toBe("Unpublished change");
    expect(entry?.publishedDocument?.en.title).toBe(live.en.title);
    expect(entry?.hasDraftChanges).toBe(true);
    expect(mergePublicProjectRows([{ slug: live.slug, content: live }])[0].en.title).toBe(live.en.title);
    expect(createProjectAdminEntry(live.slug, { slug: live.slug, content: live })?.hasDraftChanges).toBe(false);
  });

  it("never resurrects tombstoned or corrupt seed records", () => {
    const [first, second] = seedProjectDocuments;
    const published = mergePublicProjectRows([{ slug: first.slug, content: null }, { slug: second.slug, content: { invalid: true } }]);
    expect(published).toHaveLength(18);
    expect(published.some((entry) => entry.slug === first.slug || entry.slug === second.slug)).toBe(false);
    const entry = createProjectAdminEntry(first.slug, { slug: first.slug, content: first }, { slug: first.slug, content: null });
    expect(entry?.status).toBe("unpublished");
    expect(entry?.publishedDocument).toBe(null);
  });

  it("queries only the anonymous published table and fails closed on connection failure", async () => {
    const from = vi.fn(() => ({ select: () => Promise.resolve({ data: null, error: { code: "NETWORK" } }) }));
    vi.mocked(createPublicClient).mockReturnValue({ from } as unknown as NonNullable<ReturnType<typeof createPublicClient>>);
    expect(await getPublicProjectDocuments()).toEqual([]);
    expect(from).toHaveBeenCalledExactlyOnceWith("portfolio_projects");
  });

  it("allows seeds when the project tables have not been installed", async () => {
    const client = { from: () => ({ select: () => Promise.resolve({ data: null, error: { code: "PGRST205" } }) }) };
    vi.mocked(createPublicClient).mockReturnValue(client as unknown as NonNullable<ReturnType<typeof createPublicClient>>);
    expect(await getPublicProjectDocuments()).toHaveLength(20);
    const catalog = await getAdminProjectCatalog(client as unknown as Parameters<typeof getAdminProjectCatalog>[0]);
    expect(catalog.available).toBe(false);
    expect(catalog.entries).toHaveLength(20);
  });

  it("includes new draft-only records in admin catalogs without making them public", async () => {
    const draft = document(); draft.slug = draft.en.slug = draft.zh.slug = "new-work";
    const client = { from: (table: string) => ({ select: () => Promise.resolve({ data: table === "portfolio_project_drafts" ? [{ slug: draft.slug, content: draft }] : [], error: null }) }) };
    const catalog = await getAdminProjectCatalog(client as unknown as Parameters<typeof getAdminProjectCatalog>[0]);
    expect(catalog.available).toBe(true);
    expect(catalog.entries.find((entry) => entry.document.slug === "new-work")?.status).toBe("draft");
    expect(mergePublicProjectRows([]).some((entry) => entry.slug === "new-work")).toBe(false);
  });
});
