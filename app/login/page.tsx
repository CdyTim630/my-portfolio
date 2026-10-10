import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { localAdminAvailableForPage } from "@/lib/local-admin";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
  const { reason } = await searchParams;
  const localAvailable = await localAdminAvailableForPage();
  const messages: Record<string, string> = {
    forbidden: "You are signed in, but this account does not have administrator access. Use the existing site owner account, or ask the site owner to check its permissions.",
    unavailable: localAvailable ? "" : "Sign-in is temporarily unavailable.",
    callback: "This sign-in link could not be verified. Request a new link.",
  };
  return <LoginForm configured={Boolean(getSupabaseConfig())} localAvailable={localAvailable} initialMessage={messages[reason || ""] || ""} />;
}
