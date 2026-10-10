import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/api";
import { getAdminProjectCatalog } from "@/lib/project-cms";

export async function GET(request: Request) {
  return adminRoute(request, async ({ supabase }) => NextResponse.json(await getAdminProjectCatalog(supabase)));
}
