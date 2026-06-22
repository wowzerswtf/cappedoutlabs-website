import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const markSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' fill='none'>
<line x1='28' y1='50' x2='92' y2='50' stroke='#93c5fd' stroke-opacity='0.55' stroke-width='3.5' stroke-linecap='round'/>
<rect x='33' y='62' width='13' height='26' rx='3.5' fill='#3b82f6'/>
<rect x='53.5' y='54' width='13' height='34' rx='3.5' fill='#60a5fa'/>
<rect x='74' y='34' width='13' height='54' rx='3.5' fill='#2563EB'/>
<path d='M80.5 21 L91.5 37 L69.5 37 Z' fill='#bfdbfe'/>
</svg>`;

const markUri = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString("base64")}`;

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: 38, fontWeight: 800, color: "#60a5fa" }}>{value}</div>
      <div style={{ fontSize: 16, color: "#94a3b8", marginTop: 4 }}>{label}</div>
    </div>
  );
}

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(130% 120% at 70% 0%, #244a6e 0%, #1a3a5c 45%, #0F172A 100%)",
          padding: "60px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markUri} width={104} height={104} alt="" />
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, letterSpacing: -2 }}>
            <span style={{ color: "#ffffff" }}>Capped Out</span>
            <span style={{ color: "#60a5fa" }}>&nbsp;Labs</span>
          </div>
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#cbd9ea",
            lineHeight: 1.35,
            maxWidth: 880,
            textAlign: "center",
          }}
        >
          We build AI into how your company runs — faster, cheaper, reusable.
        </div>
        <div style={{ display: "flex", gap: 56, marginTop: 46 }}>
          <Stat value="+1,866%" label="Revenue growth" />
          <Stat value="23.4x" label="ROAS" />
          <Stat value="-90%" label="CAC reduction" />
        </div>
        <div style={{ display: "flex", fontSize: 18, color: "#64748B", marginTop: 46 }}>
          cappedoutlabs.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
