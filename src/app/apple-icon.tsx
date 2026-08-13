import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        <span
          style={{
            fontSize: 120,
            fontWeight: 800,
            color: "#FFFFFF",
            lineHeight: 1,
          }}
        >
          T
        </span>
      </div>
    ),
    { ...size },
  );
}
