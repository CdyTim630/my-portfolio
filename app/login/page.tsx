import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { localAdminAvailableForPage } from "@/lib/local-admin";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
  const { reason } = await searchParams;
  const localAvailable = await localAdminAvailableForPage();
  const messages: Record<string, string> = {
    forbidden: "This account is not authorized to administer the portfolio.",
    unavailable: localAvailable ? "" : "Sign-in is temporarily unavailable.",
    callback: "This sign-in link could not be verified. Request a new link.",
  };
  return <LoginForm configured={Boolean(getSupabaseConfig())} localAvailable={localAvailable} initialMessage={messages[reason || ""] || ""} />;
}
