import { ReactNode } from "react";
import HomeThemeSwitcher from "@/components/HomeThemeSwitcher";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <HomeThemeSwitcher>
      <div className="admin-theme">{children}</div>
    </HomeThemeSwitcher>
  );
}
