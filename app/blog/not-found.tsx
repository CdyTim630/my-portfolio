import Link from "next/link";

// BlogLayout already provides the shared theme and its control.
export default function ArticleNotFound() {
  return (
    <main id="main-content" className="status-page">
      <p className="eyebrow">404 / ARTICLE NOT FOUND</p>
      <h1>This article isn’t available.</h1>
      <p>It may have moved or may not be published yet.</p>
      <Link href="/blog" className="button-primary">
        Back to writing →
      </Link>
    </main>
  );
}
