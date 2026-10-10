import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { apiError, readJson } from "@/lib/api";
import { parseTrackInput, ValidationError } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = parseTrackInput(await readJson(request, 8192));
    const supabase = createPublicClient();
    if (!supabase) return NextResponse.json({ ok: false, reason: "unavailable" }, { status: 503 });
    const { error } = await supabase.from("page_views").insert({ ...body, user_agent: (request.headers.get("user-agent") || "").slice(0, 512) });
    return error ? apiError("Analytics is unavailable.", 502) : NextResponse.json({ ok: true });
  } catch (error) {
    return error instanceof ValidationError ? apiError(error.message, error.status) : apiError("Analytics is unavailable.", 503);
  }
}
