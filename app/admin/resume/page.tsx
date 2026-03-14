import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getResumeUrl } from "@/lib/site-settings";
import ResumeLinkManager from "./ResumeLinkManager";

export default async function ResumePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const resumeUrl = await getResumeUrl();

  return <ResumeLinkManager initialResumeUrl={resumeUrl} />;
}
