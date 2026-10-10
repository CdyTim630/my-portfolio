/** Public credentials only. A missing integration must not break the portfolio. */
export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key || key.startsWith("sb_secret_")) return null;
  try {
    const parsed = new URL(url);
    if (!["https:", "http:"].includes(parsed.protocol)) return null;
    // Legacy service_role JWTs are also forbidden in NEXT_PUBLIC variables.
    if (key.split(".").length === 3) {
      const payload = JSON.parse(atob(key.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      if (payload.role === "service_role") return null;
    }
    return { url, key };
  } catch {
    return null;
  }
}

export function requireSupabaseConfig() {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Supabase is not configured with public credentials.");
  return config;
}
