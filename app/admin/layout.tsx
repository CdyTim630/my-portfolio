import { ReactNode } from "react";
import HomeThemeSwitcher from "@/components/HomeThemeSwitcher";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <HomeThemeSwitcher>{children}</HomeThemeSwitcher>;
}
