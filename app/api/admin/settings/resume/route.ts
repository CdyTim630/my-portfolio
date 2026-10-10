import { NextResponse } from "next/server";
import { adminRoute, apiError, readJson } from "@/lib/api";
import { parseResumeInput } from "@/lib/validation";
import { getResumeUrl } from "@/lib/site-settings";

export async function GET(request: Request) {
  return adminRoute(request, async () => NextResponse.json({ resumeUrl: await getResumeUrl() }));
}

export async function PUT(request: Request) {
  return adminRoute(request, async ({ supabase, user }) => {
    const { resumeUrl } = parseResumeInput(await readJson(request, 4096));
    const { data, error } = await supabase.from("site_settings").upsert({ id: 1, resume_url: resumeUrl, updated_by: user.id, updated_at: new Date().toISOString() }, { onConflict: "id" }).select("resume_url,updated_at").single();
    return error ? apiError("Unable to update resume URL.", 502) : NextResponse.json({ resumeUrl: data.resume_url, updatedAt: data.updated_at });
  });
}
