import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
  Link,
} from "@react-pdf/renderer";

// ── Types (mirrored from email template) ────────────────────────────

export interface AssessmentPDFProps {
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

// ── Brand constants ─────────────────────────────────────────────────

const NAVY = "#1a3a5c";
const BLUE = "#2563EB";
const SURFACE = "#F8FAFC";
const TEXT_PRIMARY = "#0F172A";
const TEXT_SECONDARY = "#64748B";
const SUCCESS = "#059669";
const WHITE = "#ffffff";
const BORDER = "#E2E8F0";

// ── Styles ──────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: WHITE,
    paddingHorizontal: 48,
    paddingVertical: 40,
  },

  // Cover page
  coverPage: {
    fontFamily: "Helvetica",
    backgroundColor: NAVY,
    paddingHorizontal: 48,
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  coverBrand: {
    fontSize: 14,
    color: WHITE,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 48,
    fontFamily: "Helvetica-Bold",
  },
  coverTitle: {
    fontSize: 32,
    color: WHITE,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 12,
  },
  coverSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 48,
  },
  coverTierBadge: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    marginBottom: 16,
  },
  coverTierText: {
    fontSize: 16,
    color: WHITE,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  coverScore: {
    fontSize: 48,
    color: WHITE,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  coverScoreLabel: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 48,
  },
  coverName: {
    fontSize: 18,
    color: WHITE,
    marginBottom: 8,
  },
  coverDate: {
    fontSize: 12,
    color: "#94A3B8",
  },
  coverFooter: {
    position: "absolute",
    bottom: 40,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: "#334155",
    paddingTop: 16,
    alignItems: "center",
  },
  coverFooterText: {
    fontSize: 10,
    color: "#64748B",
  },

  // Section headers
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: NAVY,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    color: NAVY,
    fontFamily: "Helvetica-Bold",
  },

  // Text styles
  h3: {
    fontSize: 16,
    color: TEXT_PRIMARY,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  body: {
    fontSize: 11,
    color: TEXT_PRIMARY,
    lineHeight: 1.6,
    marginBottom: 12,
  },
  bodySecondary: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    lineHeight: 1.6,
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    color: TEXT_SECONDARY,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },

  // Dimension bars
  dimRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dimLabel: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    width: 100,
    fontFamily: "Helvetica-Bold",
  },
  dimBarBg: {
    flex: 1,
    height: 12,
    backgroundColor: "#E2E8F0",
    borderRadius: 6,
    marginHorizontal: 12,
  },
  dimBarFill: {
    height: 12,
    backgroundColor: BLUE,
    borderRadius: 6,
  },
  dimScore: {
    fontSize: 11,
    color: TEXT_PRIMARY,
    fontFamily: "Helvetica-Bold",
    width: 30,
    textAlign: "right",
  },

  // Tier summary box
  tierBox: {
    backgroundColor: SURFACE,
    borderRadius: 8,
    padding: 20,
    marginTop: 16,
    borderLeftWidth: 4,
  },
  tierBoxText: {
    fontSize: 11,
    color: TEXT_PRIMARY,
    lineHeight: 1.6,
  },

  // Stat box
  statBox: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 8,
    padding: 14,
    marginTop: 12,
    alignItems: "center",
  },
  statText: {
    fontSize: 13,
    color: SUCCESS,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },

  // Cost boxes
  costRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  costBox: {
    flex: 1,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  costLabel: {
    fontSize: 10,
    color: TEXT_SECONDARY,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  costValue: {
    fontSize: 22,
    color: "#DC2626",
    fontFamily: "Helvetica-Bold",
  },

  // Roadmap
  phaseRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  phaseCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  phaseNumber: {
    fontSize: 13,
    color: WHITE,
    fontFamily: "Helvetica-Bold",
  },
  phaseContent: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 13,
    color: TEXT_PRIMARY,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  phaseDetail: {
    fontSize: 10,
    color: TEXT_SECONDARY,
    lineHeight: 1.5,
  },

  // Bullet points
  bulletRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BLUE,
    marginTop: 4,
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 11,
    color: TEXT_PRIMARY,
    lineHeight: 1.6,
  },

  // CTA page
  ctaPage: {
    fontFamily: "Helvetica",
    backgroundColor: NAVY,
    paddingHorizontal: 48,
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 28,
    color: WHITE,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 16,
  },
  ctaBody: {
    fontSize: 13,
    color: "#CBD5E1",
    lineHeight: 1.7,
    textAlign: "center",
    marginBottom: 40,
    maxWidth: 400,
  },
  ctaButton: {
    backgroundColor: BLUE,
    borderRadius: 8,
    paddingHorizontal: 36,
    paddingVertical: 14,
    marginBottom: 12,
  },
  ctaButtonText: {
    fontSize: 16,
    color: WHITE,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  ctaUrl: {
    fontSize: 11,
    color: "#94A3B8",
    textDecoration: "none",
  },
  ctaScarcity: {
    fontSize: 11,
    color: "#94A3B8",
    fontStyle: "italic",
    marginTop: 24,
    textAlign: "center",
  },

  // Opportunity service name
  serviceName: {
    fontSize: 11,
    color: BLUE,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  // Page footer
  pageFooter: {
    position: "absolute",
    bottom: 20,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageFooterText: {
    fontSize: 8,
    color: "#94A3B8",
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 20,
  },
});

// ── Helper Components ───────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );
}

function DimensionBar({
  label,
  score,
  maxScore = 5,
}: {
  label: string;
  score: number;
  maxScore?: number;
}) {
  const pct = Math.round((score / maxScore) * 100);
  return (
    <View style={s.dimRow}>
      <Text style={s.dimLabel}>{label}</Text>
      <View style={s.dimBarBg}>
        <View style={[s.dimBarFill, { width: `${pct}%` }]} />
      </View>
      <Text style={s.dimScore}>
        {score}/{maxScore}
      </Text>
    </View>
  );
}

function RoadmapPhase({
  number,
  title,
  detail,
}: {
  number: number;
  title: string;
  detail: string;
}) {
  return (
    <View style={s.phaseRow}>
      <View style={s.phaseCircle}>
        <Text style={s.phaseNumber}>{number}</Text>
      </View>
      <View style={s.phaseContent}>
        <Text style={s.phaseTitle}>{title}</Text>
        <Text style={s.phaseDetail}>{detail}</Text>
      </View>
    </View>
  );
}

function BulletPoint({
  boldText,
  text,
}: {
  boldText: string;
  text: string;
}) {
  return (
    <View style={s.bulletRow}>
      <View style={s.bulletDot} />
      <Text style={s.bulletText}>
        <Text style={{ fontFamily: "Helvetica-Bold" }}>{boldText}</Text>
        {" "}{text}
      </Text>
    </View>
  );
}

function PageFooter({ pageLabel }: { pageLabel: string }) {
  return (
    <View style={s.pageFooter} fixed>
      <Text style={s.pageFooterText}>Capped Out Labs</Text>
      <Text style={s.pageFooterText}>{pageLabel}</Text>
      <Text style={s.pageFooterText}>cappedoutlabs.com</Text>
    </View>
  );
}

// ── Document ────────────────────────────────────────────────────────

function AssessmentPDFDocument(props: AssessmentPDFProps) {
  const {
    firstName,
    tierLabel,
    tierColorHex,
    totalScore,
    tierSummary,
    dimensions,
    bottleneckService,
    costOfWaiting,
    showCalendarCTA,
  } = props;

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document
      title={`AI Readiness Assessment - ${firstName}`}
      author="Capped Out Labs"
      subject="AI Readiness Assessment Results"
    >
      {/* ── Page 1: Cover ──────────────────────────────────────────── */}
      <Page size="LETTER" style={s.coverPage}>
        <Text style={s.coverBrand}>Capped Out Labs</Text>
        <Text style={s.coverTitle}>AI Readiness{"\n"}Assessment</Text>
        <Text style={s.coverSubtitle}>
          Personalized analysis and strategic roadmap
        </Text>

        <View
          style={[s.coverTierBadge, { backgroundColor: tierColorHex }]}
        >
          <Text style={s.coverTierText}>{tierLabel}</Text>
        </View>

        <Text style={s.coverScore}>{totalScore}/25</Text>
        <Text style={s.coverScoreLabel}>Overall Readiness Score</Text>

        <Text style={s.coverName}>Prepared for {firstName}</Text>
        <Text style={s.coverDate}>{today}</Text>

        <View style={s.coverFooter}>
          <Text style={s.coverFooterText}>
            cappedoutlabs.com | The only AI firm that thinks in exits
          </Text>
        </View>
      </Page>

      {/* ── Page 2: Score Overview ─────────────────────────────────── */}
      <Page size="LETTER" style={s.page}>
        <SectionHeader title="Your AI Readiness Score" />

        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 42,
              color: NAVY,
              fontFamily: "Helvetica-Bold",
            }}
          >
            {totalScore}/25
          </Text>
          <View
            style={[
              s.coverTierBadge,
              { backgroundColor: tierColorHex, marginTop: 8 },
            ]}
          >
            <Text style={s.coverTierText}>{tierLabel}</Text>
          </View>
        </View>

        <Text style={s.label}>Dimension Breakdown</Text>
        <View style={{ marginTop: 8 }}>
          <DimensionBar label="Scale" score={dimensions.scale} />
          <DimensionBar label="Pain Clarity" score={dimensions.painClarity} />
          <DimensionBar label="AI Maturity" score={dimensions.aiMaturity} />
          <DimensionBar label="Urgency" score={dimensions.urgency} />
          <DimensionBar
            label="Strategic Fit"
            score={dimensions.strategicFit}
          />
        </View>

        <View style={[s.tierBox, { borderLeftColor: tierColorHex }]}>
          <Text style={s.tierBoxText}>{tierSummary}</Text>
        </View>

        <PageFooter pageLabel="Score Overview" />
      </Page>

      {/* ── Page 3: Biggest Opportunity ────────────────────────────── */}
      <Page size="LETTER" style={s.page}>
        <SectionHeader title="Your Biggest Opportunity" />

        <Text style={s.serviceName}>{bottleneckService.name}</Text>
        <Text style={s.h3}>{bottleneckService.headline}</Text>
        <Text style={s.body}>{bottleneckService.description}</Text>

        {bottleneckService.stat ? (
          <View style={s.statBox}>
            <Text style={s.statText}>{bottleneckService.stat}</Text>
          </View>
        ) : null}

        <View style={s.divider} />

        {/* ── Cost of Waiting ──────────────────────────────────────── */}
        <SectionHeader title="The Cost of Waiting" />

        <View style={s.costRow}>
          <View style={s.costBox}>
            <Text style={s.costLabel}>Monthly</Text>
            <Text style={s.costValue}>{costOfWaiting.monthly}</Text>
          </View>
          <View style={s.costBox}>
            <Text style={s.costLabel}>Annual</Text>
            <Text style={s.costValue}>{costOfWaiting.annual}</Text>
          </View>
        </View>

        <Text style={s.body}>{costOfWaiting.context}</Text>

        <PageFooter pageLabel="Opportunity & Cost Analysis" />
      </Page>

      {/* ── Page 4: 90-Day Roadmap ─────────────────────────────────── */}
      <Page size="LETTER" style={s.page}>
        <SectionHeader title="Your 90-Day AI Roadmap" />

        <View
          style={{
            backgroundColor: SURFACE,
            borderRadius: 8,
            padding: 24,
            borderWidth: 1,
            borderColor: BORDER,
          }}
        >
          <RoadmapPhase
            number={1}
            title="Days 1-30: Audit & Architecture"
            detail="Map your current workflows, identify the highest-leverage automation targets, and design the AI infrastructure blueprint."
          />
          <RoadmapPhase
            number={2}
            title="Days 31-60: Core Build"
            detail="Build and integrate the primary AI systems. Test in production with your real data and real workflows."
          />
          <RoadmapPhase
            number={3}
            title="Days 61-90: Optimize & Handoff"
            detail="Fine-tune performance, train your team with recorded SOPs, and ensure the systems run independently."
          />
        </View>

        <View style={s.divider} />

        {/* ── Why Capped Out Labs ──────────────────────────────────── */}
        <SectionHeader title="Why Capped Out Labs" />

        <BulletPoint
          boldText="We think in exits."
          text="Every system we build is designed to increase enterprise value, not just automate a task."
        />
        <BulletPoint
          boldText="Production, not prototypes."
          text="60% of AI projects never make it to production. Ours ship, perform, and compound."
        />
        <BulletPoint
          boldText="Operator-built."
          text="We run real businesses with real revenue. We build what we'd want deployed in our own operations."
        />

        <PageFooter pageLabel="Roadmap & Approach" />
      </Page>

      {/* ── Page 5: CTA ────────────────────────────────────────────── */}
      <Page size="LETTER" style={s.ctaPage}>
        {showCalendarCTA ? (
          <>
            <Text style={s.ctaTitle}>Your Next Step</Text>
            <Text style={s.ctaBody}>
              Book a free 30-minute AI Infrastructure Discovery Call.
              {"\n\n"}
              We'll map your specific bottleneck to a 90-day build plan
              — no pitch deck, no filler.
            </Text>
            <Link src="https://calendly.com/cappedoutmedia/ai-assessment-meeting">
              <View style={s.ctaButton}>
                <Text style={s.ctaButtonText}>
                  Book Your Discovery Call
                </Text>
              </View>
            </Link>
            <Link src="https://calendly.com/cappedoutmedia/ai-assessment-meeting">
              <Text style={s.ctaUrl}>calendly.com/cappedoutmedia/ai-assessment-meeting</Text>
            </Link>
            <Text style={s.ctaScarcity}>
              We take on 3 new build clients per month to maintain
              quality.
            </Text>
          </>
        ) : (
          <>
            <Text style={s.ctaTitle}>Your Next Step</Text>
            <Text style={s.ctaBody}>
              You're not quite ready for a full build — but you're
              closer than you think.
              {"\n\n"}
              We send weekly operator intelligence that helps businesses
              like yours get AI-ready.
            </Text>
            <Link src="https://cappedoutlabs.com/resources">
              <View
                style={[s.ctaButton, { backgroundColor: "#334155" }]}
              >
                <Text style={s.ctaButtonText}>
                  Explore Our Resources
                </Text>
              </View>
            </Link>
            <Link src="https://cappedoutlabs.com/resources">
              <Text style={s.ctaUrl}>
                cappedoutlabs.com/resources
              </Text>
            </Link>
          </>
        )}

        <View style={s.coverFooter}>
          <Text style={s.coverFooterText}>
            cappedoutlabs.com | The only AI firm that thinks in exits
          </Text>
        </View>
      </Page>
    </Document>
  );
}

// ── Export: generate PDF buffer ──────────────────────────────────────

export async function generateAssessmentPDF(
  props: AssessmentPDFProps
): Promise<Buffer> {
  const buffer = await renderToBuffer(
    <AssessmentPDFDocument {...props} />
  );
  return Buffer.from(buffer);
}
