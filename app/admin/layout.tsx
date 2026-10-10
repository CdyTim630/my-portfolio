import { ReactNode } from "react";
import PersonalThemeSwitcher from "@/components/personal/PersonalThemeSwitcher";
import { requireAdminPage } from "@/lib/admin-auth";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminPage();
  return (
    <PersonalThemeSwitcher>
      <div className="admin-theme">{children}</div>
    </PersonalThemeSwitcher>
  );
}
