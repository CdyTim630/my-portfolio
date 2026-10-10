import Link from "next/link";
import HomeThemeSwitcher from "@/components/HomeThemeSwitcher";
export default function NotFound() {
  return (
    <HomeThemeSwitcher>
      <main id="main-content" className="status-page">
        <p className="eyebrow">404 / PAGE NOT FOUND</p>
        <h1>This path ends here.</h1>
        <p>The page may have moved. There’s more to explore in the projects.</p>
        <Link className="button-primary" href="/projects">
          Explore projects →
        </Link>
      </main>
    </HomeThemeSwitcher>
  );
}
