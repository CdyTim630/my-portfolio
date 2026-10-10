import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { getSupabaseConfig } from "./supabase/config";
import { isAdminUser } from "./admin-policy";

export const getAdminSession = cache(async () => {
  if (!getSupabaseConfig()) return { supabase: null, user: null, status: 503 } as const;
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error && (!error.status || error.status >= 500)) return { supabase: null, user: null, status: 503 } as const;
    if (error || !user) return { supabase: null, user: null, status: 401 } as const;
    if (!isAdminUser(user)) return { supabase: null, user: null, status: 403 } as const;
    return { supabase, user, status: 200 } as const;
  } catch {
    return { supabase: null, user: null, status: 503 } as const;
  }
});

export async function requireAdminPage() {
  const session = await getAdminSession();
  if (!session.supabase || !session.user) redirect(`/login?reason=${session.status === 403 ? "forbidden" : session.status === 503 ? "unavailable" : "signin"}`);
  return { supabase: session.supabase, user: session.user };
}
