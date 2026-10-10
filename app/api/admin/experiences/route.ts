import { NextResponse } from "next/server";
import { adminRoute, apiError, readJson } from "@/lib/api";
import { parseExperienceInput } from "@/lib/validation";

export async function GET(request: Request) {
  return adminRoute(request, async ({ supabase }) => {
    const { data, error } = await supabase.from("experiences").select("*").order("sort_order", { ascending: true });
    return error ? apiError("Unable to load experiences.", 502) : NextResponse.json(data);
  });
}

export async function POST(request: Request) {
  return adminRoute(request, async ({ supabase }) => {
    const body = parseExperienceInput(await readJson(request));
    const { data, error } = await supabase.from("experiences").insert(body).select().single();
    return error ? apiError("Unable to create experience.", 502) : NextResponse.json(data, { status: 201 });
  });
}
