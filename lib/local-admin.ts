import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getSupabaseConfig } from "./supabase/config";
import { apiError } from "./api";
import { ValidationError } from "./validation";

export const LOCAL_ADMIN_COOKIE = "portfolio-local-admin";
export const LOCAL_ADMIN_MAX_AGE = 60 * 60 * 8;

/** This workspace can never replace Supabase authorization or run in production. */
export function isLocalAdminEnabled() {
  return process.env.NODE_ENV === "development"
    && process.env.LOCAL_ADMIN_ENABLED === "true"
    && (process.env.LOCAL_ADMIN_SESSION_SECRET?.length ?? 0) >= 32
    && !getSupabaseConfig();
}

export function isLoopbackHost(host: string | null) {
  if (!host) return false;
  try {
    const parsed = new URL(`http://${host}`);
    return !parsed.username && !parsed.password && parsed.pathname === "/"
      && !parsed.search && !parsed.hash
      && ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
  } catch { return false; }
}

export async function localAdminAvailableForPage() {
  return isLocalAdminEnabled() && isLoopbackHost((await headers()).get("host"));
}

export function localAdminAvailableForRequest(request: Request) {
  const url = new URL(request.url);
  const host = request.headers.get("host");
  return isLocalAdminEnabled() && isLoopbackHost(url.host)
    && (!host || (host === url.host && isLoopbackHost(host)));
}

function signature(payload: string) {
  return createHmac("sha256", process.env.LOCAL_ADMIN_SESSION_SECRET!).update(payload).digest("base64url");
}

export function createLocalAdminToken(now = Date.now()) {
  if (!isLocalAdminEnabled()) throw new Error("Local workspace is disabled.");
  const payload = `${now + LOCAL_ADMIN_MAX_AGE * 1000}.${randomBytes(24).toString("base64url")}`;
  return `${payload}.${signature(payload)}`;
}

export function verifyLocalAdminToken(token: string | undefined, now = Date.now()) {
  if (!isLocalAdminEnabled() || !token || token.length > 200) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || !/^\d+$/.test(parts[0]) || !/^[\w-]{32}$/.test(parts[1])) return false;
  const expiry = Number(parts[0]);
  if (!Number.isSafeInteger(expiry) || expiry <= now || expiry > now + LOCAL_ADMIN_MAX_AGE * 1000) return false;
  const actual = Buffer.from(parts[2]);
  const expected = Buffer.from(signature(`${parts[0]}.${parts[1]}`));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function requireLocalAdminPage() {
  if (!(await localAdminAvailableForPage())) notFound();
  if (!verifyLocalAdminToken((await cookies()).get(LOCAL_ADMIN_COOKIE)?.value)) redirect("/login");
}

export function assertLocalMutationOrigin(request: Request) {
  // Both native form submissions and fetch writes send Origin. Require it here.
  if (request.headers.get("origin") !== new URL(request.url).origin
    || ![null, "same-origin", "none"].includes(request.headers.get("sec-fetch-site"))) {
    throw new ValidationError("僅能從本機後台操作。", 403);
  }
}

function requestToken(request: Request) {
  return request.headers.get("cookie")?.split(";").map(value => value.trim())
    .find(value => value.startsWith(`${LOCAL_ADMIN_COOKIE}=`))?.slice(LOCAL_ADMIN_COOKIE.length + 1);
}

export async function localAdminRoute(request: Request, handler: () => Promise<Response>) {
  if (!localAdminAvailableForRequest(request)) return apiError("Not found.", 404);
  try {
    if (!["GET", "HEAD"].includes(request.method)) assertLocalMutationOrigin(request);
    if (!verifyLocalAdminToken(requestToken(request))) return apiError("請重新進入本機後台。", 401);
    const response = await handler();
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error) {
    if (error instanceof ValidationError) return apiError(error.message, error.status);
    return apiError("無法讀寫本機作品檔案，請確認檔案與資料夾權限後重試。", 503);
  }
}

export function localSessionResponse(request: Request, signOut = false) {
  const response = NextResponse.redirect(new URL(signOut ? "/login" : "/local-admin", request.url), 303);
  response.headers.set("Cache-Control", "private, no-store");
  response.cookies.set(LOCAL_ADMIN_COOKIE, signOut ? "" : createLocalAdminToken(), {
    httpOnly: true, sameSite: "strict", secure: new URL(request.url).protocol === "https:",
    path: "/", maxAge: signOut ? 0 : LOCAL_ADMIN_MAX_AGE,
  });
  return response;
}
