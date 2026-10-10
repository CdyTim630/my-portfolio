import { apiError } from "@/lib/api";
import { assertLocalMutationOrigin, localAdminAvailableForRequest, localSessionResponse } from "@/lib/local-admin";
import { ValidationError } from "@/lib/validation";

export async function POST(request: Request) {
  if (!localAdminAvailableForRequest(request)) return apiError("Not found.", 404);
  try {
    assertLocalMutationOrigin(request);
    return localSessionResponse(request);
  } catch (error) {
    return apiError(error instanceof ValidationError ? error.message : "無法開啟本機工作區。", error instanceof ValidationError ? error.status : 503);
  }
}
