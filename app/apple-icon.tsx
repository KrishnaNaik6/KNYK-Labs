import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
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
          borderRadius: 36,
          background: "#060911",
          border: "2px solid rgba(6, 182, 212, 0.4)",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 26,
            background: "linear-gradient(135deg, #06b6d4, #14b8a6, #67e8f9)",
            color: "#020617",
            fontSize: 76,
            fontWeight: 900,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.05em",
            boxShadow: "0 8px 24px rgba(6, 182, 212, 0.35)",
          }}
        >
          K
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
