"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface RevealProps {
  children: ReactNode;
  /** ms */
  delay?: number;
  /** Animation type */
  variant?: "up" | "fade" | "left" | "right" | "scale";
  /** trigger every time? */
  once?: boolean;
  className?: string;
}

const variantHidden: Record<string, string> = {
  up: "opacity-0 translate-y-8",
  fade: "opacity-0",
  left: "opacity-0 -translate-x-8",
  right: "opacity-0 translate-x-8",
  scale: "opacity-0 scale-95",
};

export default function Reveal({
  children,
  delay = 0,
  variant = "up",
  once = true,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      // Old browser fallback: skip animation, just show.
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const hiddenCls = variantHidden[variant] ?? variantHidden.up;
  const visibleCls = "opacity-100 translate-y-0 translate-x-0 scale-100";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? visibleCls : hiddenCls
      } ${className}`}
    >
      {children}
    </div>
  );
}
