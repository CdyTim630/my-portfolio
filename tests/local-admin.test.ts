// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ headers: vi.fn(), cookies: vi.fn() }));
vi.mock("next/navigation", () => ({
  notFound: () => { throw new Error("NEXT_NOT_FOUND"); },
  redirect: (path: string) => { throw new Error(`NEXT_REDIRECT:${path}`); },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/admin-auth", () => ({ getAdminSession: vi.fn() }));
vi.mock("@/lib/local-project-store", () => ({ saveLocalProject: vi.fn(), getLocalProjectCatalog: vi.fn() }));

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  createLocalAdminToken, isLocalAdminEnabled, isLoopbackHost, LOCAL_ADMIN_COOKIE,
  LOCAL_ADMIN_MAX_AGE, localAdminAvailableForPage, localAdminAvailableForRequest,
  requireLocalAdminPage, verifyLocalAdminToken,
} from "@/lib/local-admin";
import { POST as login } from "@/app/api/local-admin/session/route";
import { POST as logout } from "@/app/api/local-admin/logout/route";
import { GET as catalog } from "@/app/api/local-admin/projects/route";
import { PUT as updateProject } from "@/app/api/local-admin/projects/[slug]/route";
import { getLocalProjectCatalog, saveLocalProject } from "@/lib/local-project-store";
import { createBlankProjectDocument } from "@/lib/project-cms-seeds";
import type { ProjectAdminEntry } from "@/lib/project-cms-types";

const baseURL = "http://localhost:3000";
const document = createBlankProjectDocument();
document.slug = document.en.slug = document.zh.slug = "local-test-project";
document.en.title = "Local test project";
document.zh.title = "本機測試專案";
document.en.summary = "An isolated test document.";
document.zh.summary = "隔離的測試資料。";
const entry: ProjectAdminEntry = { document, status: "draft", hasDraftChanges: true, publishedDocument: null };

function request(path: string, options: {
  method?: string; token?: string | null; origin?: string | null;
  host?: string; site?: string; body?: unknown;
} = {}) {
  const requestHeaders = new Headers();
  const token = options.token === undefined ? createLocalAdminToken() : options.token;
  if (token) requestHeaders.set("cookie", `${LOCAL_ADMIN_COOKIE}=${token}`);
  if (options.origin !== null) requestHeaders.set("origin", options.origin ?? baseURL);
  if (options.host) requestHeaders.set("host", options.host);
  if (options.site) requestHeaders.set("sec-fetch-site", options.site);
  if (options.body !== undefined) requestHeaders.set("content-type", "application/json");
  return new Request(`${baseURL}${path}`, {
    method: options.method ?? "GET", headers: requestHeaders,
    ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
  });
}

function mutation(action = "save", slug = document.slug, bodyDocument = document) {
  return updateProject(request(`/api/local-admin/projects/${encodeURIComponent(slug)}`, {
    method: "PUT", body: { action, document: bodyDocument },
  }), { params: Promise.resolve({ slug }) });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("LOCAL_ADMIN_ENABLED", "true");
  vi.stubEnv("LOCAL_ADMIN_SESSION_SECRET", "isolated-test-secret-with-at-least-32-characters");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
  vi.mocked(headers).mockResolvedValue(new Headers({ host: "localhost:3000" }) as Awaited<ReturnType<typeof headers>>);
  vi.mocked(cookies).mockResolvedValue({ get: () => undefined } as unknown as Awaited<ReturnType<typeof cookies>>);
  vi.mocked(getLocalProjectCatalog).mockResolvedValue({ entries: [entry], available: true });
  vi.mocked(saveLocalProject).mockResolvedValue(entry);
});

afterEach(() => vi.unstubAllEnvs());

describe("local administrator availability", () => {
  it("requires explicit development opt-in and a sufficiently long server secret", () => {
    expect(isLocalAdminEnabled()).toBe(true);
    vi.stubEnv("LOCAL_ADMIN_ENABLED", "false");
    expect(isLocalAdminEnabled()).toBe(false);
    vi.stubEnv("LOCAL_ADMIN_ENABLED", "true");
    vi.stubEnv("LOCAL_ADMIN_SESSION_SECRET", "too-short");
    expect(isLocalAdminEnabled()).toBe(false);
    expect(() => createLocalAdminToken()).toThrow("disabled");
  });

  it.each(["production", "test"])("stays disabled in %s even with opt-in and a secret", async (environment) => {
    vi.stubEnv("NODE_ENV", environment);
    expect(isLocalAdminEnabled()).toBe(false);
    expect((await login(request("/api/local-admin/session", { method: "POST", token: null }))).status).toBe(404);
    expect((await catalog(request("/api/local-admin/projects", { token: "pretend-session" }))).status).toBe(404);
    expect(getLocalProjectCatalog).not.toHaveBeenCalled();
  });

  it("does not replace a configured Supabase integration", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test-project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "sb_publishable_test");
    expect(isLocalAdminEnabled()).toBe(false);
    expect(await localAdminAvailableForPage()).toBe(false);
    expect((await login(request("/api/local-admin/session", { method: "POST", token: null }))).status).toBe(404);
  });

  it.each(["localhost", "localhost:3000", "127.0.0.1:3000", "[::1]:3000"])("accepts loopback host %s", (host) => {
    expect(isLoopbackHost(host)).toBe(true);
  });

  it.each([null, "", "192.168.1.10:3000", "portfolio.example", "localhost.evil.example", "localhost@evil.example", "evil@localhost", "localhost/path", "localhost?other=1"])("rejects nonlocal or malformed host %s", (host) => {
    expect(isLoopbackHost(host)).toBe(false);
  });

  it("checks URL and Host together and rejects remote page hosts", async () => {
    expect(localAdminAvailableForRequest(new Request("https://portfolio.example/api/local-admin/session", { headers: { host: "localhost:3000" } }))).toBe(false);
    expect(localAdminAvailableForRequest(request("/api/local-admin/session", { host: "portfolio.example" }))).toBe(false);
    vi.mocked(headers).mockResolvedValue(new Headers({ host: "portfolio.example" }) as Awaited<ReturnType<typeof headers>>);
    expect(await localAdminAvailableForPage()).toBe(false);
    await expect(requireLocalAdminPage()).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("local administrator sessions", () => {
  it("verifies signed sessions and rejects tampering, expiry and missing values", () => {
    const now = 1_800_000_000_000;
    const token = createLocalAdminToken(now);
    expect(verifyLocalAdminToken(token, now)).toBe(true);
    expect(verifyLocalAdminToken(token, now + LOCAL_ADMIN_MAX_AGE * 1000 - 1)).toBe(true);
    expect(verifyLocalAdminToken(token, now + LOCAL_ADMIN_MAX_AGE * 1000)).toBe(false);
    expect(verifyLocalAdminToken(undefined, now)).toBe(false);
    expect(verifyLocalAdminToken(`${token}tampered`, now)).toBe(false);
    const parts = token.split(".");
    parts[0] = String(Number(parts[0]) - 1000);
    expect(verifyLocalAdminToken(parts.join("."), now)).toBe(false);
    expect(verifyLocalAdminToken("x".repeat(201), now)).toBe(false);
    expect(createLocalAdminToken(now)).not.toBe(token);
    vi.stubEnv("NODE_ENV", "production");
    expect(verifyLocalAdminToken(token, now)).toBe(false);
  });

  it("redirects an unsigned page visitor to login and accepts a valid page session", async () => {
    await expect(requireLocalAdminPage()).rejects.toThrow("NEXT_REDIRECT:/login");
    vi.mocked(cookies).mockResolvedValue({ get: () => ({ value: createLocalAdminToken() }) } as unknown as Awaited<ReturnType<typeof cookies>>);
    await expect(requireLocalAdminPage()).resolves.toBeUndefined();
  });

  it("issues a private HttpOnly SameSite=Strict cookie through a 303 form redirect", async () => {
    const response = await login(request("/api/local-admin/session", { method: "POST", token: null }));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(`${baseURL}/local-admin`);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    const cookie = response.headers.get("set-cookie")!;
    expect(cookie).toContain(`${LOCAL_ADMIN_COOKIE}=`);
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=Strict/i);
    expect(cookie).toContain(`Max-Age=${LOCAL_ADMIN_MAX_AGE}`);
    expect(verifyLocalAdminToken(cookie.split(";")[0].slice(LOCAL_ADMIN_COOKIE.length + 1))).toBe(true);
  });

  it.each([
    { origin: null },
    { origin: "https://foreign.example" },
    { site: "cross-site" },
    { site: "same-site" },
  ])("rejects session creation with invalid origin metadata: %j", async (options) => {
    const response = await login(request("/api/local-admin/session", { method: "POST", token: null, ...options }));
    expect(response.status).toBe(403);
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("clears the session on authenticated same-origin logout", async () => {
    const response = await logout(request("/api/local-admin/logout", { method: "POST" }));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(`${baseURL}/login`);
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect((await logout(request("/api/local-admin/logout", { method: "POST", origin: null }))).status).toBe(403);
    expect((await logout(request("/api/local-admin/logout", { method: "POST", token: null }))).status).toBe(401);
  });
});

describe("local project API boundaries", () => {
  it("rejects missing, altered and expired session cookies before reading stored projects", async () => {
    const invalidTokens = [null, `${createLocalAdminToken()}changed`, createLocalAdminToken(Date.now() - LOCAL_ADMIN_MAX_AGE * 1000 - 1000)];
    for (const token of invalidTokens) expect((await catalog(request("/api/local-admin/projects", { token }))).status).toBe(401);
    expect(getLocalProjectCatalog).not.toHaveBeenCalled();
  });

  it("returns an authenticated catalogue without allowing caching", async () => {
    const response = await catalog(request("/api/local-admin/projects"));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(await response.json()).toEqual({ entries: [entry], available: true });
    expect(getLocalProjectCatalog).toHaveBeenCalledOnce();
  });

  it.each([null, "https://foreign.example"])("rejects mutation origin %s before saving", async (origin) => {
    const response = await updateProject(request(`/api/local-admin/projects/${document.slug}`, {
      method: "PUT", origin, body: { action: "save", document },
    }), { params: Promise.resolve({ slug: document.slug }) });
    expect(response.status).toBe(403);
    expect(saveLocalProject).not.toHaveBeenCalled();
  });

  it("validates the scoped project path and action before writing", async () => {
    expect((await mutation("save", "other-project")).status).toBe(400);
    expect((await mutation("save", "../escape")).status).toBe(400);
    expect((await mutation("delete")).status).toBe(400);
    expect(saveLocalProject).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("saves a local draft without invalidating published pages", async () => {
    const response = await mutation();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(saveLocalProject).toHaveBeenCalledExactlyOnceWith("save", document);
    expect(await response.json()).toEqual({ entry });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it.each(["publish", "unpublish"])("invalidates local public paths after %s", async (action) => {
    expect((await mutation(action)).status).toBe(200);
    expect(saveLocalProject).toHaveBeenCalledExactlyOnceWith(action, document);
    expect(revalidatePath).toHaveBeenCalledWith("/portfolio");
    expect(revalidatePath).toHaveBeenCalledWith("/projects");
    expect(revalidatePath).toHaveBeenCalledWith("/projects/[slug]", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/sitemap.xml");
  });

  it("hides filesystem errors and never invalidates after a failed save", async () => {
    vi.mocked(saveLocalProject).mockRejectedValue(new Error("private internal filesystem path"));
    const response = await mutation("publish");
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("private internal filesystem path");
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
