export default function Icon({
  name = "arrow",
  className = "",
}: {
  name?: "arrow" | "external" | "code" | "download" | "mail" | "sun";
  className?: string;
}) {
  const paths = {
    arrow: "M4 12h16m-6-6 6 6-6 6",
    external: "M8 5H5v14h14v-3M12 5h7v7M10 14l9-9",
    code: "m8 6-6 6 6 6m8-12 6 6-6 6m-3-14-2 16",
    download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
    mail: "M3 5h18v14H3zM3 6l9 7 9-7",
    sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  };
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={paths[name]} />
    </svg>
  );
}
