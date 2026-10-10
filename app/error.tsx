"use client";
import Link from "next/link";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" className="status-page">
      <p className="eyebrow">SOMETHING WENT WRONG</p>
      <h1>Let’s try that again.</h1>
      <p>
        This page couldn’t be loaded. You can retry or return to the projects.
      </p>
      <button className="button-primary" onClick={reset}>
        Try again
      </button>
      <Link className="text-link" href="/projects">
        View projects →
      </Link>
    </main>
  );
}
