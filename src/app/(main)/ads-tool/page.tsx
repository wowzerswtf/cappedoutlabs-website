import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Capped Out Labs Ads Tool | Capped Out Labs",
  description:
    "What the Capped Out Labs internal advertising tool is, how it connects to the Google Ads API, what data it accesses, and who can use it.",
  alternates: { canonical: "/ads-tool" },
  robots: { index: true, follow: true },
};

export default function AdsToolPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy mb-8">
        Capped Out Labs Ads Tool
      </h1>
      <div className="text-sm text-text-primary leading-relaxed space-y-4">
        <p>
          Capped Out Labs operates an internal advertising management and
          reporting application, named Capped Out Labs, that our team uses to
          run our own ad campaigns. This page describes what that application
          does and how it uses your authorization when you sign in with Google.
        </p>

        <h2 className="text-xl font-semibold text-navy pt-4">
          What the application does
        </h2>
        <p>
          The application connects to the Google Ads API to manage and report
          on advertising accounts owned by Capped Out Labs. Our staff use it
          to pull daily performance reports (spend, clicks, conversions, cost
          per conversion) and to make routine campaign changes such as
          creating or editing campaigns, ads, and budgets, and pausing or
          activating them.
        </p>

        <h2 className="text-xl font-semibold text-navy pt-4">
          How it uses Google account access
        </h2>
        <p>
          When a team member signs in with Google, the application requests
          authorization for the Google Ads scope. That authorization is used
          only to read performance data from, and make changes to, Google Ads
          accounts our company owns and administers. The application does not
          access Gmail, Drive, contacts, or any other Google service, and it
          never accesses accounts that do not belong to us.
        </p>

        <h2 className="text-xl font-semibold text-navy pt-4">
          Who can use it
        </h2>
        <p>
          The application is internal software. It runs on company
          workstations, is used only by Capped Out Labs staff, and is not
          sold, distributed, or made available to clients or any third party.
          There is no public signup.
        </p>

        <h2 className="text-xl font-semibold text-navy pt-4">
          Data handling
        </h2>
        <p>
          The application processes our own advertising performance data.
          It does not collect or store information about end users or any
          third party. Report output stays on company systems. Access
          credentials are stored locally, are never shared, and are revocable
          at any time from the Google account&apos;s security settings. Our
          handling of data is covered by our{" "}
          <Link href="/privacy" className="underline text-navy">
            privacy policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="underline text-navy">
            terms of service
          </Link>
          .
        </p>

        <h2 className="text-xl font-semibold text-navy pt-4">Contact</h2>
        <p>
          Questions about this application can be sent to{" "}
          <a
            href="mailto:waynard@cappedoutmedia.com"
            className="underline text-navy"
          >
            waynard@cappedoutmedia.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}
