import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ff6b2c",
          borderRadius: 36,
          fontFamily: "sans-serif",
        }}
      >
        <span style={{ fontSize: 132, fontWeight: 800, color: "#FFFFFF", lineHeight: 1 }}>T</span>
      </div>
    ),
    {
      width: 192,
      height: 192,
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
