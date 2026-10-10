export class ValidationError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
    this.name = "ValidationError";
  }
}

export function isSafeHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048 || /[\u0000-\u0020]/.test(value)) return false;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password;
  } catch { return false; }
}

export function parsePositiveId(value: unknown): number {
  const id = typeof value === "string" && /^[1-9]\d*$/.test(value) ? Number(value) : value;
  if (typeof id !== "number" || !Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    throw new ValidationError("A valid positive integer ID is required.");
  }
  return id;
}

function object(value: unknown, allowed: readonly string[]): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ValidationError("Expected a JSON object.");
  const result = value as Record<string, unknown>;
  if (Object.keys(result).some((key) => !allowed.includes(key))) throw new ValidationError("Unexpected input field.");
  return result;
}

function string(value: unknown, name: string, max: number, required = false): string {
  if (typeof value !== "string" || value.length > max || (required && !value.trim())) {
    throw new ValidationError(`${name} must be ${required ? "a non-empty" : "a"} string of at most ${max} characters.`);
  }
  return value.trim();
}

export interface PostInput {
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  spotify_track_id: string | null;
  cover_image: string | null;
  published: boolean;
}

export function parsePostInput(value: unknown, partial = false): Partial<PostInput> {
  const body = object(value, ["title", "excerpt", "content", "category", "spotify_track_id", "cover_image", "published"]);
  const result: Partial<PostInput> = {};
  if (!partial || "title" in body) result.title = string(body.title, "title", 240, true);
  if (!partial || "content" in body) result.content = string(body.content, "content", 200000, true);
  for (const key of ["excerpt", "category"] as const) {
    if (key in body) result[key] = body[key] === null ? null : string(body[key], key, key === "excerpt" ? 1000 : 80);
  }
  if ("cover_image" in body) {
    if (body.cover_image === null || body.cover_image === "") result.cover_image = null;
    else if (isSafeHttpUrl(body.cover_image)) result.cover_image = body.cover_image;
    else throw new ValidationError("cover_image must be an HTTP(S) URL.");
  }
  if ("spotify_track_id" in body) {
    const track = body.spotify_track_id;
    if (track === null || track === "") result.spotify_track_id = null;
    else if (typeof track === "string" && /^[A-Za-z0-9]{22}$/.test(track)) result.spotify_track_id = track;
    else throw new ValidationError("spotify_track_id must be a Spotify track ID.");
  }
  if ("published" in body) {
    if (typeof body.published !== "boolean") throw new ValidationError("published must be a boolean.");
    result.published = body.published;
  } else if (!partial) result.published = false;
  if (!Object.keys(result).length) throw new ValidationError("No editable fields provided.");
  return result;
}

export interface ExperienceInput {
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
  sort_order: number;
}

export function parseExperienceInput(value: unknown, partial = false): Partial<ExperienceInput> {
  const body = object(value, ["title", "company", "period", "description", "skills", "sort_order"]);
  const result: Partial<ExperienceInput> = {};
  for (const key of ["title", "company", "period", "description"] as const) {
    if (!partial || key in body) result[key] = string(body[key], key, key === "description" ? 10000 : 240, true);
  }
  if ("skills" in body) {
    if (!Array.isArray(body.skills) || body.skills.length > 30) throw new ValidationError("skills must be an array of at most 30 strings.");
    result.skills = body.skills.map((skill) => string(skill, "skill", 60, true));
  } else if (!partial) result.skills = [];
  if ("sort_order" in body) {
    if (typeof body.sort_order !== "number" || !Number.isInteger(body.sort_order) || Math.abs(body.sort_order) > 100000) throw new ValidationError("sort_order must be an integer between -100000 and 100000.");
    result.sort_order = body.sort_order;
  } else if (!partial) result.sort_order = 0;
  if (!Object.keys(result).length) throw new ValidationError("No editable fields provided.");
  return result;
}

export function parseResumeInput(value: unknown): { resumeUrl: string } {
  const body = object(value, ["resumeUrl"]);
  const resumeUrl = typeof body.resumeUrl === "string" ? body.resumeUrl.trim() : body.resumeUrl;
  if (!isSafeHttpUrl(resumeUrl)) throw new ValidationError("resumeUrl must be an HTTP(S) URL without credentials.");
  return { resumeUrl };
}

export function parseTrackInput(value: unknown): { path: string; referrer: string | null } {
  const body = object(value, ["path", "referrer"]);
  const path = string(body.path, "path", 2048, true);
  if (!path.startsWith("/") || path.startsWith("//") || /[\\\u0000-\u0020]/.test(path)) throw new ValidationError("path must be a local pathname.");
  const pathname = new URL(path, "https://portfolio.invalid").pathname;
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth") || pathname === "/login" || pathname.startsWith("/api")) throw new ValidationError("This path is not tracked.");
  if (body.referrer != null && body.referrer !== "" && !isSafeHttpUrl(body.referrer)) throw new ValidationError("referrer must be an HTTP(S) URL.");
  return { path: pathname, referrer: body.referrer ? new URL(body.referrer as string).origin : null };
}

export function validateImageFile(file: Pick<File, "size" | "type">): void {
  if (file.size <= 0 || file.size > 5 * 1024 * 1024) throw new ValidationError("Choose an image between 1 byte and 5 MB.");
  if (!["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"].includes(file.type)) throw new ValidationError("Use a JPEG, PNG, WebP, GIF, or AVIF image.");
}
