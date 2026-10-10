// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/public", () => ({ createPublicClient: vi.fn() }));

import { createPublicClient } from "@/lib/supabase/public";
import { getPublicContent } from "@/lib/public-content";

describe("public CMS boundary", () => {
  beforeEach(() => vi.resetAllMocks());

  it("does not create mock content when the integration is absent", async () => {
    vi.mocked(createPublicClient).mockReturnValue(null);
    expect(await getPublicContent()).toEqual({ posts: [], categories: [], experiences: [], available: false });
  });

  it("keeps nullable legacy skills from crashing the homepage and explicitly requests published posts", async () => {
    const select = vi.fn();
    const eq = vi.fn();
    const experience = { id: 1, title: "Teaching assistant", company: "NTU", period: "2025", description: "Review sessions", sort_order: 1 };
    const from = vi.fn((table: string) => {
      const result = table === "experiences"
        ? { data: [{ ...experience, skills: null }, { ...experience, id: 2, skills: ["SQL", null, 7, "Python"] }], error: null }
        : { data: [], error: null };
      const query = { select: (columns: string) => { select(table, columns); return query; }, eq: (column: string, value: boolean) => { eq(table, column, value); return query; }, order: () => Promise.resolve(result) };
      return query;
    });
    vi.mocked(createPublicClient).mockReturnValue({ from } as unknown as NonNullable<ReturnType<typeof createPublicClient>>);

    const content = await getPublicContent();
    expect(content.available).toBe(true);
    expect(content.experiences[0]).toEqual({ ...experience, skills: [] });
    expect(content.experiences[1].skills).toEqual(["SQL", "Python"]);
    expect(eq).toHaveBeenCalledWith("posts", "published", true);
    expect(select).toHaveBeenCalledWith("experiences", "id,title,company,period,description,skills,sort_order");
  });

  it("returns a safe unavailable result when the database request throws", async () => {
    vi.mocked(createPublicClient).mockReturnValue({ from: () => { throw new Error("upstream disconnected"); } } as unknown as NonNullable<ReturnType<typeof createPublicClient>>);
    expect(await getPublicContent()).toEqual({ posts: [], categories: [], experiences: [], available: false });
  });
});
