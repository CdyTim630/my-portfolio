import { ReactNode } from "react";
import HomeThemeSwitcher from "@/components/HomeThemeSwitcher";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <HomeThemeSwitcher>
      <div className="blog-theme">{children}</div>
    </HomeThemeSwitcher>
  );
}
