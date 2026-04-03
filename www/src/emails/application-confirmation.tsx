import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Preview,
  Font,
  Row,
  Column,
} from "@react-email/components";

interface ApplicationConfirmationEmailProps {
  candidateName: string;
  jobTitle: string;
  organizationName: string;
  careersUrl: string;
}

export function ApplicationConfirmationEmail({
  candidateName,
  jobTitle,
  organizationName,
  careersUrl,
}: ApplicationConfirmationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKZAZ9hiJ-Ek-_EeA.woff2",
            format: "woff2",
          }}
          fontWeight={600}
          fontStyle="normal"
        />
      </Head>
      <Preview>
        Your application for {jobTitle} at {organizationName} has been received.
      </Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={brandName}>lunics</Text>
          </Section>

          {/* Main content */}
          <Section style={main}>
            {/* Status badge */}
            <Section style={badgeRow}>
              <Text style={badge}>Application Received</Text>
            </Section>

            <Heading style={heading}>Your application is in.</Heading>

            <Text style={paragraph}>Hi {candidateName},</Text>

            <Text style={paragraph}>
              Thanks for applying to{" "}
              <span style={bold}>{organizationName}</span> — we&apos;ve received
              your application for the <span style={bold}>{jobTitle}</span>{" "}
              role.
            </Text>

            <Text style={paragraph}>
              The team will review your application and be in touch if your
              experience is a good fit. We appreciate your interest and the time
              you took to apply.
            </Text>

            <Hr style={divider} />

            {/* What's next */}
            <Heading as="h2" style={subheading}>
              What happens next?
            </Heading>

            <Section>
              <Row style={stepRow}>
                <Column style={stepNumber}>
                  <Text style={stepNumText}>1</Text>
                </Column>
                <Column style={stepContent}>
                  <Text style={stepTitle}>Application review</Text>
                  <Text style={stepDescription}>
                    The hiring team will review your application and resume.
                  </Text>
                </Column>
              </Row>

              <Row style={stepRow}>
                <Column style={stepNumber}>
                  <Text style={stepNumText}>2</Text>
                </Column>
                <Column style={stepContent}>
                  <Text style={stepTitle}>Next steps</Text>
                  <Text style={stepDescription}>
                    If selected, you&apos;ll hear from {organizationName} about
                    the next steps in their hiring process.
                  </Text>
                </Column>
              </Row>

              <Row style={stepRow}>
                <Column style={stepNumber}>
                  <Text style={stepNumText}>3</Text>
                </Column>
                <Column style={stepContent}>
                  <Text style={stepTitle}>Stay in touch</Text>
                  <Text style={stepDescription}>
                    In the meantime, feel free to explore other open roles at{" "}
                    <Link href={careersUrl} style={link}>
                      {organizationName}&apos;s careers page
                    </Link>
                    .
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr style={divider} />

            <Text style={footer}>
              This is an automated confirmation. Please do not reply to this
              email. If you have questions, visit{" "}
              <Link href={careersUrl} style={link}>
                {organizationName}&apos;s careers page
              </Link>
              .
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              Powered by{" "}
              <Link href="https://lunics.co" style={footerLink}>
                lunics
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: "#f5f5f5",
  fontFamily: "Inter, Arial, sans-serif",
  margin: 0,
  padding: "32px 0",
};

const container: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
};

const header: React.CSSProperties = {
  backgroundColor: "#000000",
  padding: "20px 32px",
};

const brandName: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: 700,
  letterSpacing: "-0.5px",
  margin: 0,
  lineHeight: "1",
};

const main: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "36px 32px",
};

const badgeRow: React.CSSProperties = {
  marginBottom: "16px",
};

const badge: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#f0fdf4",
  color: "#16a34a",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  padding: "4px 10px",
  borderRadius: "0px",
  border: "1px solid #bbf7d0",
  margin: 0,
};

const heading: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: 700,
  color: "#0a0a0a",
  letterSpacing: "-0.5px",
  lineHeight: "1.2",
  margin: "0 0 20px 0",
};

const subheading: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 600,
  color: "#0a0a0a",
  letterSpacing: "-0.2px",
  margin: "0 0 16px 0",
};

const paragraph: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.7",
  color: "#444444",
  margin: "0 0 14px 0",
};

const bold: React.CSSProperties = {
  fontWeight: 600,
  color: "#0a0a0a",
};

const divider: React.CSSProperties = {
  borderColor: "#e5e5e5",
  margin: "28px 0",
};

const stepRow: React.CSSProperties = {
  marginBottom: "16px",
};

const stepNumber: React.CSSProperties = {
  width: "28px",
  verticalAlign: "top",
  paddingTop: "1px",
};

const stepNumText: React.CSSProperties = {
  width: "22px",
  height: "22px",
  borderRadius: "0px",
  backgroundColor: "#f5f5f5",
  border: "1px solid #e5e5e5",
  fontSize: "11px",
  fontWeight: 600,
  color: "#555555",
  textAlign: "center",
  lineHeight: "22px",
  margin: 0,
};

const stepContent: React.CSSProperties = {
  verticalAlign: "top",
  paddingLeft: "8px",
};

const stepTitle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#0a0a0a",
  margin: "0 0 2px 0",
  lineHeight: "1.4",
};

const stepDescription: React.CSSProperties = {
  fontSize: "13px",
  color: "#666666",
  lineHeight: "1.6",
  margin: 0,
};

const link: React.CSSProperties = {
  color: "#0a0a0a",
  textDecoration: "underline",
  textUnderlineOffset: "2px",
};

const footer: React.CSSProperties = {
  fontSize: "12px",
  color: "#999999",
  lineHeight: "1.6",
  margin: 0,
};

const footerSection: React.CSSProperties = {
  padding: "16px 32px",
  textAlign: "center",
};

const footerText: React.CSSProperties = {
  fontSize: "11px",
  color: "#aaaaaa",
  margin: 0,
};

const footerLink: React.CSSProperties = {
  color: "#aaaaaa",
  textDecoration: "underline",
};
