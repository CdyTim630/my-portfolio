import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_RESUME_URL } from "@/lib/site-settings";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("resume_url")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { resumeUrl: DEFAULT_RESUME_URL, error: error.message },
      { status: 200 }
    );
  }

  return NextResponse.json({ resumeUrl: data?.resume_url || DEFAULT_RESUME_URL });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { resumeUrl?: string };
  const resumeUrl = body.resumeUrl?.trim();

  if (!resumeUrl) {
    return NextResponse.json({ error: "resumeUrl is required" }, { status: 400 });
  }

  try {
    new URL(resumeUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("site_settings")
    .upsert(
      {
        id: 1,
        resume_url: resumeUrl,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select("resume_url, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    resumeUrl: data.resume_url,
    updatedAt: data.updated_at,
  });
}
