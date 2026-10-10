import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { apiError, readJson } from "@/lib/api";
import { localAdminRoute } from "@/lib/local-admin";
import { saveLocalProject } from "@/lib/local-project-store";
import { parseProjectMutation, parseProjectSlug } from "@/lib/project-cms-validation";

export async function PUT(request: Request, context: { params: Promise<{ slug: string }> }) {
  return localAdminRoute(request, async () => {
    const slug = parseProjectSlug((await context.params).slug);
    const { action, document } = parseProjectMutation(await readJson(request, 512000));
    if (document.slug !== slug) return apiError("專案網址與內容不一致。", 400);
    const entry = await saveLocalProject(action, document);
    if (action !== "save") {
      revalidatePath("/portfolio");
      revalidatePath("/projects");
      revalidatePath("/projects/[slug]", "page");
      revalidatePath("/sitemap.xml");
    }
    return NextResponse.json({ entry });
  });
}
