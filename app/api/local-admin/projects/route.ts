import { NextResponse } from "next/server";
import { localAdminRoute } from "@/lib/local-admin";
import { getLocalProjectCatalog } from "@/lib/local-project-store";

export async function GET(request: Request) {
  return localAdminRoute(request, async () => NextResponse.json(await getLocalProjectCatalog()));
}
