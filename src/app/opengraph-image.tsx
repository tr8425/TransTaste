import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "TransTaste — Travel Menu Translator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#D85A30",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "-1px",
            marginBottom: 16,
          }}
        >
          TransTaste
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          Travel Menu Translator
        </div>
      </div>
    ),
    { ...size },
  );
}
