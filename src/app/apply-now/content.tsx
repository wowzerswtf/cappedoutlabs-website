"use client";

import { useRef, useState, useEffect, type FormEvent } from "react";
import { CalendarEmbed } from "@/components/CalendarEmbed";
import { LegalModal, PrivacyContent, TermsContent } from "@/components/LegalModal";
import { CONSENT_TEXT, CONSENT_VERSION } from "@/lib/consent";
import { metaTrack, newMetaEventId } from "@/lib/meta/client";
import "./apply-now.css";

// 1:1 rebuild of the ad landing page the media team ran on cappedoutlab.com
// (typo domain, off our infrastructure). Markup and styles are ported
// verbatim from that page; the form now actually posts to /api/apply
// (GHL contact + tags + notes + Telegram DM + Meta events) and qualified
// applicants get the GHL calendar on the success screen. Deviations from the
// original: TCPA consent language (shown == stored, per compliance), and
// Terms/Privacy in the footer.

const TOTAL_STEPS = 3;

// Mirrors the vsl-b qualification rules: too-small revenue or no budget
// gets captured for nurture, not booked.
function isDisqualified(data: Record<string, string>) {
  return (
    data.annualRevenue === "Under $500K" ||
    data.budgetReadiness === "Not ready right now"
  );
}

const consentParts = CONSENT_TEXT.split("Terms and Privacy Policy");

export function ApplyNowContent() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [disqualified, setDisqualified] = useState(false);
  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLElement>(null);
  const partialSent = useRef(false);

  useEffect(() => {
    if (submitted) {
      successRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [submitted]);

  function readForm(): Record<string, string> {
    const data: Record<string, string> = {};
    if (!formRef.current) return data;
    new FormData(formRef.current).forEach((value, key) => {
      data[key] = String(value);
    });
    return data;
  }

  function validateStep(current: number) {
    const stepEl = formRef.current?.querySelector(`.form-step[data-step="${current}"]`);
    if (!stepEl) return true;
    const controls = [...stepEl.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea")]
      .filter((control) => control.name !== "companyFax");
    const invalid = controls.find((control) => !control.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      setError("Please complete the required fields.");
      return false;
    }
    return true;
  }

  function goTo(next: number) {
    setStep(next);
    setError("");
    setStatus("");
    window.setTimeout(() => {
      const firstControl = formRef.current
        ?.querySelector(`.form-step[data-step="${next}"]`)
        ?.querySelector<HTMLElement>("input:not([type='checkbox']), select, textarea");
      firstControl?.focus({ preventScroll: true });
    }, 50);
  }

  function handleContinue() {
    if (!validateStep(step)) return;

    // Step 1 complete = contact captured. Same fire-and-forget partial
    // capture the main /apply form uses (GHL contact + PartialLead CAPI).
    if (step === 0 && !partialSent.current) {
      partialSent.current = true;
      const data = readForm();
      const nameParts = (data.fullName || "").trim().split(/\s+/);
      fetch("/api/apply/partial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: (data.email || "").trim(),
          phone: (data.phone || "").trim(),
          consent: data.consent === "on",
          consentLanguage: CONSENT_TEXT,
          consentVersion: CONSENT_VERSION,
          consentTimestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    }

    goTo(Math.min(step + 1, TOTAL_STEPS - 1));
    setStatus("Progress saved");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateStep(step)) return;
    if (step < TOTAL_STEPS - 1) {
      handleContinue();
      return;
    }

    const data = readForm();

    // Honeypot: bots that fill the fax field get a fake success and no API call
    if ((data.companyFax || "").trim()) {
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    setError("");

    const nameParts = (data.fullName || "").trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ");
    const email = (data.email || "").trim();
    const phone = (data.phone || "").trim();
    const dq = isDisqualified(data);
    const metaEventId = newMetaEventId();

    const website = (data.website || "").trim();
    const normalizedWebsite = website && !/^https?:\/\//i.test(website) ? `https://${website}` : website;

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metaEventId,
          pageUrl: window.location.href,
          firstName,
          lastName,
          email,
          phone,
          businessName: (data.businessName || "").trim(),
          annualRevenue: data.annualRevenue || "",
          bottleneck: (data.bottleneck || "").trim(),
          aiHistory: (data.aiHistory || "").trim(),
          referralSource: "Apply Now Page",
          message: `Apply Now Page Application\n\nBusiness: ${data.businessName || "N/A"}\nWebsite: ${normalizedWebsite || "N/A"}\nAnnual Revenue: ${data.annualRevenue || "N/A"}\nTeam Size: ${data.teamSize || "N/A"}\nInvestment Readiness: ${data.budgetReadiness || "N/A"}\nBiggest Bottleneck: ${data.bottleneck || "N/A"}\nAI History: ${data.aiHistory || "N/A"}`,
          disqualified: dq,
          consent: data.consent === "on",
          consentLanguage: CONSENT_TEXT,
          consentVersion: CONSENT_VERSION,
          consentTimestamp: new Date().toISOString(),
          source: "apply-now",
        }),
      });

      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.error || "We could not submit your application. Please try again.");
      }

      if (!dq) {
        // Lead is what our ad sets optimize on (dedupes with the CAPI twin);
        // SubmitApplication matches what the original page fired.
        metaTrack("Lead", { source: "apply-now" }, metaEventId);
        metaTrack("SubmitApplication", { content_name: "Capped Out Labs Application" }, metaEventId);
      }

      setContact({ firstName, lastName, email, phone });
      setDisqualified(dq);
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "We could not submit your application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="aln">
        <header className="site-header">
          <a className="brand" href="#top" aria-label="Capped Out Labs home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" width={34} height={34} />
            <span>Capped Out Labs</span>
          </a>
          <nav aria-label="Primary navigation">
            <a href="#approach">Approach</a>
            <a href="#services">Services</a>
            <a className="button button-small" href="#apply">Apply now</a>
          </nav>
        </header>

        <main id="top">
          <section className="hero">
            <div className="hero-media" aria-hidden="true">
              <div className="signal signal-one"></div>
              <div className="signal signal-two"></div>
              <div className="signal signal-three"></div>
              <div className="grid-lines"></div>
            </div>
            <div className="hero-content">
              <p className="eyebrow">From the team behind Capped Out Media</p>
              <h1>We build AI into how your company runs.</h1>
              <p className="hero-copy">
                Practical revenue systems that remove repetitive work, sharpen
                decisions, and keep getting more valuable as your company grows.
              </p>
              <div className="hero-actions">
                <a className="button" href="#apply">Apply for a discovery call</a>
                <a className="text-link" href="#approach">See how it works <span>↓</span></a>
              </div>
            </div>
          </section>

          <section className="proof-band" aria-label="Company results">
            <div><strong>$2B+</strong><span>Revenue scaled</span></div>
            <div><strong>200+</strong><span>Systems launched</span></div>
            <div><strong>30+</strong><span>Verticals</span></div>
            <div><strong>47 days</strong><span>Average first system</span></div>
          </section>

          <section className="split-section" id="approach">
            <div>
              <p className="eyebrow">The operating gap</p>
              <h2>AI should change the work, not add another tool.</h2>
            </div>
            <div className="body-copy">
              <p>
                Most AI projects stop at a deck, a prototype, or a login nobody
                remembers. We start with the revenue constraint and build the
                working system around it.
              </p>
              <p>
                The result is infrastructure your team can actually operate:
                documented, measured, and integrated into the way the business
                already moves.
              </p>
            </div>
          </section>

          <section className="services" id="services">
            <div className="section-heading">
              <p className="eyebrow">What gets built</p>
              <h2>Revenue infrastructure, not experiments.</h2>
            </div>
            <div className="service-grid">
              <article>
                <span className="service-number">01</span>
                <h3>Revenue workflow automation</h3>
                <p>Lead handling, follow-up, qualification, sales support, and reporting built around one measurable outcome.</p>
              </article>
              <article>
                <span className="service-number">02</span>
                <h3>Internal AI systems</h3>
                <p>Secure tools that give your team faster access to company knowledge, decisions, and repeatable execution.</p>
              </article>
              <article>
                <span className="service-number">03</span>
                <h3>Managed implementation</h3>
                <p>Production deployment, staff training, documentation, and a handoff that does not depend on us forever.</p>
              </article>
            </div>
          </section>

          <section className="application-section" id="apply" hidden={submitted}>
            <div className="application-intro">
              <p className="eyebrow">Discovery call</p>
              <h2>Tell us where the business is capped out.</h2>
              <p>
                We review every application. If there is a strong fit, you can book
                a 30-minute discovery call on the next screen.
              </p>
              <ul>
                <li>No pitch deck</li>
                <li>No obligation</li>
                <li>Limited engagements per quarter</li>
              </ul>
            </div>

            <form id="application-form" noValidate ref={formRef} onSubmit={handleSubmit}>
              <div className="progress" aria-label="Application progress">
                <span className={step >= 0 ? "active" : ""}></span>
                <span className={step >= 1 ? "active" : ""}></span>
                <span className={step >= 2 ? "active" : ""}></span>
              </div>

              <section className={`form-step${step === 0 ? " active" : ""}`} data-step="0">
                <div className="form-heading">
                  <span>Step 1 of 3</span>
                  <h3>About you</h3>
                </div>
                <label>
                  Full name
                  <input name="fullName" autoComplete="name" required />
                </label>
                <div className="two-column">
                  <label>
                    Work email
                    <input name="email" type="email" autoComplete="email" required />
                  </label>
                  <label>
                    Phone
                    <input name="phone" type="tel" autoComplete="tel" required />
                  </label>
                </div>
                <label className="consent">
                  <input name="consent" type="checkbox" required />
                  <span>
                    {consentParts[0]}
                    <button type="button" className="legal-link" onClick={() => setTermsOpen(true)}>Terms</button>
                    {" and "}
                    <button type="button" className="legal-link" onClick={() => setPrivacyOpen(true)}>Privacy Policy</button>
                    .
                  </span>
                </label>
              </section>

              <section className={`form-step${step === 1 ? " active" : ""}`} data-step="1">
                <div className="form-heading">
                  <span>Step 2 of 3</span>
                  <h3>Your business</h3>
                </div>
                <label>
                  Business name
                  <input name="businessName" autoComplete="organization" required />
                </label>
                <label>
                  Website
                  <input
                    name="website"
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="yourcompany.com"
                  />
                </label>
                <div className="two-column">
                  <label>
                    Annual revenue
                    <select name="annualRevenue" required defaultValue="">
                      <option value="">Select</option>
                      <option>Under $500K</option>
                      <option>$500K-$1M</option>
                      <option>$1M-$3M</option>
                      <option>$3M-$10M</option>
                      <option>$10M-$50M</option>
                      <option>$50M+</option>
                    </select>
                  </label>
                  <label>
                    Team size
                    <select name="teamSize" required defaultValue="">
                      <option value="">Select</option>
                      <option>Solo</option>
                      <option>2-5</option>
                      <option>6-15</option>
                      <option>16-50</option>
                      <option>50+</option>
                    </select>
                  </label>
                </div>
                <label>
                  Investment readiness
                  <select name="budgetReadiness" required defaultValue="">
                    <option value="">Select</option>
                    <option>Budget is approved and ready</option>
                    <option>I need to see the plan first</option>
                    <option>Not ready right now</option>
                  </select>
                </label>
              </section>

              <section className={`form-step${step === 2 ? " active" : ""}`} data-step="2">
                <div className="form-heading">
                  <span>Step 3 of 3</span>
                  <h3>The opportunity</h3>
                </div>
                <label>
                  What is the biggest bottleneck in the business?
                  <textarea name="bottleneck" rows={5} required></textarea>
                </label>
                <label>
                  What have you already tried with AI?
                  <textarea name="aiHistory" rows={3}></textarea>
                </label>
                <label className="honeypot" aria-hidden="true">
                  Company fax
                  <input name="companyFax" tabIndex={-1} autoComplete="off" />
                </label>
              </section>

              <p className="form-status" id="form-status" role="status" aria-live="polite">{status}</p>
              <p className="form-error" id="form-error" role="alert" aria-live="assertive">{error}</p>
              <div className="form-actions">
                <button
                  className="button-secondary"
                  id="back-button"
                  type="button"
                  hidden={step === 0}
                  onClick={() => goTo(Math.max(step - 1, 0))}
                >
                  Back
                </button>
                <button
                  className="button"
                  id="next-button"
                  type="button"
                  hidden={step === TOTAL_STEPS - 1}
                  onClick={handleContinue}
                >
                  Continue
                </button>
                <button
                  className="button"
                  id="submit-button"
                  type="submit"
                  hidden={step !== TOTAL_STEPS - 1}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit application"}
                </button>
              </div>
            </form>
          </section>

          <section
            className={`success-section${submitted && !disqualified ? " has-calendar" : ""}`}
            id="success"
            hidden={!submitted}
            ref={successRef}
          >
            <div className="success-mark">✓</div>
            <p className="eyebrow">Application received</p>
            {submitted && !disqualified ? (
              <>
                <h2>You&rsquo;re a fit. Book your call.</h2>
                <p className="success-copy">
                  Pick a time below for your 30-minute discovery call. No pitch
                  deck, no obligation.
                </p>
                <div className="success-calendar">
                  <CalendarEmbed
                    id="apply-now"
                    firstName={contact.firstName}
                    lastName={contact.lastName}
                    email={contact.email}
                    phone={contact.phone}
                  />
                </div>
              </>
            ) : (
              <>
                <h2>Thank you. We&rsquo;ll review this personally.</h2>
                <p className="success-copy">
                  You&rsquo;ll hear from the Capped Out Labs team with the next step.
                </p>
              </>
            )}
          </section>
        </main>

        <footer>
          <div>
            <strong>Capped Out Labs</strong>
            <span>A Capped Out Media company</span>
          </div>
          <div>
            <p>&copy; {new Date().getFullYear()} Capped Out Media LLC. All rights reserved.</p>
            <div className="legal-nav">
              <button type="button" onClick={() => setTermsOpen(true)}>Terms of Service</button>
              <button type="button" onClick={() => setPrivacyOpen(true)}>Privacy Policy</button>
            </div>
          </div>
        </footer>
      </div>

      <LegalModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} title="Privacy Policy">
        <PrivacyContent />
      </LegalModal>
      <LegalModal open={termsOpen} onClose={() => setTermsOpen(false)} title="Terms of Service">
        <TermsContent />
      </LegalModal>
    </>
  );
}
