import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface AssessmentResultsProps {
  firstName: string;
  tierLabel: string;
  tierColorHex: string;
  totalScore: number;
  tierSummary: string;
  dimensions: {
    scale: number;
    painClarity: number;
    aiMaturity: number;
    urgency: number;
    strategicFit: number;
  };
  bottleneckService: {
    name: string;
    headline: string;
    description: string;
    stat: string;
  };
  costOfWaiting: {
    monthly: string;
    annual: string;
    context: string;
  };
  showCalendarCTA: boolean;
}

function DimensionBar({ label, score, maxScore = 5 }: { label: string; score: number; maxScore?: number }) {
  const pct = Math.round((score / maxScore) * 100);
  return (
    <tr>
      <td style={dimLabel}>{label}</td>
      <td style={dimBarCell}>
        <div style={dimBarBg}>
          <div
            style={{
              ...dimBarFill,
              width: `${pct}%`,
            }}
          />
        </div>
      </td>
      <td style={dimScore}>{score}/{maxScore}</td>
    </tr>
  );
}

export function AssessmentResults({
  firstName = "there",
  tierLabel = "AI Primed",
  tierColorHex = "#2563EB",
  totalScore = 17,
  tierSummary = "",
  dimensions = { scale: 4, painClarity: 4, aiMaturity: 3, urgency: 3, strategicFit: 3 },
  bottleneckService = {
    name: "AI Infrastructure",
    headline: "Your biggest opportunity",
    description: "",
    stat: "",
  },
  costOfWaiting = { monthly: "$12K", annual: "$150K", context: "" },
  showCalendarCTA = true,
}: AssessmentResultsProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {`${firstName}, your AI readiness score is ${totalScore}/25 — here's your personalized assessment.`}
      </Preview>
      <Body style={main}>
        {/* Navy header */}
        <Section style={header}>
          <Text style={headerText}>Capped Out Labs</Text>
        </Section>

        <Container style={container}>
          {/* Tier badge + score */}
          <Section style={{ textAlign: "center" as const, marginBottom: "32px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "6px 20px",
                borderRadius: "20px",
                backgroundColor: tierColorHex,
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "700" as const,
                letterSpacing: "0.5px",
                textTransform: "uppercase" as const,
              }}
            >
              {tierLabel}
            </div>
            <Heading style={h1}>
              {firstName}, you scored {totalScore}/25
            </Heading>
            <Text style={paragraph}>{tierSummary}</Text>
          </Section>

          <Hr style={hr} />

          {/* Dimension breakdown */}
          <Section style={{ marginBottom: "32px" }}>
            <Heading style={h2}>Your AI Readiness Breakdown</Heading>
            <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
              <tbody>
                <DimensionBar label="Business Scale" score={dimensions.scale} />
                <DimensionBar label="Pain Clarity" score={dimensions.painClarity} />
                <DimensionBar label="AI Maturity" score={dimensions.aiMaturity} />
                <DimensionBar label="Urgency" score={dimensions.urgency} />
                <DimensionBar label="Strategic Fit" score={dimensions.strategicFit} />
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          {/* Biggest opportunity */}
          <Section style={opportunitySection}>
            <Heading style={h2}>Your Biggest Opportunity</Heading>
            <Text style={opportunityName}>{bottleneckService.name}</Text>
            <Heading style={h3}>{bottleneckService.headline}</Heading>
            <Text style={paragraph}>{bottleneckService.description}</Text>
            {bottleneckService.stat && (
              <div style={statBox}>
                <Text style={statText}>{bottleneckService.stat}</Text>
              </div>
            )}
          </Section>

          <Hr style={hr} />

          {/* Cost of waiting */}
          <Section style={{ marginBottom: "32px" }}>
            <Heading style={h2}>The Cost of Waiting</Heading>
            <table cellPadding="0" cellSpacing="0" style={{ width: "100%", marginBottom: "16px" }}>
              <tbody>
                <tr>
                  <td style={costCell}>
                    <Text style={costLabel}>Monthly</Text>
                    <Text style={costValue}>{costOfWaiting.monthly}</Text>
                  </td>
                  <td style={costCell}>
                    <Text style={costLabel}>Annual</Text>
                    <Text style={costValue}>{costOfWaiting.annual}</Text>
                  </td>
                </tr>
              </tbody>
            </table>
            <Text style={paragraph}>{costOfWaiting.context}</Text>
          </Section>

          <Hr style={hr} />

          {/* 90-day roadmap */}
          <Section style={{ marginBottom: "32px" }}>
            <Heading style={h2}>Your 90-Day AI Roadmap</Heading>
            <Section style={roadmapSection}>
              <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td style={phaseNumberCell}>
                      <div style={phaseCircle}>1</div>
                    </td>
                    <td style={phaseContent}>
                      <Text style={phaseTitle}>Days 1–30: Audit &amp; Architecture</Text>
                      <Text style={phaseDetail}>
                        Map your current workflows, identify the highest-leverage automation targets,
                        and design the AI infrastructure blueprint.
                      </Text>
                    </td>
                  </tr>
                  <tr>
                    <td style={phaseNumberCell}>
                      <div style={phaseCircle}>2</div>
                    </td>
                    <td style={phaseContent}>
                      <Text style={phaseTitle}>Days 31–60: Core Build</Text>
                      <Text style={phaseDetail}>
                        Build and integrate the primary AI systems. Test in production with your
                        real data and real workflows.
                      </Text>
                    </td>
                  </tr>
                  <tr>
                    <td style={phaseNumberCell}>
                      <div style={phaseCircle}>3</div>
                    </td>
                    <td style={phaseContent}>
                      <Text style={phaseTitle}>Days 61–90: Optimize &amp; Handoff</Text>
                      <Text style={phaseDetail}>
                        Fine-tune performance, train your team with recorded SOPs, and ensure
                        the systems run independently.
                      </Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Why Capped Out Labs */}
          <Section style={{ marginBottom: "32px" }}>
            <Heading style={h2}>Why Capped Out Labs</Heading>
            <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td style={bulletCell}>&bull;</td>
                  <td style={bulletContent}>
                    <Text style={paragraph}>
                      <strong>We think in exits.</strong> Every system we build is designed to increase
                      enterprise value, not just automate a task.
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td style={bulletCell}>&bull;</td>
                  <td style={bulletContent}>
                    <Text style={paragraph}>
                      <strong>Production, not prototypes.</strong> 60% of AI projects never make it
                      to production. Ours ship, perform, and compound.
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td style={bulletCell}>&bull;</td>
                  <td style={bulletContent}>
                    <Text style={paragraph}>
                      <strong>Operator-built.</strong> We run real businesses with real revenue.
                      We build what we&apos;d want deployed in our own operations.
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          {/* CTA */}
          <Section style={{ textAlign: "center" as const, margin: "32px 0" }}>
            {showCalendarCTA ? (
              <>
                <Heading style={h2}>Your Next Step</Heading>
                <Text style={paragraph}>
                  Book a free 30-minute AI Infrastructure Discovery Call. We&apos;ll map your
                  specific bottleneck to a 90-day build plan — no pitch deck, no filler.
                </Text>
                <Link href="https://calendly.com/cappedoutmedia/ai-assessment-meeting" style={ctaButton}>
                  Book Your Discovery Call
                </Link>
                <Text style={scarcityText}>
                  We take on 3 new build clients per month to maintain quality.
                </Text>
              </>
            ) : (
              <>
                <Heading style={h2}>Your Next Step</Heading>
                <Text style={paragraph}>
                  You&apos;re not quite ready for a full build — but you&apos;re closer than you think.
                  We send weekly operator intelligence that helps businesses like yours get AI-ready.
                </Text>
                <Link href="https://cappedoutlabs.com/resources" style={ctaButtonSecondary}>
                  Explore Our Resources
                </Link>
              </>
            )}
          </Section>

          <Text style={paragraph}>Talk soon,</Text>
          <Text style={signoff}>
            Waynard
            <br />
            Capped Out Labs
            <br />
            <Link href="https://cappedoutlabs.com" style={link}>
              cappedoutlabs.com
            </Link>
          </Text>
        </Container>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            You received this because you took the AI Readiness Assessment at{" "}
            <Link href="https://cappedoutlabs.com" style={footerLink}>
              cappedoutlabs.com
            </Link>
            . A Capped Out Media company.
          </Text>
          <Text style={footerText}>
            <Link href="{{{RESEND_UNSUBSCRIBE_URL}}}" style={footerLink}>
              Unsubscribe
            </Link>
          </Text>
        </Section>
      </Body>
    </Html>
  );
}

export default AssessmentResults;

// ── Styles ───────────────────────────────────────────────────────────

const main: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const header: React.CSSProperties = {
  backgroundColor: "#1a3a5c",
  padding: "24px 0",
  textAlign: "center" as const,
};

const headerText: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "700",
  letterSpacing: "0.5px",
  margin: "0",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 32px",
  maxWidth: "600px",
  borderRadius: "0 0 8px 8px",
};

const h1: React.CSSProperties = {
  color: "#0f172a",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "16px 0 12px",
  textAlign: "center" as const,
};

const h2: React.CSSProperties = {
  color: "#1a3a5c",
  fontSize: "20px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 16px",
};

const h3: React.CSSProperties = {
  color: "#0f172a",
  fontSize: "17px",
  fontWeight: "600",
  lineHeight: "1.4",
  margin: "0 0 8px",
};

const paragraph: React.CSSProperties = {
  color: "#0f172a",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const hr: React.CSSProperties = {
  borderColor: "#e2e8f0",
  margin: "24px 0",
};

// Dimension bars
const dimLabel: React.CSSProperties = {
  color: "#64748b",
  fontSize: "13px",
  fontWeight: "500",
  paddingRight: "12px",
  paddingBottom: "10px",
  whiteSpace: "nowrap" as const,
  width: "110px",
};

const dimBarCell: React.CSSProperties = {
  paddingBottom: "10px",
  width: "100%",
};

const dimBarBg: React.CSSProperties = {
  backgroundColor: "#e2e8f0",
  borderRadius: "4px",
  height: "8px",
  width: "100%",
  overflow: "hidden",
};

const dimBarFill: React.CSSProperties = {
  backgroundColor: "#2563EB",
  borderRadius: "4px",
  height: "8px",
  minWidth: "8px",
};

const dimScore: React.CSSProperties = {
  color: "#0f172a",
  fontSize: "13px",
  fontWeight: "600",
  paddingLeft: "12px",
  paddingBottom: "10px",
  whiteSpace: "nowrap" as const,
};

// Opportunity section
const opportunitySection: React.CSSProperties = {
  marginBottom: "32px",
};

const opportunityName: React.CSSProperties = {
  color: "#2563EB",
  fontSize: "13px",
  fontWeight: "600",
  letterSpacing: "0.5px",
  textTransform: "uppercase" as const,
  margin: "0 0 4px",
};

const statBox: React.CSSProperties = {
  backgroundColor: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: "8px",
  padding: "12px 16px",
  marginTop: "8px",
};

const statText: React.CSSProperties = {
  color: "#059669",
  fontSize: "15px",
  fontWeight: "600",
  margin: "0",
  textAlign: "center" as const,
};

// Cost section
const costCell: React.CSSProperties = {
  width: "50%",
  textAlign: "center" as const,
  padding: "16px",
  backgroundColor: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
};

const costLabel: React.CSSProperties = {
  color: "#64748b",
  fontSize: "12px",
  fontWeight: "500",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 4px",
};

const costValue: React.CSSProperties = {
  color: "#dc2626",
  fontSize: "22px",
  fontWeight: "700",
  margin: "0",
};

// Roadmap
const roadmapSection: React.CSSProperties = {
  padding: "20px 24px",
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const phaseNumberCell: React.CSSProperties = {
  width: "28px",
  verticalAlign: "top",
  padding: "0",
};

const phaseCircle: React.CSSProperties = {
  width: "28px",
  height: "28px",
  backgroundColor: "#2563EB",
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: "700",
  textAlign: "center" as const,
  borderRadius: "14px",
  lineHeight: "28px",
  display: "block",
};

const phaseContent: React.CSSProperties = {
  paddingLeft: "14px",
  paddingBottom: "16px",
  verticalAlign: "top",
};

const phaseTitle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: "15px",
  fontWeight: "600",
  margin: "0 0 2px",
  lineHeight: "1.4",
};

const phaseDetail: React.CSSProperties = {
  color: "#64748b",
  fontSize: "13px",
  margin: "0",
  lineHeight: "1.5",
};

// Bullets
const bulletCell: React.CSSProperties = {
  color: "#2563EB",
  fontSize: "16px",
  verticalAlign: "top",
  paddingRight: "8px",
  paddingTop: "2px",
};

const bulletContent: React.CSSProperties = {
  verticalAlign: "top",
};

// CTA
const ctaButton: React.CSSProperties = {
  backgroundColor: "#2563EB",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "700",
  padding: "14px 32px",
  textDecoration: "none",
};

const ctaButtonSecondary: React.CSSProperties = {
  backgroundColor: "#1a3a5c",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "700",
  padding: "14px 32px",
  textDecoration: "none",
};

const scarcityText: React.CSSProperties = {
  color: "#64748b",
  fontSize: "13px",
  fontStyle: "italic",
  margin: "12px 0 0",
};

const signoff: React.CSSProperties = {
  color: "#0f172a",
  fontSize: "15px",
  lineHeight: "1.8",
  margin: "0",
};

const link: React.CSSProperties = {
  color: "#2563EB",
  textDecoration: "none",
};

const footer: React.CSSProperties = {
  margin: "0 auto",
  maxWidth: "600px",
  padding: "24px 32px",
  textAlign: "center" as const,
};

const footerText: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0 0 8px",
};

const footerLink: React.CSSProperties = {
  color: "#94a3b8",
  textDecoration: "underline",
};
