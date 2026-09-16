import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const KEEPALIVE_QUERY_COUNT = 3;

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret) {
    console.error("Supabase keepalive skipped: CRON_SECRET is not configured.");
    return NextResponse.json(
      { ok: false, error: "Cron is not configured" },
      { status: 503 }
    );
  }

  if (authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabase = await createClient();

  // Supabase considers real database queries when measuring project activity.
  // A few tiny reads each day are enough to create activity while keeping the
  // database and bandwidth cost negligible.
  const results = await Promise.all(
    Array.from({ length: KEEPALIVE_QUERY_COUNT }, () =>
      supabase.from("posts").select("id").limit(1)
    )
  );
  const error = results.find((result) => result.error)?.error;

  if (error) {
    console.error("Supabase keepalive query failed:", error.message);
    return NextResponse.json(
      { ok: false, error: "Supabase keepalive failed" },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      queries: KEEPALIVE_QUERY_COUNT,
      checkedAt: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
