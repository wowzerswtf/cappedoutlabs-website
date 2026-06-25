"use client";

import { useState } from "react";
import { LegalModal, PrivacyContent, TermsContent } from "@/components/LegalModal";

/**
 * Reusable TCPA / communications consent checkbox.
 *
 * The visible label matches CONSENT_TEXT in src/lib/consent.ts word-for-word, so
 * what the user sees is exactly what gets stored as their consent record. The
 * "Terms" and "Privacy Policy" words open the full legal modals in place.
 *
 * Always render this required and unchecked by default — the form should block
 * submission until `checked` is true.
 */
export function ConsentCheckbox({
  checked,
  onChange,
  id = "tcpa-consent",
  className = "",
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  id?: string;
  className?: string;
}) {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <>
      <div className={`flex items-start gap-2 ${className}`}>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-electric focus:ring-electric"
        />
        <label htmlFor={id} className="text-xs text-text-secondary leading-relaxed">
          Call, text, or send the AI, whatever&apos;s fastest. I give Capped Out
          Media LLC my prior express written consent to contact me at this number
          via automated technology, AI or prerecorded voice, and SMS. Not required
          to buy; reply STOP to opt out. Msg &amp; data rates may apply. I agree to
          the{" "}
          <button
            type="button"
            onClick={() => setTermsOpen(true)}
            className="underline underline-offset-2 hover:text-navy"
          >
            Terms
          </button>{" "}
          and{" "}
          <button
            type="button"
            onClick={() => setPrivacyOpen(true)}
            className="underline underline-offset-2 hover:text-navy"
          >
            Privacy Policy
          </button>
          .
        </label>
      </div>

      <LegalModal
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        title="Terms of Service"
      >
        <TermsContent />
      </LegalModal>
      <LegalModal
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="Privacy Policy"
      >
        <PrivacyContent />
      </LegalModal>
    </>
  );
}
