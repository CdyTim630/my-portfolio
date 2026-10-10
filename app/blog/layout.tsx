import { ReactNode } from "react";
import PersonalThemeSwitcher from "@/components/personal/PersonalThemeSwitcher";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <PersonalThemeSwitcher>
      <div className="blog-theme">{children}</div>
    </PersonalThemeSwitcher>
  );
}
