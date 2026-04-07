import { ImageResponse } from "next/og";

export const runtime = "nodejs";

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
          background: "linear-gradient(135deg, #0F172A 0%, #1a3a5c 50%, #0F172A 100%)",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Capped Out Labs
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#94a3b8",
              lineHeight: 1.4,
              maxWidth: 800,
            }}
          >
            AI Revenue Infrastructure for Operators
          </div>
          <div
            style={{
              display: "flex",
              gap: 40,
              marginTop: 48,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 36, fontWeight: 700, color: "#2563EB" }}>
                +1,866%
              </div>
              <div style={{ fontSize: 16, color: "#94a3b8", marginTop: 4 }}>
                Revenue Growth
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 36, fontWeight: 700, color: "#2563EB" }}>
                23.4x
              </div>
              <div style={{ fontSize: 16, color: "#94a3b8", marginTop: 4 }}>
                ROAS
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 36, fontWeight: 700, color: "#2563EB" }}>
                -90%
              </div>
              <div style={{ fontSize: 16, color: "#94a3b8", marginTop: 4 }}>
                CAC Reduction
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: 16,
              color: "#64748B",
              marginTop: 48,
            }}
          >
            cappedoutlabs.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
