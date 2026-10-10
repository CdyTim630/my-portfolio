import { NextResponse } from "next/server";
import { getAdminSession } from "./admin-auth";
import { ValidationError } from "./validation";

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (request.headers.get("sec-fetch-site") === "cross-site" || (origin && origin !== new URL(request.url).origin)) {
    throw new ValidationError("Cross-origin requests are not allowed.", 403);
  }
}

export async function readJson(request: Request, maxBytes = 256000): Promise<unknown> {
  assertSameOrigin(request);
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") throw new ValidationError("Content-Type must be application/json.", 415);
  if (Number(request.headers.get("content-length")) > maxBytes) throw new ValidationError("Request body is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new ValidationError("A JSON body is required.");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > maxBytes) {
      await reader.cancel();
      throw new ValidationError("Request body is too large.", 413);
    }
    chunks.push(value);
  }
  const buffer = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder().decode(buffer)); }
  catch { throw new ValidationError("Malformed JSON body."); }
}

type AdminContext = Awaited<ReturnType<typeof getAdminSession>> & { supabase: NonNullable<Awaited<ReturnType<typeof getAdminSession>>["supabase"]>; user: NonNullable<Awaited<ReturnType<typeof getAdminSession>>["user"]> };

export async function adminRoute(request: Request, handler: (context: AdminContext) => Promise<Response>) {
  try {
    if (!["GET", "HEAD"].includes(request.method)) assertSameOrigin(request);
    const session = await getAdminSession();
    if (!session.supabase || !session.user) return apiError(session.status === 403 ? "Administrator access required." : session.status === 503 ? "Service is not configured or is unavailable." : "Authentication required.", session.status);
    const response = await handler(session as AdminContext);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    return error instanceof ValidationError ? apiError(error.message, error.status) : apiError("The service is temporarily unavailable.", 503);
  }
}
