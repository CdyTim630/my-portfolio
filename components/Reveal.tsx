import type { ReactNode } from "react";
// SSR content is visible without JavaScript. Motion is a CSS enhancement.
export default function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  variant?: "up" | "fade" | "left" | "right" | "scale";
  once?: boolean;
  className?: string;
}) {
  return <div className={`content-reveal ${className}`}>{children}</div>;
}
