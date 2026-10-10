import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { isSafeHttpUrl } from "@/lib/validation";

export const DEFAULT_RESUME_URL =
  "https://drive.google.com/file/d/1ydMe7BYLDkXabV9UNFn5D9Nby9zaH6HA/view";

export const getResumeUrl = cache(async (): Promise<string> => {
  const supabase = createPublicClient();
  if (!supabase) return DEFAULT_RESUME_URL;
  try {
  const { data, error } = await supabase
    .from("site_settings")
    .select("resume_url")
    .eq("id", 1)
    .maybeSingle();

  if (error || !isSafeHttpUrl(data?.resume_url)) {
    return DEFAULT_RESUME_URL;
  }

  return data.resume_url;
  } catch { return DEFAULT_RESUME_URL; }
});
