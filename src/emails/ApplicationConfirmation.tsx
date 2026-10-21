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

interface ApplicationConfirmationProps {
  firstName: string;
  lastName: string;
  businessName: string;
  tierInterest: string;
  annualRevenue: string;
  // Prefilled GHL booking link so they can grab a slot from the email
  bookingUrl?: string;
  // Funnel slug (see src/lib/funnels/registry.ts). "own" swaps the call
  // description and the VSL link for the stop-renting-software pitch.
  funnel?: string;
}

export function ApplicationConfirmation({
  firstName = "there",
  lastName = "",
  businessName = "",
  tierInterest = "",
  annualRevenue = "",
  bookingUrl = "https://cappedoutlabs.com/book",
  funnel,
}: ApplicationConfirmationProps) {
  const own = funnel === "own";
  return (
    <Html>
      <Head />
      <Preview>Your application is in, {firstName}. Next step: book your call.</Preview>
      <Body style={main}>
        {/* Navy header bar */}
        <Section style={header}>
          <Text style={headerText}>Capped Out Labs</Text>
        </Section>

        <Container style={container}>
          <Heading style={h1}>You&apos;re a fit, {firstName}. Book your call.</Heading>

          <Text style={paragraph}>Hi {firstName},</Text>
          <Text style={paragraph}>
            Your application is in. Here&apos;s how it goes from here:
          </Text>

          {/* Three steps */}
          <Section style={stepsSection}>
            <table
              cellPadding="0"
              cellSpacing="0"
              style={{ width: "100%" }}
            >
              <tbody>
                <tr>
                  <td style={stepNumberCell}>
                    <div style={stepCircle}>1</div>
                  </td>
                  <td style={stepContent}>
                    <Text style={stepTitle}>Book your discovery call</Text>
                    <Text style={stepDetail}>
                      Pick a time on the calendar below. Already grabbed one?
                      You&apos;re set, the calendar invite is in your inbox.
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td style={stepNumberCell}>
                    <div style={stepCircle}>2</div>
                  </td>
                  <td style={stepContent}>
                    <Text style={stepTitle}>
                      {own
                        ? "We look at what you're renting before the call"
                        : "We review your application before the call"}
                    </Text>
                    <Text style={stepDetail}>
                      {own
                        ? "You get 30 minutes with a builder who already knows your tools. We tell you what we'd build first, and what it costs."
                        : "We show up already knowing your business. 30 minutes. No pitch decks. We map your bottleneck to a 90-day build plan."}
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td style={stepNumberCell}>
                    <div style={stepCircle}>3</div>
                  </td>
                  <td style={stepContent}>
                    <Text style={stepTitle}>
                      You&apos;ll know within 48 hours of the call
                    </Text>
                    <Text style={stepDetail}>
                      Whether we&apos;re moving forward and what that looks like.
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Primary CTA: booking */}
          <Section style={{ textAlign: "center" as const, margin: "28px 0" }}>
            <Link href={bookingUrl} style={ctaButton}>
              Book Your Call
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={paragraph}>
            {own
              ? "Before the call, run your own numbers through the rent calculator if you haven't. Bring the result; it's where the conversation starts."
              : "Before the call, watch the VSL if you haven't already. It explains how we work and what the systems look like in production."}
          </Text>

          <Section style={{ textAlign: "center" as const, margin: "28px 0" }}>
            <Link
              href={own ? "https://cappedoutlabs.com/f/own#math" : "https://cappedoutlabs.com/#vsl"}
              style={secondaryButton}
            >
              {own ? "Run the numbers on your software rent" : "Watch: How We Build AI Systems"}
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={paragraph}>
            One thing worth knowing: we take on a limited number of clients each
            quarter. The call is where we find out if you&apos;re one of them.
          </Text>

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

        <EmailFooter />
      </Body>
    </Html>
  );
}

function EmailFooter() {
  return (
    <Section style={footer}>
      <Text style={footerText}>
        You received this because you applied at{" "}
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
  );
}

export default ApplicationConfirmation;

// --- Styles ---

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
  fontSize: "24px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 24px",
};

const paragraph: React.CSSProperties = {
  color: "#0f172a",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const stepsSection: React.CSSProperties = {
  margin: "24px 0",
  padding: "20px 24px",
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const stepNumberCell: React.CSSProperties = {
  width: "28px",
  verticalAlign: "top",
  padding: "0",
};

const stepCircle: React.CSSProperties = {
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

const stepContent: React.CSSProperties = {
  paddingLeft: "14px",
  paddingBottom: "16px",
  verticalAlign: "top",
};

const stepTitle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: "15px",
  fontWeight: "600",
  margin: "0 0 2px",
  lineHeight: "1.4",
};

const stepDetail: React.CSSProperties = {
  color: "#64748b",
  fontSize: "13px",
  margin: "0",
  lineHeight: "1.5",
};

const hr: React.CSSProperties = {
  borderColor: "#e2e8f0",
  margin: "24px 0",
};

const ctaButton: React.CSSProperties = {
  backgroundColor: "#2563EB",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: "600",
  padding: "12px 28px",
  textDecoration: "none",
};

const secondaryButton: React.CSSProperties = {
  backgroundColor: "#1a3a5c",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: "600",
  padding: "12px 28px",
  textDecoration: "none",
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
