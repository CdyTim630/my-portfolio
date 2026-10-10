import { projectCollections } from "./project-collections";
import type { Project, ProjectCategory } from "./projects";
import type { ProjectAction, ProjectDocument } from "./project-cms-types";
import { isSafeHttpUrl, ValidationError } from "./validation";

const categories: ProjectCategory[] = ["Backend", "Data", "AI", "Full-stack", "Frontend"];
const visuals: Project["visual"][] = ["employa", "atlas", "pipeline", "portfolio", "sigmile", "tomybaby", "algorithms", "delivery"];

function object(value: unknown, allowed: readonly string[]): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ValidationError("Expected a project object.");
  const record = value as Record<string, unknown>;
  if (Object.keys(record).some((key) => !allowed.includes(key))) throw new ValidationError("Unexpected project field.");
  return record;
}

function text(value: unknown, name: string, max: number, required = false, preserveWhitespace = false): string {
  if (typeof value !== "string" || value.length > max || (required && !value.trim()) || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value)) {
    throw new ValidationError(`${name} must be ${required ? "a non-empty" : "a"} string of at most ${max} characters.`);
  }
  return preserveWhitespace ? value : value.trim();
}

function bool(value: unknown, name: string): boolean {
  if (typeof value !== "boolean") throw new ValidationError(`${name} must be a boolean.`);
  return value;
}

function integer(value: unknown, name: string, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > max) throw new ValidationError(`${name} must be an integer between ${min} and ${max}.`);
  return value;
}

function list<T>(value: unknown, name: string, max: number, parse: (item: unknown) => T): T[] {
  if (!Array.isArray(value) || value.length > max) throw new ValidationError(`${name} must contain at most ${max} items.`);
  return value.map(parse);
}

export function parseProjectSlug(value: unknown): string {
  if (typeof value !== "string" || value.length > 100 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) throw new ValidationError("Project slug must use lowercase letters, digits and single hyphens (maximum 100 characters).");
  return value;
}

/** Sources are browser-loaded. Reject protocol-relative, executable and credentialed URLs. */
export function isSafeProjectMediaUrl(value: unknown): value is string {
  if (isSafeHttpUrl(value)) return !String(value).includes("\\");
  if (typeof value !== "string" || value.length > 2048 || !value.startsWith("/") || value.startsWith("//")) return false;
  try {
    const decoded = decodeURIComponent(value);
    return !/[\u0000-\u0020\u007F\\]/.test(decoded) && !decoded.startsWith("//") && !decoded.split(/[/?#]/).includes("..");
  } catch { return false; }
}

function url(value: unknown, name: string, media = false, required = false): string {
  const parsed = text(value, name, 2048, required);
  if (!parsed && !required) return "";
  if (!(media ? isSafeProjectMediaUrl(parsed) : isSafeHttpUrl(parsed) && !parsed.includes("\\"))) throw new ValidationError(`${name} must be ${media ? "a local path or " : "an "}HTTP(S) URL without credentials.`);
  return parsed;
}

function parseProject(value: unknown, slug: string, publish: boolean): Project {
  const body = object(value, ["slug", "title", "summary", "year", "role", "team", "stack", "category", "featured", "repository", "demo", "images", "video", "sections", "evidence", "architecture", "status", "contribution", "visual"]);
  if (parseProjectSlug(body.slug) !== slug) throw new ValidationError("Both project translations must use the document slug.");
  if (!visuals.includes(body.visual as Project["visual"])) throw new ValidationError("Unknown project visual.");
  const result: Project = {
    slug,
    title: text(body.title, "title", 240, true),
    summary: text(body.summary, "summary", 2000, publish),
    year: integer(body.year, "year", 0, 2200),
    role: text(body.role, "role", 4000),
    team: text(body.team, "team", 4000),
    stack: list(body.stack, "stack", 40, (item) => text(item, "stack item", 80, true)),
    category: list(body.category, "category", 5, (item) => {
      if (!categories.includes(item as ProjectCategory)) throw new ValidationError("Unknown project category.");
      return item as ProjectCategory;
    }),
    featured: bool(body.featured, "featured"),
    repository: url(body.repository, "repository"),
    images: list(body.images, "images", 20, (item) => {
      const image = object(item, ["src", "alt", "caption"]);
      return { src: url(image.src, "image source", true, publish), alt: text(image.alt, "image description", 1000, publish), ...("caption" in image ? { caption: text(image.caption, "image caption", 2000) } : {}) };
    }),
    sections: list(body.sections, "sections", 30, (item) => {
      const section = object(item, ["id", "title", "paragraphs", "bullets", "code"]);
      const parsed: Project["sections"][number] = {
        id: parseProjectSlug(section.id),
        title: text(section.title, "section title", 240, publish),
        paragraphs: list(section.paragraphs, "paragraphs", 40, (paragraph) => text(paragraph, "paragraph", 12000, publish)),
      };
      if (["evidence", "main-content", "project-architecture"].includes(parsed.id)) throw new ValidationError("This section ID is reserved by the project page.");
      if ("bullets" in section) parsed.bullets = list(section.bullets, "bullets", 40, (bullet) => text(bullet, "bullet", 2000, publish));
      if ("code" in section) {
        const code = object(section.code, ["language", "content", "caption"]);
        parsed.code = { language: text(code.language, "code language", 40, publish), content: text(code.content, "code", 40000, publish, true), ...("caption" in code ? { caption: text(code.caption, "code caption", 2000) } : {}) };
      }
      return parsed;
    }),
    evidence: list(body.evidence, "evidence", 30, (item) => {
      const evidence = object(item, ["label", "url", "detail"]);
      return { label: text(evidence.label, "evidence label", 240, publish), url: url(evidence.url, "evidence URL", false, publish), detail: text(evidence.detail, "evidence detail", 4000) };
    }),
    architecture: list(body.architecture, "architecture", 30, (item) => {
      const step = object(item, ["label", "detail"]);
      return { label: text(step.label, "architecture label", 240, publish), detail: text(step.detail, "architecture detail", 4000) };
    }),
    status: text(body.status, "status", 4000),
    contribution: text(body.contribution, "contribution", 4000),
    visual: body.visual as Project["visual"],
  };
  if (new Set(result.sections.map((section) => section.id)).size !== result.sections.length) throw new ValidationError("Section IDs must be unique within each translation.");
  if ("demo" in body) result.demo = url(body.demo, "demo");
  if ("video" in body) {
    const video = object(body.video, ["src", "poster", "caption", "transcript"]);
    result.video = {
      src: url(video.src, "video source", true, publish), caption: text(video.caption, "video caption", 2000),
      ...("poster" in video ? { poster: url(video.poster, "video poster", true) } : {}),
      ...("transcript" in video ? { transcript: text(video.transcript, "video transcript", 40000) } : {}),
    };
  }
  return result;
}

export function parseProjectDocument(value: unknown, publish = false): ProjectDocument {
  const body = object(value, ["slug", "collection", "sortOrder", "listed", "archived", "en", "zh"]);
  const slug = parseProjectSlug(body.slug);
  const collection = projectCollections.find((item) => item.id === body.collection)?.id;
  if (!collection) throw new ValidationError("Unknown project collection.");
  return {
    slug, collection, sortOrder: integer(body.sortOrder, "sortOrder", -100000, 100000),
    listed: bool(body.listed, "listed"), archived: bool(body.archived, "archived"),
    en: parseProject(body.en, slug, publish), zh: parseProject(body.zh, slug, publish),
  };
}

export function parseProjectMutation(value: unknown): { action: ProjectAction; document: ProjectDocument } {
  const body = object(value, ["action", "document"]);
  if (body.action !== "save" && body.action !== "publish" && body.action !== "unpublish") throw new ValidationError("Unknown project action.");
  return { action: body.action, document: parseProjectDocument(body.document, body.action === "publish") };
}
