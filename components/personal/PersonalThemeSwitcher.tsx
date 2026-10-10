"use client";

import localFont from "next/font/local";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import "./personal.css";

const archivo = localFont({
  src: [
    {
      path: "../../public/fonts/personal/archivo-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/personal/archivo-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/personal/archivo-black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-personal-heading",
  display: "swap",
  preload: false,
});
const spaceGrotesk = localFont({
  src: "../../public/fonts/personal/space-grotesk-variable.woff2",
  weight: "300 700",
  style: "normal",
  variable: "--font-personal-body",
  display: "swap",
});

const modes = [
  { id: "light", label: "Light" },
  { id: "color", label: "Color" },
  { id: "dark", label: "Dark" },
] as const;
type PersonalTheme = (typeof modes)[number]["id"];

export default function PersonalThemeSwitcher({
  children,
}: {
  children: ReactNode;
}) {
  const [mode, setMode] = useState<PersonalTheme>("light");
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem("personal-theme-mode");
        if (saved === "light" || saved === "dark" || saved === "color")
          setMode(saved);
      } catch {
        /* Disabled storage must not prevent theme changes. */
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current
      ?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')
      ?.focus();
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function chooseTheme(next: PersonalTheme) {
    setMode(next);
    setOpen(false);
    try {
      localStorage.setItem("personal-theme-mode", next);
    } catch {
      /* In-memory selection remains available. */
    }
    toggleRef.current?.focus();
  }

  return (
    <div
      className={`personal-site ${archivo.variable} ${spaceGrotesk.variable}`}
      data-mode={mode}
      style={{ colorScheme: mode === "dark" ? "dark" : "light" }}
    >
      <div aria-hidden="true" className="personal-ambient" />
      <div className="personal-content">{children}</div>
      <div
        ref={wrapperRef}
        className="personal-theme-control"
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            setOpen(false);
            toggleRef.current?.focus();
          }
        }}
      >
        {open && (
          <div
            ref={panelRef}
            id={panelId}
            role="group"
            aria-label="Personal website color theme"
            className="personal-theme-panel"
          >
            {modes.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={mode === item.id}
                onClick={() => chooseTheme(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
        <button
          ref={toggleRef}
          type="button"
          className="personal-theme-toggle"
          aria-label={
            open
              ? "Close personal theme selector"
              : "Open personal theme selector"
          }
          aria-controls={panelId}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2m0 14v2M5.64 5.64l1.42 1.42m9.88 9.88l1.42 1.42M3 12h2m14 0h2M5.64 18.36l1.42-1.42m9.88-9.88l1.42-1.42M12 7a5 5 0 100 10 5 5 0 000-10z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
