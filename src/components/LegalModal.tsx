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
      <p className="text-xs text-text-secondary">Effective date: June 25, 2026</p>

      <p>
        Capped Out Media LLC (&ldquo;Capped Out Media,&rdquo; &ldquo;we,&rdquo;
        &ldquo;us,&rdquo; or &ldquo;Company&rdquo;) operates cappedoutlabs.com and
        does business as Capped Out Labs. This Privacy Policy explains what we
        collect, how we use it, and the choices you have. By using this website or
        submitting a form, you agree to this Policy.
      </p>

      <h3 className="font-semibold text-navy pt-2">1. Information We Collect</h3>
      <p><strong>Information you provide:</strong> name, email address, phone number,
        business name, website, annual revenue range, team size, your description of
        operational bottlenecks, AI experience, tier interest, referral source, and
        anything else you submit through our forms or share on a call.</p>
      <p><strong>Consent records:</strong> when you check a consent box, we store the
        exact language shown to you, the date and time, your IP address, and your
        browser user-agent, as a record of your consent.</p>
      <p><strong>Communications data:</strong> if you call, text, or speak with us
        (including with an automated AI agent), we may keep call recordings,
        transcripts, and message history.</p>
      <p><strong>Automatically collected:</strong> standard analytics such as IP
        address, browser and device type, pages visited, and referring URL, through
        Vercel Analytics.</p>

      <h3 className="font-semibold text-navy pt-2">2. How We Use Your Information</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Review your application and decide whether we are a fit</li>
        <li>Contact you about your inquiry and schedule calls</li>
        <li>Contact you by phone, text, and email, including with automated technology,
          AI or prerecorded voice, and SMS, where you have given consent</li>
        <li>Send confirmations, follow-ups, and service updates</li>
        <li>Maintain records, including consent and opt-out records, for legal compliance</li>
        <li>Improve our website and services</li>
      </ul>

      <h3 className="font-semibold text-navy pt-2">3. Phone, Text, and Calling Consent</h3>
      <p>
        When you provide a phone number and check the consent box, you give your prior
        express written consent for us to contact that number using automated dialing
        technology, artificial, prerecorded, or AI-generated voice, and SMS text
        messages, for marketing and informational purposes. Consent is not a condition
        of purchasing anything. You can withdraw consent at any time (see Section 4). We
        honor the National Do Not Call Registry and internal do-not-contact requests.
      </p>

      <h3 className="font-semibold text-navy pt-2">4. How to Opt Out</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Text messages:</strong> reply STOP to any message to stop texts, or HELP for help.</li>
        <li><strong>Calls:</strong> tell us on any call, or email hello@cappedoutlabs.com, to be added to our do-not-call list.</li>
        <li><strong>Email:</strong> use the unsubscribe link or email us.</li>
      </ul>
      <p>We process opt-out requests promptly. You may still receive transactional
        messages related to an active engagement.</p>

      <h3 className="font-semibold text-navy pt-2">5. SMS Messaging Program</h3>
      <p>
        Message frequency varies. Message and data rates may apply. We do not sell or
        share your mobile phone number or SMS opt-in with any third party for their
        marketing. Carriers are not liable for delayed or undelivered messages.
      </p>

      <h3 className="font-semibold text-navy pt-2">6. AI Calls and Call Recording</h3>
      <p>
        Some calls may be placed or answered by an automated AI agent using a synthetic
        or prerecorded voice. Calls may be monitored or recorded for quality, training,
        and record-keeping. If you do not want to be recorded, tell us and we will end
        or adjust the call.
      </p>

      <h3 className="font-semibold text-navy pt-2">7. Third-Party Services</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>GoHighLevel</strong>: CRM, pipeline, calling, and messaging</li>
        <li><strong>Telephony and AI voice providers</strong>: to place and receive calls and texts</li>
        <li><strong>Resend</strong>: transactional email delivery</li>
        <li><strong>Vercel</strong>: website hosting and analytics</li>
        <li><strong>Vimeo</strong>: video hosting and playback</li>
      </ul>
      <p>Each provider has its own privacy policy governing its use of data. We share
        only what is needed to deliver the service.</p>

      <h3 className="font-semibold text-navy pt-2">8. We Do Not Sell Your Data</h3>
      <p>We do not sell or rent your personal information. We share it only with service
        providers acting on our behalf, or when required by law.</p>

      <h3 className="font-semibold text-navy pt-2">9. Data Retention</h3>
      <p>We keep your information for as long as needed to evaluate your inquiry and run
        our relationship, and we keep consent and opt-out records for as long as needed
        to comply with the law. To request deletion, email hello@cappedoutlabs.com.</p>

      <h3 className="font-semibold text-navy pt-2">10. Your Rights</h3>
      <p>Depending on where you live, you may have the right to access, correct, or
        delete your data, and to opt out of marketing. Residents of California and other
        states with privacy laws may have additional rights. To exercise any right,
        email hello@cappedoutlabs.com.</p>

      <h3 className="font-semibold text-navy pt-2">11. Data Security</h3>
      <p>We use industry-standard measures including HTTPS encryption, secure API
        authentication, and access controls. No method of transmission over the internet
        is fully secure.</p>

      <h3 className="font-semibold text-navy pt-2">12. Cookies</h3>
      <p>We use essential cookies for functionality and analytics cookies to understand
        site usage. We do not use advertising cookies or sell your data.</p>

      <h3 className="font-semibold text-navy pt-2">13. Children&apos;s Privacy</h3>
      <p>Our services are not directed to anyone under 18, and we do not knowingly
        collect information from children.</p>

      <h3 className="font-semibold text-navy pt-2">14. Changes to This Policy</h3>
      <p>We may update this Policy. Changes are posted here with a new effective date.</p>

      <h3 className="font-semibold text-navy pt-2">15. Contact</h3>
      <p>
        <strong>Email:</strong> hello@cappedoutlabs.com<br />
        <strong>Company:</strong> Capped Out Media LLC (dba Capped Out Labs)
      </p>
    </>
  );
}

export function TermsContent() {
  return (
    <>
      <p className="text-xs text-text-secondary">Effective date: June 25, 2026</p>

      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your use of
        cappedoutlabs.com and any services provided by Capped Out Media LLC
        (&ldquo;Capped Out Media,&rdquo; &ldquo;Company,&rdquo; &ldquo;we,&rdquo; or
        &ldquo;us&rdquo;), which does business as Capped Out Labs. By accessing the
        website, submitting a form, or communicating with us, you agree to these Terms.
        If you do not agree, do not use the website.
      </p>

      <h3 className="font-semibold text-navy pt-2">1. Services Overview</h3>
      <p>We provide AI infrastructure, consulting, and implementation services for
        businesses, offered in tiered engagements and subject to a separate service
        contract.</p>

      <h3 className="font-semibold text-navy pt-2">2. Application Process</h3>
      <p>Submitting a form does not guarantee acceptance or create a binding agreement.
        We review applications at our discretion and may decline any for any lawful
        reason.</p>

      <h3 className="font-semibold text-navy pt-2">3. Discovery Calls</h3>
      <p>Discovery calls are complimentary and carry no obligation. No services are
        rendered and no fees are charged during them.</p>

      <h3 className="font-semibold text-navy pt-2">4. Communications and TCPA Consent</h3>
      <p>
        By providing your phone number and checking the consent box, you give your prior
        express written consent for Capped Out Media to contact you at that number for
        marketing and informational purposes, including by automated dialing technology,
        artificial, prerecorded, or AI-generated voice, and SMS text messages. You
        confirm that you are the subscriber or customary user of the number and are
        authorized to give this consent. Consent is not a condition of purchasing any
        goods or services. Message frequency varies, and message and data rates may
        apply. You may withdraw consent at any time by replying STOP to a text, telling
        us on a call, or emailing hello@cappedoutlabs.com.
      </p>

      <h3 className="font-semibold text-navy pt-2">5. SMS Messaging Terms</h3>
      <p>Reply STOP to opt out and HELP for help. Message and data rates may apply. We
        do not sell or share your mobile opt-in with third parties for their marketing.
        Carriers are not liable for delayed or undelivered messages.</p>

      <h3 className="font-semibold text-navy pt-2">6. AI Interactions and Call Recording</h3>
      <p>You understand and agree that some calls may be placed or handled by an
        automated AI agent using a synthetic or prerecorded voice, and that calls may be
        monitored or recorded for quality, training, and record-keeping, to the extent
        permitted by law.</p>

      <h3 className="font-semibold text-navy pt-2">7. Service Agreements</h3>
      <p>All paid engagements are governed by a separate Master Services Agreement (MSA)
        or Statement of Work (SOW) signed by both parties. These Terms are not a service
        agreement. Pricing, scope, timelines, and deliverables are defined only in the
        executed contract.</p>

      <h3 className="font-semibold text-navy pt-2">8. No Guarantee of Results</h3>
      <p>Any results, revenue figures, or case studies shown on this website are
        specific to those clients and are not promises or guarantees of your results.
        Your results depend on many factors, including your market, execution, and
        effort. All business involves risk. Nothing on this website is financial, legal,
        or tax advice.</p>

      <h3 className="font-semibold text-navy pt-2">9. Intellectual Property</h3>
      <p>All website content, including text, graphics, logos, videos, and design, is
        owned by Capped Out Media LLC and protected by intellectual property laws. You
        may not reproduce, distribute, or create derivative works from it without
        written permission.</p>

      <h3 className="font-semibold text-navy pt-2">10. Accuracy of Information</h3>
      <p>You agree to provide accurate, current, and complete information. We may decline
        applications that contain false or misleading information.</p>

      <h3 className="font-semibold text-navy pt-2">11. Disclaimer of Warranties</h3>
      <p>The website and any free materials are provided &ldquo;as is&rdquo; and
        &ldquo;as available,&rdquo; without warranties of any kind, express or implied,
        including merchantability, fitness for a particular purpose, and
        non-infringement, to the maximum extent permitted by law.</p>

      <h3 className="font-semibold text-navy pt-2">12. Limitation of Liability</h3>
      <p>To the maximum extent permitted by law, Capped Out Media LLC is not liable for
        any indirect, incidental, special, consequential, or punitive damages arising
        from your use of the website or services. Our total liability for any claim will
        not exceed the amount you paid us for services in the twelve months before the
        claim, or $100 if you paid nothing.</p>

      <h3 className="font-semibold text-navy pt-2">13. Indemnification</h3>
      <p>You agree to indemnify and hold harmless Capped Out Media LLC, its members,
        officers, employees, and agents from any claims, damages, losses, or expenses
        (including reasonable attorneys&apos; fees) arising from your use of the website,
        your content, or your breach of these Terms.</p>

      <h3 className="font-semibold text-navy pt-2">14. Confidentiality</h3>
      <p>Information shared during the application process and discovery calls is treated
        as confidential. We will not share your business information except as needed to
        provide services or as required by law.</p>

      <h3 className="font-semibold text-navy pt-2">15. Dispute Resolution; Binding Arbitration; Class Action Waiver</h3>
      <p>
        Please read this section carefully, as it affects your legal rights. You and
        Capped Out Media agree that any dispute arising out of or relating to these
        Terms, the website, or our communications (including calls and texts) will be
        resolved by binding individual arbitration administered by the American
        Arbitration Association under its Consumer Arbitration Rules, rather than in
        court, except that either party may bring an individual claim in small claims
        court. The arbitration will take place in Utah or by remote means. You and Capped
        Out Media waive any right to a jury trial and agree that claims may be brought
        only in an individual capacity, and not as a plaintiff or class member in any
        class, collective, or representative proceeding. If this class waiver is found
        unenforceable, the rest of this section still applies. You may opt out of this
        arbitration agreement by emailing hello@cappedoutlabs.com within 30 days of first
        accepting these Terms.
      </p>

      <h3 className="font-semibold text-navy pt-2">16. Governing Law</h3>
      <p>These Terms are governed by the laws of the State of Utah, without regard to
        conflict-of-law principles. Subject to Section 15, the courts located in Utah
        have exclusive jurisdiction.</p>

      <h3 className="font-semibold text-navy pt-2">17. Termination</h3>
      <p>We may restrict or terminate your access to the website at any time, without
        notice, for any lawful reason.</p>

      <h3 className="font-semibold text-navy pt-2">18. Force Majeure</h3>
      <p>We are not liable for any failure or delay caused by events beyond our
        reasonable control, including acts of God, outages, or third-party service
        failures.</p>

      <h3 className="font-semibold text-navy pt-2">19. General</h3>
      <p>If any provision is held unenforceable, the rest stays in effect. These Terms,
        together with any executed service contract, are the entire agreement between you
        and us. We may assign these Terms; you may not assign them without our consent.
        Our failure to enforce any provision is not a waiver.</p>

      <h3 className="font-semibold text-navy pt-2">20. Changes to Terms</h3>
      <p>We may update these Terms. Continued use after changes means you accept the
        revised Terms.</p>

      <h3 className="font-semibold text-navy pt-2">21. Contact</h3>
      <p>
        <strong>Email:</strong> hello@cappedoutlabs.com<br />
        <strong>Company:</strong> Capped Out Media LLC (dba Capped Out Labs)
      </p>
    </>
  );
}
