import { localAdminRoute, localSessionResponse } from "@/lib/local-admin";

export async function POST(request: Request) {
  return localAdminRoute(request, async () => localSessionResponse(request, true));
}
