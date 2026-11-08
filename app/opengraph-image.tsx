import { ImageResponse } from "next/og";

export const alt = "Kids Fest Emes 2026 — 30 de novembro, 19h, Teatro Marília, Belo Horizonte";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background:
            "radial-gradient(circle at 50% 110%, rgba(244,139,203,0.55), transparent 55%), radial-gradient(circle at 50% 30%, #30145C, #0C0420 75%)",
          color: "#FBF7FF",
          fontFamily: "serif",
          textAlign: "center",
          padding: 60,
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 10, color: "#F8D98B", textTransform: "uppercase" }}>
          Kids Fest Emes 2026
        </div>
        <div style={{ fontSize: 72, marginTop: 36, lineHeight: 1.1 }}>Pequenos artistas.</div>
        <div style={{ fontSize: 72, lineHeight: 1.1, color: "#F8D98B", fontStyle: "italic" }}>
          Grandes conquistas.
        </div>
        <div style={{ fontSize: 56, lineHeight: 1.2, color: "#F48BCB" }}>Memórias para toda a vida.</div>
        <div style={{ marginTop: 44, fontSize: 28, letterSpacing: 4, color: "#D3C9EA" }}>
          30 DE NOVEMBRO • 19H • TEATRO MARÍLIA • BELO HORIZONTE
        </div>
      </div>
    ),
    size,
  );
}
