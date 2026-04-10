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

// ── Brand constants ─────────────────────────────────────────────────

const NAVY = "#1a3a5c";
const BLUE = "#2563EB";
const SURFACE = "#F8FAFC";
const TEXT_PRIMARY = "#0F172A";
const TEXT_SECONDARY = "#64748B";
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
    paddingVertical: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  coverLabel: {
    fontSize: 11,
    color: BLUE,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  coverTitle: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    textAlign: "center",
    lineHeight: 1.2,
    marginBottom: 12,
  },
  coverSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 1.6,
    maxWidth: 400,
    marginBottom: 32,
  },
  coverMetric: {
    fontSize: 48,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    textAlign: "center",
    marginBottom: 4,
  },
  coverMetricLabel: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  coverFooter: {
    position: "absolute",
    bottom: 40,
    left: 48,
    right: 48,
    textAlign: "center",
  },
  coverFooterText: {
    fontSize: 10,
    color: "#64748B",
  },
  // Section headers
  sectionTag: {
    fontSize: 9,
    color: BLUE,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  h1: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 16,
    lineHeight: 1.3,
  },
  h2: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 12,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 6,
  },
  body: {
    fontSize: 11,
    color: TEXT_PRIMARY,
    lineHeight: 1.7,
    marginBottom: 12,
  },
  bodySecondary: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    lineHeight: 1.7,
    marginBottom: 12,
  },
  // Cards
  card: {
    backgroundColor: SURFACE,
    borderRadius: 8,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardAccent: {
    backgroundColor: SURFACE,
    borderRadius: 8,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: BLUE,
  },
  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: SURFACE,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },
  statValue: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 8,
    color: TEXT_SECONDARY,
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },
  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: NAVY,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableCell: {
    fontSize: 10,
    color: TEXT_PRIMARY,
  },
  tableCellBold: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
  },
  // Bullet list
  bulletRow: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BLUE,
    marginTop: 4,
    marginRight: 10,
  },
  bulletText: {
    fontSize: 11,
    color: TEXT_PRIMARY,
    lineHeight: 1.6,
    flex: 1,
  },
  // Divider
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    marginVertical: 20,
  },
  // CTA
  ctaBox: {
    backgroundColor: NAVY,
    borderRadius: 8,
    padding: 28,
    alignItems: "center",
    marginTop: 20,
  },
  ctaTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    marginBottom: 8,
    textAlign: "center",
  },
  ctaBody: {
    fontSize: 11,
    color: "#94A3B8",
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 1.6,
  },
  ctaButton: {
    backgroundColor: BLUE,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  ctaButtonText: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
  },
  // Page footer
  pageFooter: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pageFooterText: {
    fontSize: 8,
    color: "#94A3B8",
  },
});

function Bullet({ children }: { children: string }) {
  return (
    <View style={s.bulletRow}>
      <View style={s.bulletDot} />
      <Text style={s.bulletText}>{children}</Text>
    </View>
  );
}

function PageFooter({ page }: { page: number }) {
  return (
    <View style={s.pageFooter}>
      <Text style={s.pageFooterText}>Capped Out Labs — cappedoutlabs.com</Text>
      <Text style={s.pageFooterText}>{page}</Text>
    </View>
  );
}

// ── Document ────────────────────────────────────────────────────────

function PlaybookDocument() {
  return (
    <Document
      title="The AI Revenue Infrastructure Playbook"
      author="Capped Out Labs"
      subject="How we took a brand from $200K to $3.9M in 45 days"
    >
      {/* ─── COVER PAGE ─── */}
      <Page size="LETTER" style={s.coverPage}>
        <Text style={s.coverLabel}>Capped Out Labs</Text>
        <Text style={s.coverTitle}>
          The AI Revenue{"\n"}Infrastructure Playbook
        </Text>
        <Text style={s.coverSubtitle}>
          The exact 3-layer system that took a portfolio brand from $200K to $3.9M in 45 days — and how it applies to your business.
        </Text>
        <Text style={s.coverMetric}>+1,866%</Text>
        <Text style={s.coverMetricLabel}>Revenue Growth in 45 Days</Text>
        <View style={s.coverFooter}>
          <Text style={s.coverFooterText}>
            cappedoutlabs.com — Confidential
          </Text>
        </View>
      </Page>

      {/* ─── PAGE 2: THE PROBLEM ─── */}
      <Page size="LETTER" style={s.page}>
        <Text style={s.sectionTag}>The Problem</Text>
        <Text style={s.h1}>Why most businesses leak revenue at the point of sale</Text>
        <Text style={s.body}>
          Most businesses pour money into lead generation and hope the sales process handles the rest. It rarely does.
        </Text>
        <Text style={s.body}>
          Here is what we see in almost every business doing $500K to $10M in revenue:
        </Text>

        <Bullet>Sales reps spend 20-30 minutes researching each prospect before a call — or skip it entirely and wing it</Bullet>
        <Bullet>Follow-up after calls takes 30-60 minutes of manual work — personalized emails, proposals, next steps</Bullet>
        <Bullet>Show rates hover between 25-40% because there is no systematic pre-call engagement</Bullet>
        <Bullet>Every rep runs their own process, which means no process at all</Bullet>
        <Bullet>Leadership has no visibility into what is actually happening on calls</Bullet>

        <Text style={s.body}>
          The result: businesses spend aggressively on ads, generate leads, and then watch 60-80% of that investment evaporate in a broken sales process.
        </Text>

        <View style={s.cardAccent}>
          <Text style={s.h3}>The core insight</Text>
          <Text style={s.bodySecondary}>
            Revenue infrastructure is not about generating more leads. It is about converting the leads you already have at dramatically higher rates — by giving your sales team the right information at the right moment at every stage of the deal.
          </Text>
        </View>

        <PageFooter page={2} />
      </Page>

      {/* ─── PAGE 3: THE FRAMEWORK ─── */}
      <Page size="LETTER" style={s.page}>
        <Text style={s.sectionTag}>The Framework</Text>
        <Text style={s.h1}>3-layer AI revenue infrastructure</Text>
        <Text style={s.body}>
          This is the exact architecture we deployed into a portfolio brand running $94K in monthly ad spend. Every layer compounds on the one before it.
        </Text>

        <View style={s.card}>
          <Text style={s.h3}>Layer 1 — Pre-Call Intelligence</Text>
          <Text style={s.bodySecondary}>
            Before every sales call, the system automatically enriches the prospect with company data, revenue signals, and behavioral indicators. It classifies each buyer into one of four types — Visionary, Analyst, Connector, or Skeptic — and generates a one-page brief with recommended talking points, likely objections, and the value proposition most likely to land.
          </Text>
          <Text style={s.tableCellBold}>Result: Show rate went from 26.3% to 77.9%</Text>
        </View>

        <View style={s.card}>
          <Text style={s.h3}>Layer 2 — Live Call Assistance</Text>
          <Text style={s.bodySecondary}>
            During the call, real-time transcription detects objections, buying signals, and competitor mentions. The system surfaces contextual prompts to the closer without interrupting conversation flow — turning every rep into your best rep.
          </Text>
          <Text style={s.tableCellBold}>Result: Close rate improved from 19.5% to 26.0%</Text>
        </View>

        <View style={s.card}>
          <Text style={s.h3}>Layer 3 — Post-Call Automation</Text>
          <Text style={s.bodySecondary}>
            After every call, the system generates personalized follow-up emails, video scripts, partner communications, and tracked deal room updates — all in seconds. What used to take closers 30-60 minutes of manual work becomes instant and consistent.
          </Text>
          <Text style={s.tableCellBold}>Result: 30-60 min manual work per call reduced to seconds</Text>
        </View>

        <PageFooter page={3} />
      </Page>

      {/* ─── PAGE 4: THE RESULTS ─── */}
      <Page size="LETTER" style={s.page}>
        <Text style={s.sectionTag}>The Results</Text>
        <Text style={s.h1}>45 days of production data</Text>
        <Text style={s.body}>
          These numbers are from a live deployment into a real business — not a pilot, not a simulation. 45 days of production data with real revenue.
        </Text>

        <View style={s.statsRow}>
          <View style={s.statBox}>
            <Text style={s.statValue}>+1,866%</Text>
            <Text style={s.statLabel}>Revenue Growth</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statValue}>23.4x</Text>
            <Text style={s.statLabel}>ROAS</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statValue}>-90%</Text>
            <Text style={s.statLabel}>CAC Reduction</Text>
          </View>
        </View>

        <View style={s.statsRow}>
          <View style={s.statBox}>
            <Text style={s.statValue}>77.9%</Text>
            <Text style={s.statLabel}>Show Rate</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statValue}>138</Text>
            <Text style={s.statLabel}>Deals Closed</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statValue}>$3.42M</Text>
            <Text style={s.statLabel}>Net Profit</Text>
          </View>
        </View>

        {/* Before / After table */}
        <View style={{ marginTop: 8 }}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderText, { flex: 2 }]}>Metric</Text>
            <Text style={[s.tableHeaderText, { flex: 1 }]}>Before</Text>
            <Text style={[s.tableHeaderText, { flex: 1 }]}>After</Text>
          </View>
          {[
            ["Revenue", "$200K", "$3.9M"],
            ["ROAS", "2.1x", "23.4x"],
            ["CAC", "$11,765", "$1,217"],
            ["Show rate", "26.3%", "77.9%"],
            ["Pre-call research", "20-30 min", "Automated"],
            ["Post-call follow-up", "30-60 min", "Seconds"],
          ].map(([metric, before, after], i) => (
            <View
              key={i}
              style={[
                s.tableRow,
                i % 2 === 0 ? { backgroundColor: SURFACE } : {},
              ]}
            >
              <Text style={[s.tableCell, { flex: 2 }]}>{metric}</Text>
              <Text style={[s.tableCell, { flex: 1, color: TEXT_SECONDARY }]}>{before}</Text>
              <Text style={[s.tableCellBold, { flex: 1 }]}>{after}</Text>
            </View>
          ))}
        </View>

        <PageFooter page={4} />
      </Page>

      {/* ─── PAGE 5: BEYOND SALES ─── */}
      <Page size="LETTER" style={s.page}>
        <Text style={s.sectionTag}>Beyond Sales</Text>
        <Text style={s.h1}>This framework works across industries</Text>
        <Text style={s.body}>
          The 3-layer architecture — intelligence before the interaction, assistance during, automation after — applies far beyond sales. We have deployed variations of this system across 8 industries:
        </Text>

        {[
          { industry: "Professional Services (Law)", result: "$420K in additional billable revenue in 90 days" },
          { industry: "Staffing and Recruiting", result: "Revenue per recruiter: $180K → $520K" },
          { industry: "Healthcare and Aesthetics", result: "Monthly revenue up 62%, no-show rate: 25% → 3.8%" },
          { industry: "Wholesale and Distribution", result: "Revenue up 41% from reorders, CS headcount: 4 → 1" },
          { industry: "Real Estate", result: "Revenue per agent up 157% in 9 months" },
          { industry: "Marketing and Creative", result: "Margins: 18% → 41%, reporting: 25 hrs → 3 hrs/month" },
        ].map((item, i) => (
          <View key={i} style={s.bulletRow}>
            <View style={s.bulletDot} />
            <Text style={s.bulletText}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{item.industry}:</Text> {item.result}
            </Text>
          </View>
        ))}

        <View style={[s.cardAccent, { marginTop: 16 }]}>
          <Text style={s.h3}>The pattern</Text>
          <Text style={s.bodySecondary}>
            Every business has a revenue-critical process where humans make decisions based on incomplete information, follow up inconsistently, and lose momentum between interactions. AI infrastructure fixes all three simultaneously.
          </Text>
        </View>

        <View style={s.divider} />

        <Text style={s.sectionTag}>What This Means for You</Text>
        <Text style={s.body}>
          If your business is doing $500K or more in annual revenue, you likely have at least one process where this framework would produce measurable ROI within 90 days. The question is not whether AI can help — it is which process to target first.
        </Text>

        <View style={s.ctaBox}>
          <Text style={s.ctaTitle}>Ready to find your highest-leverage process?</Text>
          <Text style={s.ctaBody}>
            Take the free 30-second AI readiness assessment. We will identify the single highest-ROI system for your business and show you exactly what the numbers could look like.
          </Text>
          <Link src="https://cappedoutlabs.com/apply">
            <View style={s.ctaButton}>
              <Text style={s.ctaButtonText}>Apply for a Discovery Call</Text>
            </View>
          </Link>
        </View>

        <PageFooter page={5} />
      </Page>
    </Document>
  );
}

// ── Export render function ───────────────────────────────────────────

export async function renderPlaybookPDF(): Promise<Buffer> {
  return renderToBuffer(<PlaybookDocument />);
}
