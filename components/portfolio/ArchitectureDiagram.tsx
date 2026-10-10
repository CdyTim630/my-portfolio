import type { Project } from "@/lib/projects";
import type { PortfolioLocale } from "@/lib/portfolio-locale";

export default function ArchitectureDiagram({
  project,
  locale = "en",
}: {
  project: Project;
  locale?: PortfolioLocale;
}) {
  const isResearch = project.visual === "pipeline";
  const zh = locale === "zh-TW";
  if (!project.architecture.length) return null;
  return (
    <figure className="architecture-diagram">
      <figcaption>
        <div>
          <strong>
            {isResearch
              ? zh
                ? "研究流程"
                : "Research workflow"
              : zh
                ? "系統架構"
                : "How the pieces connect"}
          </strong>
        </div>
      </figcaption>
      <ol className="architecture-nodes">
        {project.architecture.map((node, index) => (
          <li key={node.label}>
            <span className="architecture-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <strong>{node.label}</strong>
              <p>{node.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
