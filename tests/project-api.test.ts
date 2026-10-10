// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/admin-auth", () => ({ getAdminSession: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { getAdminSession } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { PUT } from "@/app/api/admin/projects/[slug]/route";
import { seedProjectDocuments } from "@/lib/project-cms-seeds";

const rpc = vi.fn();
const document = seedProjectDocuments[0];
function request(action = "save", slug = document.slug, bodyDocument = document) {
  return PUT(new Request(`https://portfolio.example/api/admin/projects/${slug}`, { method: "PUT", headers: { "content-type": "application/json", origin: "https://portfolio.example" }, body: JSON.stringify({ action, document: bodyDocument }) }), { params: Promise.resolve({ slug }) });
}

describe("project administration API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getAdminSession).mockResolvedValue({ supabase: { rpc }, user: { id: "owner" }, status: 200 } as unknown as Awaited<ReturnType<typeof getAdminSession>>);
  });

  it("rejects unauthenticated calls before touching stored projects", async () => {
    vi.mocked(getAdminSession).mockResolvedValue({ supabase: null, user: null, status: 401 });
    const response = await request();
    expect(response.status).toBe(401);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("rejects a body/path mismatch and invalid input before the RPC", async () => {
    expect((await request("save", "different-slug")).status).toBe(400);
    expect((await request("delete")).status).toBe(400);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("saves a draft without revalidating the public site", async () => {
    rpc.mockResolvedValue({ data: { draft: { slug: document.slug, content: document }, published: null }, error: null });
    const response = await request();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(rpc).toHaveBeenCalledExactlyOnceWith("save_portfolio_project", { p_slug: document.slug, p_action: "save", p_document: expect.objectContaining({ slug: document.slug }) });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it.each(["publish", "unpublish"])("atomically submits %s and refreshes public project paths", async (action) => {
    rpc.mockResolvedValue({ data: { draft: { slug: document.slug, content: document }, published: { slug: document.slug, content: action === "publish" ? document : null } }, error: null });
    const response = await request(action);
    expect(response.status).toBe(200);
    expect(rpc).toHaveBeenCalledTimes(1);
    const body = await response.json();
    expect(body.entry.status).toBe(action === "publish" ? "published" : "unpublished");
    expect(revalidatePath).toHaveBeenCalledWith("/portfolio");
    expect(revalidatePath).toHaveBeenCalledWith("/projects");
    expect(revalidatePath).toHaveBeenCalledWith("/projects/[slug]", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/sitemap.xml");
  });

  it("reports failed saves without leaking database details or invalidating pages", async () => {
    rpc.mockResolvedValue({ data: null, error: { message: "private database details" } });
    const response = await request("publish");
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("private database details");
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
