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

interface PlaybookDeliveryProps {
  email: string;
}

export function PlaybookDelivery({ email: _email }: PlaybookDeliveryProps) {
  return (
    <Html>
      <Head />
      <Preview>Your AI Revenue Infrastructure Playbook is ready.</Preview>
      <Body style={main}>
        <Section style={header}>
          <Text style={headerText}>Capped Out Labs</Text>
        </Section>

        <Container style={container}>
          <Heading style={h1}>Your playbook is ready.</Heading>

          <Text style={paragraph}>
            Here is the AI Revenue Infrastructure Playbook — the exact 3-layer
            framework we used to take a portfolio brand from $200K to $3.9M in
            45 days.
          </Text>

          <Section style={{ textAlign: "center" as const, margin: "28px 0" }}>
            <Link
              href="https://cappedoutlabs.com/ai-revenue-infrastructure-playbook.pdf"
              style={ctaButton}
            >
              Download the Playbook (PDF)
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={paragraph}>
            <Text style={bold}>What&apos;s inside:</Text>
          </Text>

          <Section style={stepsSection}>
            <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td style={stepNumberCell}>
                    <div style={stepCircle}>1</div>
                  </td>
                  <td style={stepContent}>
                    <Text style={stepTitle}>The 3-Layer System</Text>
                    <Text style={stepDetail}>
                      Pre-call intelligence, live call assistance, post-call
                      automation — how each layer compounds.
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td style={stepNumberCell}>
                    <div style={stepCircle}>2</div>
                  </td>
                  <td style={stepContent}>
                    <Text style={stepTitle}>Before &amp; After Metrics</Text>
                    <Text style={stepDetail}>
                      +1,866% revenue. 23.4x ROAS. -90% CAC. 45 days of
                      production data.
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td style={stepNumberCell}>
                    <div style={stepCircle}>3</div>
                  </td>
                  <td style={stepContent}>
                    <Text style={stepTitle}>Cross-Industry Application</Text>
                    <Text style={stepDetail}>
                      How this framework adapts to law, staffing, healthcare,
                      real estate, wholesale, and agencies.
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          <Text style={paragraph}>
            If you want to find out which process in your business would benefit
            most from this framework, apply for a discovery call. We will map it
            out for you.
          </Text>

          <Section style={{ textAlign: "center" as const, margin: "28px 0" }}>
            <Link href="https://cappedoutlabs.com/apply" style={ctaButtonAlt}>
              Apply for a Discovery Call
            </Link>
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

        <Section style={footer}>
          <Text style={footerText}>
            You received this because you requested the playbook at{" "}
            <Link href="https://cappedoutlabs.com" style={footerLink}>
              cappedoutlabs.com
            </Link>
            .
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

export default PlaybookDelivery;

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

const bold: React.CSSProperties = {
  fontWeight: "700",
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

const ctaButtonAlt: React.CSSProperties = {
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
