import { describe, expect, it } from "vitest";
import { isAdminUser } from "@/lib/admin-policy";
import {
  isSafeHttpUrl,
  parseExperienceInput,
  parsePositiveId,
  parsePostInput,
  parseResumeInput,
  parseTrackInput,
  validateImageFile,
  ValidationError,
} from "@/lib/validation";

describe("trusted administrator claims", () => {
  it("accepts only a boolean administrator flag in app metadata", () => {
    expect(isAdminUser({ app_metadata: { portfolio_admin: true } })).toBe(true);
    for (const user of [null, undefined, {}, { app_metadata: {} }, { app_metadata: { portfolio_admin: "true" } }]) {
      expect(isAdminUser(user)).toBe(false);
    }
    const selfEditableProfile = { app_metadata: {}, user_metadata: { portfolio_admin: true } };
    expect(isAdminUser(selfEditableProfile)).toBe(false);
  });
});

describe("content input boundaries", () => {
  it("accepts database integer IDs without coercing ambiguous values", () => {
    expect(parsePositiveId("42")).toBe(42);
    expect(parsePositiveId(2147483647)).toBe(2147483647);
    for (const value of ["01", "1.2", "1e2", "", -1, 0, 1.5, 2147483648, null, true]) {
      expect(() => parsePositiveId(value)).toThrow(ValidationError);
    }
  });

  it("defaults new posts to draft and trims required text", () => {
    expect(parsePostInput({ title: " A real post ", content: " Markdown content " })).toEqual({
      title: "A real post", content: "Markdown content", published: false,
    });
    expect(parsePostInput({ published: true }, true)).toEqual({ published: true });
  });

  it("rejects mass assignment and malformed post fields", () => {
    for (const value of [
      { title: "Post", content: "Content", author_id: "another-user" },
      { title: "Post", content: "Content", id: 2 },
      { title: " ", content: "Content" },
      { title: "Post", content: "Content", published: "true" },
      { title: "x".repeat(241), content: "Content" },
      { title: "Post", content: "x".repeat(200001) },
      { title: "Post", content: "Content", spotify_track_id: "invalid" },
      { title: "Post", content: "Content", cover_image: "javascript:alert(1)" },
      [], null,
    ]) expect(() => parsePostInput(value)).toThrow(ValidationError);
    expect(() => parsePostInput({}, true)).toThrow(ValidationError);
  });

  it("preserves markdown and allows clearing optional media", () => {
    expect(parsePostInput({ content: "## Heading\n\n```ts\nconst x = 1;\n```", cover_image: "", spotify_track_id: null }, true))
      .toEqual({ content: "## Heading\n\n```ts\nconst x = 1;\n```", cover_image: null, spotify_track_id: null });
  });

  it("validates experience collections, ordering, and editable fields", () => {
    const experience = { title: "Teaching assistant", company: "NTU", period: "2025", description: "Led review sessions." };
    expect(parseExperienceInput(experience)).toEqual({ ...experience, skills: [], sort_order: 0 });
    expect(parseExperienceInput({ skills: [" TypeScript "], sort_order: 2 }, true)).toEqual({ skills: ["TypeScript"], sort_order: 2 });
    for (const update of [{ skills: [3] }, { skills: Array(31).fill("SQL") }, { sort_order: 0.5 }, { sort_order: 100001 }, { updated_by: "another-user" }]) {
      expect(() => parseExperienceInput(update, true)).toThrow(ValidationError);
    }
  });

  it("allows navigable HTTP links and rejects active content or embedded credentials", () => {
    expect(parseResumeInput({ resumeUrl: " https://drive.google.com/file/d/resume/view " }).resumeUrl).toBe("https://drive.google.com/file/d/resume/view");
    for (const url of ["javascript:alert(1)", "data:text/html,test", "//example.com", "https://user:password@example.com", "https://example.com/a b", "invalid"]) {
      expect(isSafeHttpUrl(url)).toBe(false);
      expect(() => parseResumeInput({ resumeUrl: url })).toThrow(ValidationError);
    }
  });

  it("rejects executable SVG and oversized uploads", () => {
    expect(() => validateImageFile({ type: "image/webp", size: 2048 })).not.toThrow();
    for (const file of [{ type: "image/svg+xml", size: 100 }, { type: "image/png", size: 0 }, { type: "image/jpeg", size: 5 * 1024 * 1024 + 1 }]) {
      expect(() => validateImageFile(file)).toThrow(ValidationError);
    }
  });
});

describe("analytics data minimization", () => {
  it("drops URL parameters and stores only the referrer origin", () => {
    expect(parseTrackInput({ path: "/projects?token=secret#section", referrer: "https://search.example/results?q=private" }))
      .toEqual({ path: "/projects", referrer: "https://search.example" });
    expect(parseTrackInput({ path: "/blog" })).toEqual({ path: "/blog", referrer: null });
  });

  it("rejects private routes and nonlocal path input", () => {
    for (const path of ["/admin", "/admin/diary/1", "/auth/callback", "/login", "/api/admin/posts", "//evil.example", "https://example.com", "/a\\b", "/a b"]) {
      expect(() => parseTrackInput({ path })).toThrow(ValidationError);
    }
  });
});
