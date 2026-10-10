import { requireAdminPage } from "@/lib/admin-auth";
import { getResumeUrl } from "@/lib/site-settings";
import ResumeLinkManager from "./ResumeLinkManager";

export default async function ResumePage() {
  await requireAdminPage();

  const resumeUrl = await getResumeUrl();

  return <ResumeLinkManager initialResumeUrl={resumeUrl} />;
}
