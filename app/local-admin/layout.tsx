import type { Metadata } from "next";
import type { ReactNode } from "react";
import PersonalThemeSwitcher from "@/components/personal/PersonalThemeSwitcher";
import { requireLocalAdminPage } from "@/lib/local-admin";

export const metadata: Metadata = { title: "本機後台", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LocalAdminLayout({ children }: { children: ReactNode }) {
  await requireLocalAdminPage();
  return <PersonalThemeSwitcher><div className="admin-theme">{children}</div></PersonalThemeSwitcher>;
}
