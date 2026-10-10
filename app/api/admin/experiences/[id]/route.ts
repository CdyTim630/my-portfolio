import { NextResponse } from "next/server";
import { adminRoute, apiError, readJson } from "@/lib/api";
import { parsePositiveId, parseExperienceInput } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  return adminRoute(request, async ({ supabase }) => {
    const id = parsePositiveId((await context.params).id);
    const body = parseExperienceInput(await readJson(request), true);
    const { data, error } = await supabase.from("experiences").update({ ...body, updated_at: new Date().toISOString() }).eq("id", id).select().maybeSingle();
    if (error) return apiError("Unable to update experience.", 502);
    return data ? NextResponse.json(data) : apiError("Experience not found.", 404);
  });
}

export async function DELETE(request: Request, context: Context) {
  return adminRoute(request, async ({ supabase }) => {
    const id = parsePositiveId((await context.params).id);
    const { data, error } = await supabase.from("experiences").delete().eq("id", id).select("id").maybeSingle();
    if (error) return apiError("Unable to delete experience.", 502);
    return data ? NextResponse.json({ success: true }) : apiError("Experience not found.", 404);
  });
}
