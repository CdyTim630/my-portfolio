import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

/** Anonymous reads never inherit an administrator's session or expose drafts. */
export function createPublicClient() {
  const config = getSupabaseConfig();
  if (!config) return null;
  return createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(5000) }),
    },
  });
}
