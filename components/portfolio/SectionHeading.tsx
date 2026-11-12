import type { ReactNode } from "react";
export default function SectionHeading({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      <span className="section-rule" aria-hidden="true" />
      {children}
    </div>
  );
}
