"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isSafeHttpUrl } from "@/lib/validation";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
  { label: "Portfolio", href: "/portfolio" },
];
const fallbackResume =
  "https://drive.google.com/file/d/1ydMe7BYLDkXabV9UNFn5D9Nby9zaH6HA/view";

export default function PersonalNavbar({ resumeUrl }: { resumeUrl?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const safeResume = isSafeHttpUrl(resumeUrl) ? resumeUrl : fallbackResume;

  useEffect(() => {
    let frame = 0;
    function update() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 16));
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const media = window.matchMedia("(min-width: 1050px)");
    const onResize = () => {
      if (media.matches) setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    media.addEventListener("change", onResize);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      media.removeEventListener("change", onResize);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  function isCurrent(href: string) {
    return href === "/"
      ? pathname === "/"
      : !href.includes("#") &&
          (pathname === href || pathname.startsWith(`${href}/`));
  }

  return (
    <header
      ref={headerRef}
      className="personal-nav"
      data-scrolled={scrolled}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggleRef.current?.focus();
        }
      }}
    >
      <div className="personal-nav-row">
        <Link
          href="/"
          className="personal-wordmark"
          aria-label="CdyTim — personal homepage"
        >
          <span className="personal-avatar">
            <span
              aria-hidden="true"
              className="personal-avatar-ring animate-ring-pulse"
            />
            Tim
          </span>
          <span className="personal-brand-name">CdyTim</span>
        </Link>
        <div className="personal-desktop-nav">
          <nav aria-label="Personal website navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isCurrent(link.href) ? "page" : undefined}
                className={
                  link.href === "/portfolio"
                    ? "personal-portfolio-link"
                    : undefined
                }
              >
                {link.label}
                {link.href === "/portfolio" && (
                  <span aria-hidden="true"> ↗</span>
                )}
              </Link>
            ))}
          </nav>
          <a
            href={safeResume}
            target="_blank"
            rel="noreferrer"
            className="personal-cv"
          >
            Download CV
          </a>
        </div>
        <button
          ref={toggleRef}
          type="button"
          className="personal-menu-toggle"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="personal-mobile-navigation"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>
      {open && (
        <nav
          id="personal-mobile-navigation"
          aria-label="Personal website mobile navigation"
          className="personal-mobile-nav animate-fade-in"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={isCurrent(link.href) ? "page" : undefined}
              className={
                link.href === "/portfolio"
                  ? "personal-portfolio-link"
                  : undefined
              }
            >
              {link.label}
              {link.href === "/portfolio" && <span aria-hidden="true"> ↗</span>}
            </Link>
          ))}
          <a
            href={safeResume}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="personal-cv"
          >
            Download CV
          </a>
        </nav>
      )}
    </header>
  );
}
