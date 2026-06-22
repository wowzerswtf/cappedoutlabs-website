import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const markSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' fill='none'>
<line x1='28' y1='50' x2='92' y2='50' stroke='#93c5fd' stroke-opacity='0.55' stroke-width='4' stroke-linecap='round'/>
<rect x='33' y='62' width='13' height='26' rx='3.5' fill='#3b82f6'/>
<rect x='53.5' y='54' width='13' height='34' rx='3.5' fill='#60a5fa'/>
<rect x='74' y='34' width='13' height='54' rx='3.5' fill='#2563EB'/>
<path d='M80.5 21 L91.5 37 L69.5 37 Z' fill='#bfdbfe'/>
</svg>`;

const markUri = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString("base64")}`;

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1f4067 0%, #142c47 100%)",
          borderRadius: 40,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markUri} width={132} height={132} alt="" />
      </div>
    ),
    { width: 180, height: 180 }
  );
}
