"use client";

import { useState } from "react";
import { VSLSurvey } from "@/components/VSLSurvey";
import { LegalModal, PrivacyContent, TermsContent } from "@/components/LegalModal";
import "./apply-now.css";

// 1:1 rebuild of the ad landing page the media team ran on cappedoutlab.com
// (typo domain, off our infrastructure — its form posted to a dead endpoint).
// Markup and styles are ported verbatim from that page. Intake is the proven
// vsl-b flow: every Apply CTA pops the VSLSurvey modal, which qualifies the
// lead, posts to /api/apply, and shows the GHL calendar to qualified
// applicants. Terms/Privacy open in accessible modals from the footer.

export function ApplyNowContent() {
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const openSurvey = () => setSurveyOpen(true);

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
            <button className="button button-small" type="button" onClick={openSurvey}>
              Apply now
            </button>
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
                <button className="button" type="button" onClick={openSurvey}>
                  Apply for a discovery call
                </button>
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

          <section className="application-section" id="apply">
            <div className="application-intro">
              <p className="eyebrow">Discovery call</p>
              <h2>Tell us where the business is capped out.</h2>
              <p>
                We review every application. If there is a strong fit, you can book
                a 30-minute discovery call the moment you finish.
              </p>
              <ul>
                <li>No pitch deck</li>
                <li>No obligation</li>
                <li>Limited engagements per quarter</li>
              </ul>
            </div>

            <div className="apply-card">
              <div className="form-heading">
                <span>2-minute application</span>
                <h3>Start your application</h3>
              </div>
              <p className="apply-card-copy">
                A few quick questions about you and the business, then your
                contact details. Qualified applicants pick a call time on the
                spot.
              </p>
              <button className="button apply-card-button" type="button" onClick={openSurvey}>
                Start your application
              </button>
            </div>
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

      {/* Rendered outside .aln so the scoped landing-page CSS cannot touch them */}
      <VSLSurvey
        open={surveyOpen}
        onClose={() => setSurveyOpen(false)}
        source="apply-now"
        referralSource="Apply Now Page"
      />
      <LegalModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} title="Privacy Policy">
        <PrivacyContent />
      </LegalModal>
      <LegalModal open={termsOpen} onClose={() => setTermsOpen(false)} title="Terms of Service">
        <TermsContent />
      </LegalModal>
    </>
  );
}
