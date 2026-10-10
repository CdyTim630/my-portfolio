// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { getSupabaseConfig, requireSupabaseConfig } from "@/lib/supabase/config";

afterEach(() => vi.unstubAllEnvs());

describe("public Supabase credentials", () => {
  it("supports public pages when the integration is unconfigured", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    expect(getSupabaseConfig()).toBeNull();
    expect(() => requireSupabaseConfig()).toThrow("public credentials");
  });

  it("accepts publishable keys and legacy anon JWTs", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    for (const key of ["sb_publishable_example", `header.${Buffer.from(JSON.stringify({ role: "anon" })).toString("base64url")}.signature`]) {
      vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", key);
      expect(getSupabaseConfig()).toEqual({ url: "https://project.supabase.co", key });
    }
  });

  it("refuses obvious server-only secrets and invalid public configuration", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    for (const key of ["sb_secret_example", `header.${Buffer.from(JSON.stringify({ role: "service_role" })).toString("base64url")}.signature`, "invalid.jwt.payload"]) {
      vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", key);
      expect(getSupabaseConfig()).toBeNull();
    }
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "sb_publishable_example");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "javascript:alert(1)");
    expect(getSupabaseConfig()).toBeNull();
  });
});
