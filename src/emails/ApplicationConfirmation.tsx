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
}

export function ApplicationConfirmation({
  firstName = "there",
  lastName = "",
  businessName = "",
  tierInterest = "",
  annualRevenue = "",
}: ApplicationConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>We got your application, {firstName} — here&apos;s what happens next.</Preview>
      <Body style={main}>
        {/* Navy header bar */}
        <Section style={header}>
          <Text style={headerText}>Capped Out Labs</Text>
        </Section>

        <Container style={container}>
          <Heading style={h1}>We got your application, {firstName}.</Heading>

          <Text style={paragraph}>Hi {firstName},</Text>
          <Text style={paragraph}>
            Your application to Capped Out Labs is received.
          </Text>
          <Text style={paragraph}>Here&apos;s what happens next:</Text>

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
                    <Text style={stepTitle}>We review your application</Text>
                    <Text style={stepDetail}>
                      Usually within 24 hours, often faster.
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td style={stepNumberCell}>
                    <div style={stepCircle}>2</div>
                  </td>
                  <td style={stepContent}>
                    <Text style={stepTitle}>
                      If it&apos;s a fit, we reach out to book a call
                    </Text>
                    <Text style={stepDetail}>
                      30 minutes. No pitch decks. Real conversation about your
                      business.
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

          <Hr style={hr} />

          <Text style={paragraph}>
            While you wait, watch the VSL if you haven&apos;t already — it explains
            exactly how we work and what the systems look like in production.
          </Text>

          {/* CTA Button */}
          <Section style={{ textAlign: "center" as const, margin: "28px 0" }}>
            <Link href="https://cappedoutlabs.com/#vsl" style={ctaButton}>
              Watch: How We Build AI Systems
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={paragraph}>
            One thing worth knowing: we take on a limited number of clients each
            quarter. If we reach out, it means we genuinely believe we can move
            your numbers.
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

        {/* Footer */}
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
      </Body>
    </Html>
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
