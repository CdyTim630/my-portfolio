import { NextResponse } from "next/server";
import { adminRoute, apiError, readJson } from "@/lib/api";
import { parsePositiveId, parsePostInput, ValidationError } from "@/lib/validation";

export async function GET(request: Request) {
  return adminRoute(request, async ({ supabase, user }) => {
    const { data: posts, error } = await supabase.from("posts").select("*").eq("author_id", user.id).order("created_at", { ascending: false });
    return error ? apiError("Unable to load posts.", 502) : NextResponse.json({ posts });
  });
}

export async function POST(request: Request) {
  return adminRoute(request, async ({ supabase, user }) => {
    const body = parsePostInput(await readJson(request));
    const { data: post, error } = await supabase.from("posts").insert({ ...body, author_id: user.id }).select().single();
    return error ? apiError("Unable to create post.", 502) : NextResponse.json({ post }, { status: 201 });
  });
}

export async function PATCH(request: Request) {
  return adminRoute(request, async ({ supabase, user }) => {
    const body = await readJson(request);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new ValidationError("Expected a JSON object.");
    const { id, ...input } = body as Record<string, unknown>;
    const postId = parsePositiveId(id);
    const updates = parsePostInput(input, true);
    const { data: post, error } = await supabase.from("posts").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", postId).eq("author_id", user.id).select().maybeSingle();
    if (error) return apiError("Unable to update post.", 502);
    return post ? NextResponse.json({ post }) : apiError("Post not found.", 404);
  });
}

export async function DELETE(request: Request) {
  return adminRoute(request, async ({ supabase, user }) => {
    const id = parsePositiveId(new URL(request.url).searchParams.get("id"));
    const { data, error } = await supabase.from("posts").delete().eq("id", id).eq("author_id", user.id).select("id").maybeSingle();
    if (error) return apiError("Unable to delete post.", 502);
    return data ? NextResponse.json({ message: "Post deleted" }) : apiError("Post not found.", 404);
  });
}
