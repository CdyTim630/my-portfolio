"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type HomeThemeMode = "light" | "color" | "dark";

interface HomeThemeSwitcherProps {
  children: ReactNode;
}

const modes: Array<{ id: HomeThemeMode; label: string }> = [
  { id: "light", label: "淺色" },
  { id: "color", label: "彩色" },
  { id: "dark", label: "深色" },
];

export default function HomeThemeSwitcher({ children }: HomeThemeSwitcherProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const [mode, setMode] = useState<HomeThemeMode>("light");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = localStorage.getItem("home-theme-mode") as HomeThemeMode | null;
      const nextMode =
        saved && modes.some((item) => item.id === saved) ? saved : "light";

      initializedRef.current = true;
      setMode(nextMode);
      document.documentElement.style.colorScheme =
        nextMode === "dark" ? "dark" : "light";
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!initializedRef.current) return;
    localStorage.setItem("home-theme-mode", mode);
    document.documentElement.style.colorScheme = mode === "dark" ? "dark" : "light";
  }, [mode]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const panelClasses = open
    ? "opacity-100 translate-y-0 pointer-events-auto"
    : "opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto";

  return (
    <div className="home-theme relative text-[var(--home-text)] transition-colors duration-300" data-mode={mode}>
      <div aria-hidden className="home-theme-ambient" />

      <div ref={wrapperRef} className="group fixed bottom-5 right-5 z-40">
        <div
          className={`mb-2 flex justify-end gap-1.5 rounded-2xl border border-[var(--home-border)] bg-[var(--home-surface)]/92 p-1.5 shadow-lg backdrop-blur-md transition-all duration-200 ${panelClasses}`}
        >
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setMode(item.id);
                setOpen(false);
              }}
              data-active={mode === item.id}
              className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-[var(--home-text)] transition-all duration-200 hover:bg-[var(--home-surface-muted)] data-[active=true]:bg-[var(--home-primary)] data-[active=true]:text-white"
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Open theme selector"
          className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-[var(--home-border)] bg-[var(--home-surface)]/94 text-[var(--home-text-strong)] shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-[var(--home-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--home-primary)]"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v2m0 14v2M5.64 5.64l1.42 1.42m9.88 9.88l1.42 1.42M3 12h2m14 0h2M5.64 18.36l1.42-1.42m9.88-9.88l1.42-1.42M12 7a5 5 0 100 10 5 5 0 000-10z"
            />
          </svg>
        </button>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
