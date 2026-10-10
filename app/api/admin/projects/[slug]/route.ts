import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminRoute, apiError, readJson } from "@/lib/api";
import { parseProjectMutation, parseProjectSlug } from "@/lib/project-cms-validation";
import { createProjectAdminEntry, type ProjectStorageRow } from "@/lib/project-cms";

type Context = { params: Promise<{ slug: string }> };

export async function PUT(request: Request, context: Context) {
  return adminRoute(request, async ({ supabase }) => {
    const slug = parseProjectSlug((await context.params).slug);
    const { action, document } = parseProjectMutation(await readJson(request, 512000));
    if (document.slug !== slug) return apiError("Project slug must match the request path.", 400);
    // The RPC performs both writes in one transaction; drafts never leak through public reads.
    const { data, error } = await supabase.rpc("save_portfolio_project", { p_slug: slug, p_action: action, p_document: document });
    if (error) return apiError("Unable to save the project. Check the project database setup and administrator access.", 503);
    const result = data as { draft?: ProjectStorageRow; published?: ProjectStorageRow | null } | null;
    if (!result?.draft) return apiError("The project could not be verified after saving.", 502);
    const entry = createProjectAdminEntry(slug, result.draft, result.published);
    if (!entry) return apiError("The project could not be verified after saving.", 502);
    if (action !== "save") {
      revalidatePath("/portfolio");
      revalidatePath("/projects");
      revalidatePath("/projects/[slug]", "page");
      revalidatePath("/sitemap.xml");
    }
    return NextResponse.json({ entry });
  });
}
