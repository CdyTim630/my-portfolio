import { timingSafeEqual } from "node:crypto";
import { createPublicClient } from "@/lib/supabase/public";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "Cron is not configured." }, { status: 503 });
  const provided = Buffer.from(request.headers.get("authorization") || "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const supabase = createPublicClient();
  if (!supabase) return NextResponse.json({ ok: false, error: "Supabase is not configured." }, { status: 503 });
  try {
    const results = await Promise.all(Array.from({ length: 3 }, () => supabase.from("posts").select("id").eq("published", true).limit(1)));
    if (results.some((result) => result.error)) return NextResponse.json({ ok: false, error: "Supabase keepalive failed." }, { status: 502 });
    return NextResponse.json({ ok: true, queries: 3, checkedAt: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: "Supabase keepalive failed." }, { status: 502 });
  }
}
