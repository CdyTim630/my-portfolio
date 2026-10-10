// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/admin-auth", () => ({ getAdminSession: vi.fn() }));

import { adminRoute, assertSameOrigin, readJson } from "@/lib/api";
import { getAdminSession } from "@/lib/admin-auth";

function request(body: string, headers: Record<string, string> = {}) {
  return new Request("https://portfolio.example/api/admin/posts", {
    method: "POST", body,
    headers: { "content-type": "application/json", ...headers },
  });
}

describe("mutation request boundary", () => {
  it("accepts same-origin JSON", async () => {
    await expect(readJson(request('{"title":"Hello"}', { origin: "https://portfolio.example" }))).resolves.toEqual({ title: "Hello" });
  });

  it("rejects malformed JSON and wrong content type", async () => {
    await expect(readJson(request("{"))).rejects.toMatchObject({ status: 400 });
    await expect(readJson(request("{}", { "content-type": "text/plain" }))).rejects.toMatchObject({ status: 415 });
  });

  it("enforces body limits with and without a Content-Length header", async () => {
    await expect(readJson(request('"1234567890"'), 8)).rejects.toMatchObject({ status: 413 });
    await expect(readJson(request("{}", { "content-length": "1000" }), 8)).rejects.toMatchObject({ status: 413 });
  });

  it("rejects cross-origin and cross-site mutations", () => {
    const invalidHeaders: Record<string, string>[] = [{ origin: "https://attacker.example" }, { "sec-fetch-site": "cross-site" }];
    for (const headers of invalidHeaders) {
      expect(() => assertSameOrigin(request("{}", headers))).toThrow("Cross-origin");
    }
  });

  it("does not invoke handlers when authentication fails", async () => {
    const handler = vi.fn();
    vi.mocked(getAdminSession).mockResolvedValue({ supabase: null, user: null, status: 401 });
    const response = await adminRoute(request("{}"), handler);
    expect(response.status).toBe(401);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not disclose internal exceptions", async () => {
    vi.mocked(getAdminSession).mockRejectedValue(new Error("private database credentials"));
    const response = await adminRoute(request("{}"), vi.fn());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("private database credentials");
  });
});
