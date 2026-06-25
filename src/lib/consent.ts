// Single source of truth for the TCPA / communications consent language.
//
// The text below is shown next to the consent checkbox on every form that
// collects a phone number, and the exact same string is stored with each
// submission (plus timestamp, IP, and user-agent) as the record of what the
// person agreed to. If you change the wording, bump CONSENT_VERSION so older
// records stay traceable to the language that was actually shown.

export const CONSENT_VERSION = "2026-06-25";

export const CONSENT_TEXT =
  "Call, text, or send the AI, whatever's fastest. I give Capped Out Media LLC my prior express written consent to contact me at this number via automated technology, AI or prerecorded voice, and SMS. Not required to buy; reply STOP to opt out. Msg & data rates may apply. I agree to the Terms and Privacy Policy.";
