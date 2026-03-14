import { createClient } from "@/lib/supabase/server";

export const DEFAULT_RESUME_URL =
  "https://drive.google.com/file/d/1ydMe7BYLDkXabV9UNFn5D9Nby9zaH6HA/view";

export async function getResumeUrl(): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("resume_url")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data?.resume_url) {
    return DEFAULT_RESUME_URL;
  }

  return data.resume_url;
}
