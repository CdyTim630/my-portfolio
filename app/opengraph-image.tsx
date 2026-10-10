import { ImageResponse } from "next/og";
export const alt =
  "Ding-Yuan Chen — Data, Backend & Applied AI engineering portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#f7f8fa",
        padding: "72px",
        color: "#18212c",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          color: "#275dcc",
          letterSpacing: 3,
        }}
      >
        DING-YUAN CHEN / ENGINEERING PORTFOLIO
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: -3,
          marginTop: 65,
        }}
      >
        <span>Building reliable data systems.</span>
        <span style={{ color: "#6b7280" }}>Intelligent applications.</span>
      </div>
      <div style={{ display: "flex", fontSize: 25, marginTop: 64 }}>
        NTU Information Management · Backend · Data · Applied AI
      </div>
    </div>,
    size,
  );
}
