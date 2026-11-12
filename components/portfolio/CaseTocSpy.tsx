"use client";
import { useEffect } from "react";

// Sections whose top has passed this line (just below the sticky nav) count as read.
const READING_LINE = 140;

/**
 * Marks the table-of-contents link for the section being read with
 * aria-current="true". Purely an enhancement: without JS the TOC still works.
 */
export default function CaseTocSpy() {
  useEffect(() => {
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".case-toc a[href*='#']"),
    );
    const entries = links
      .map((link) => ({
        link,
        section: document.getElementById(decodeURIComponent(link.hash.slice(1))),
      }))
      .filter((entry): entry is { link: HTMLAnchorElement; section: HTMLElement } =>
        Boolean(entry.section),
      );
    if (!entries.length) return;

    let frame = 0;
    function update() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const atBottom =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        let current = entries[0];
        for (const entry of entries) {
          if (entry.section.getBoundingClientRect().top <= READING_LINE) current = entry;
        }
        if (atBottom) current = entries[entries.length - 1];
        for (const { link } of entries) {
          if (link === current.link) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        }
      });
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return null;
}
