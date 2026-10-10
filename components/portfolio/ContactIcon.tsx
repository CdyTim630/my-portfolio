export type ContactIconName = "github" | "linkedin" | "instagram" | "resume" | "chat";

type ContactIconProps = {
  name: ContactIconName;
  className?: string;
};

export default function ContactIcon({ name, className }: ContactIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {name === "github" && (
        <path
          fill="currentColor"
          stroke="none"
          d="M12 2a10 10 0 0 0-3.162 19.487c.5.092.683-.217.683-.481 0-.237-.009-.866-.014-1.7-2.782.605-3.369-1.342-3.369-1.342-.455-1.156-1.11-1.464-1.11-1.464-.909-.621.069-.608.069-.608 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.087 2.91.831.091-.646.349-1.087.635-1.337-2.221-.253-4.555-1.111-4.555-4.945 0-1.092.39-1.985 1.029-2.685-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.579 9.579 0 0 1 12 6.829c.85.004 1.705.115 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.7 1.028 1.593 1.028 2.685 0 3.844-2.337 4.689-4.565 4.937.359.31.679.919.679 1.852 0 1.337-.012 2.416-.012 2.745 0 .267.18.578.688.48A10.002 10.002 0 0 0 12 2Z"
        />
      )}
      {name === "linkedin" && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2.5" />
          <g fill="currentColor" stroke="none">
            <circle cx="7.7" cy="8" r="1.2" />
            <path d="M6.65 10.25h2.1V17h-2.1ZM10.7 10.25h2v.92c.48-.73 1.2-1.12 2.16-1.12 1.94 0 2.74 1.18 2.74 3.2V17h-2.1v-3.4c0-1.08-.28-1.68-1.14-1.68-.96 0-1.56.65-1.56 1.86V17h-2.1Z" />
          </g>
        </>
      )}
      {name === "instagram" && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5.2" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
        </>
      )}
      {name === "resume" && (
        <>
          <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
          <path d="M14 3v6h6" />
          <circle cx="9" cy="9" r="1.6" />
          <path d="M6.8 13c.35-1.1 1.1-1.65 2.2-1.65s1.85.55 2.2 1.65M8 16h8M8 18.5h5" />
        </>
      )}
      {name === "chat" && (
        <>
          <path d="M14.5 15H8l-4 3v-5.1A5.45 5.45 0 0 1 2.5 9c0-3.32 2.74-6 6.1-6h5.8a6 6 0 0 1 .1 12Z" />
          <path d="M10.5 18.8c.73.14 1.5.2 2.3.2h3.5l3.7 2v-4.15a5.95 5.95 0 0 0 1.5-3.95c0-1.32-.43-2.55-1.16-3.55M7 8.9h8M7 11.5h4.5" />
        </>
      )}
    </svg>
  );
}
