"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface LegalModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function LegalModal({ open, onClose, title, children }: LegalModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-navy">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-text-secondary" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-6 text-sm text-text-primary leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export function PrivacyContent() {
  return (
    <>
      <p className="text-xs text-text-secondary">Effective date: April 6, 2026</p>

      <p>
        Capped Out Labs, LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;Company&rdquo;) operates
        cappedoutlabs.com. This Privacy Policy explains how we collect, use, and protect your
        information when you visit our website or submit an application.
      </p>

      <h3 className="font-semibold text-navy pt-2">1. Information We Collect</h3>
      <p><strong>Information you provide:</strong> When you submit an application, we collect your
        name, email address, phone number, business name, website URL, annual revenue range, team
        size, operational bottleneck description, AI experience, tier interest, and referral source.
      </p>
      <p><strong>Automatically collected:</strong> We collect standard web analytics data including
        IP address, browser type, device type, pages visited, and referring URL. We use Vercel
        Analytics for this purpose.
      </p>

      <h3 className="font-semibold text-navy pt-2">2. How We Use Your Information</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>To review your application and determine fit for our services</li>
        <li>To contact you about your application and schedule discovery calls</li>
        <li>To send you a confirmation email upon application submission</li>
        <li>To send follow-up communications related to your inquiry</li>
        <li>To improve our website and services</li>
      </ul>

      <h3 className="font-semibold text-navy pt-2">3. Third-Party Services</h3>
      <p>We use the following third-party services to process your information:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>GoHighLevel</strong> — CRM and pipeline management for application processing</li>
        <li><strong>Resend</strong> — transactional email delivery for application confirmations</li>
        <li><strong>Vercel</strong> — website hosting and analytics</li>
        <li><strong>Vimeo</strong> — video hosting and playback</li>
      </ul>
      <p>Each third-party service has its own privacy policy governing their use of your data.</p>

      <h3 className="font-semibold text-navy pt-2">4. Data Retention</h3>
      <p>
        We retain your application data for as long as necessary to evaluate your application and
        maintain our business relationship. If you would like your data deleted, contact us at
        hello@cappedoutlabs.com.
      </p>

      <h3 className="font-semibold text-navy pt-2">5. Data Security</h3>
      <p>
        We use industry-standard security measures including HTTPS encryption, secure API
        authentication, and access controls to protect your information. However, no method of
        transmission over the internet is 100% secure.
      </p>

      <h3 className="font-semibold text-navy pt-2">6. Your Rights</h3>
      <p>You have the right to:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Request access to the personal data we hold about you</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Opt out of marketing communications</li>
      </ul>
      <p>To exercise any of these rights, email us at hello@cappedoutlabs.com.</p>

      <h3 className="font-semibold text-navy pt-2">7. Cookies</h3>
      <p>
        We use essential cookies for website functionality and analytics cookies to understand
        how visitors use our site. We do not use advertising cookies or sell your data to
        third parties.
      </p>

      <h3 className="font-semibold text-navy pt-2">8. Children&apos;s Privacy</h3>
      <p>
        Our services are not directed to individuals under 18. We do not knowingly collect
        information from children.
      </p>

      <h3 className="font-semibold text-navy pt-2">9. Changes to This Policy</h3>
      <p>
        We may update this Privacy Policy from time to time. Changes will be posted on this
        page with an updated effective date.
      </p>

      <h3 className="font-semibold text-navy pt-2">10. Contact</h3>
      <p>
        For questions about this Privacy Policy, contact us at:<br />
        <strong>Email:</strong> hello@cappedoutlabs.com<br />
        <strong>Company:</strong> Capped Out Labs, LLC
      </p>
    </>
  );
}

export function TermsContent() {
  return (
    <>
      <p className="text-xs text-text-secondary">Effective date: April 6, 2026</p>

      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your use of cappedoutlabs.com
        and any services provided by Capped Out Labs, LLC (&ldquo;Company,&rdquo;
        &ldquo;we,&rdquo; or &ldquo;us&rdquo;). By accessing our website or submitting an
        application, you agree to these Terms.
      </p>

      <h3 className="font-semibold text-navy pt-2">1. Services Overview</h3>
      <p>
        Capped Out Labs provides AI transformation infrastructure, consulting, and
        implementation services for businesses. Our services are offered in tiered
        engagements and are subject to mutual agreement via a separate service contract.
      </p>

      <h3 className="font-semibold text-navy pt-2">2. Application Process</h3>
      <p>
        Submitting an application through our website does not guarantee acceptance into
        our program or create a binding agreement. Applications are reviewed at our
        discretion. We reserve the right to decline any application for any reason.
      </p>

      <h3 className="font-semibold text-navy pt-2">3. Discovery Calls</h3>
      <p>
        Discovery calls are complimentary and carry no obligation. They are informational
        conversations to determine mutual fit. No services are rendered and no fees are
        charged during discovery calls.
      </p>

      <h3 className="font-semibold text-navy pt-2">4. Service Agreements</h3>
      <p>
        All paid engagements are governed by a separate Master Services Agreement (MSA)
        or Statement of Work (SOW) executed by both parties. These Terms do not constitute
        a service agreement. Pricing, scope, timelines, and deliverables are defined
        exclusively in the executed service contract.
      </p>

      <h3 className="font-semibold text-navy pt-2">5. Intellectual Property</h3>
      <p>
        All content on this website — including text, graphics, logos, videos, and design —
        is the property of Capped Out Labs, LLC and is protected by applicable intellectual
        property laws. You may not reproduce, distribute, or create derivative works from
        our content without written permission.
      </p>

      <h3 className="font-semibold text-navy pt-2">6. Accuracy of Information</h3>
      <p>
        You agree to provide accurate, current, and complete information when submitting
        an application. We reserve the right to decline applications that contain false
        or misleading information.
      </p>

      <h3 className="font-semibold text-navy pt-2">7. Limitation of Liability</h3>
      <p>
        To the maximum extent permitted by law, Capped Out Labs, LLC shall not be liable
        for any indirect, incidental, special, consequential, or punitive damages arising
        from your use of our website or services. Our total liability shall not exceed
        the amount paid by you for services in the twelve months preceding the claim.
      </p>

      <h3 className="font-semibold text-navy pt-2">8. Indemnification</h3>
      <p>
        You agree to indemnify and hold harmless Capped Out Labs, LLC, its officers,
        employees, and agents from any claims, damages, or expenses arising from your
        use of the website or breach of these Terms.
      </p>

      <h3 className="font-semibold text-navy pt-2">9. Confidentiality</h3>
      <p>
        Information shared during the application process and discovery calls is treated
        as confidential. We will not share your business information with third parties
        except as necessary to provide our services or as required by law.
      </p>

      <h3 className="font-semibold text-navy pt-2">10. Termination</h3>
      <p>
        We reserve the right to restrict or terminate your access to our website at any
        time, without notice, for any reason.
      </p>

      <h3 className="font-semibold text-navy pt-2">11. Governing Law</h3>
      <p>
        These Terms are governed by and construed in accordance with the laws of the
        State of Delaware, without regard to conflict of law principles.
      </p>

      <h3 className="font-semibold text-navy pt-2">12. Changes to Terms</h3>
      <p>
        We may update these Terms from time to time. Continued use of the website after
        changes constitutes acceptance of the revised Terms.
      </p>

      <h3 className="font-semibold text-navy pt-2">13. Contact</h3>
      <p>
        For questions about these Terms, contact us at:<br />
        <strong>Email:</strong> hello@cappedoutlabs.com<br />
        <strong>Company:</strong> Capped Out Labs, LLC
      </p>
    </>
  );
}
