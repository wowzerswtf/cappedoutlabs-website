// Mistyped free-mail domains.
//
// Applicants fat-finger their own email constantly, and a single character
// costs the whole lead: ynosinte20@gmaill.com bounced on 2026-08-04 and that
// lead was unreachable by email from then on. These are always typos — nobody
// owns gmaill.com and hands it out.
//
// The bar for rewriting somebody's contact record is high, so this only fires
// on domains it is certain about:
//   1. a curated map of known misspellings, and
//   2. edit-distance-1 against a long free-mail domain, which is only consulted
//      when the domain isn't a real one we recognize.
// Anything corporate, unfamiliar, or merely unusual is left alone. A missed
// typo costs one lead; a wrong "correction" silently mails a stranger.

/** Real domains that must never be rewritten, including near-collisions. */
const PROTECTED = new Set([
  // Genuine mail providers that sit close to popular ones.
  "man.com", // real (mail.com family) — 1 edit from msn.com
  "mail.com",
  "msn.com",
  "mac.com",
  "me.com",
  "gmx.com",
  "gmx.net",
  "aim.com",
  "web.de",
  "gmx.de",
  "inbox.com",
  "email.com",
  "usa.com",
  "europe.com",
  "post.com",
  "London.com".toLowerCase(),
  // The canonical set itself.
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "ymail.com",
  "rocketmail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "aol.com",
  "icloud.com",
  "protonmail.com",
  "proton.me",
  "zoho.com",
  "comcast.net",
  "verizon.net",
  "att.net",
  "sbcglobal.net",
  "bellsouth.net",
  "cox.net",
  "charter.net",
  "earthlink.net",
  "juno.com",
  "roadrunner.com",
  "optonline.net",
  "frontier.com",
  "windstream.net",
]);

/** Long enough that a single-character difference is unambiguous. */
const FUZZY_TARGETS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "ymail.com",
  "rocketmail.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "protonmail.com",
  "comcast.net",
  "verizon.net",
  "sbcglobal.net",
  "bellsouth.net",
  "earthlink.net",
  "roadrunner.com",
  "optonline.net",
  "windstream.net",
];

/**
 * Curated misspellings. Covers the ones distance-1 can't reach safely —
 * doubled letters, transpositions, and mangled TLDs on short domains.
 */
const KNOWN: Record<string, string> = {
  // gmail
  "gmaill.com": "gmail.com", "gmial.com": "gmail.com", "gmai.com": "gmail.com",
  "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmail.cm": "gmail.com",
  "gmail.om": "gmail.com", "gmail.comm": "gmail.com", "gmail.cim": "gmail.com",
  "gmail.vom": "gmail.com", "gmail.xom": "gmail.com", "gmail.ocm": "gmail.com",
  "gnail.com": "gmail.com", "gmall.com": "gmail.com", "gamil.com": "gmail.com",
  "gmali.com": "gmail.com", "gmeil.com": "gmail.com", "gmil.com": "gmail.com",
  "ggmail.com": "gmail.com", "gmaol.com": "gmail.com", "gmauk.com": "gmail.com",
  "grmail.com": "gmail.com", "gmailc.om": "gmail.com", "gmaik.com": "gmail.com",
  "gmsil.com": "gmail.com", "gmakl.com": "gmail.com", "gmauil.com": "gmail.com",
  "gmaill.co": "gmail.com", "emails.com": "gmail.com",
  // hotmail
  "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com",
  "hotmaill.com": "hotmail.com", "hotmil.com": "hotmail.com",
  "hotmail.co": "hotmail.com", "hotmail.con": "hotmail.com",
  "hotmail.cm": "hotmail.com", "hotmail.om": "hotmail.com",
  "hotamil.com": "hotmail.com", "hltmail.com": "hotmail.com",
  "hotnail.com": "hotmail.com", "homail.com": "hotmail.com",
  "hoymail.com": "hotmail.com", "hotmaul.com": "hotmail.com",
  // yahoo
  "yahooo.com": "yahoo.com", "yaho.com": "yahoo.com", "yahoo.co": "yahoo.com",
  "yahoo.con": "yahoo.com", "yahoo.cm": "yahoo.com", "yahoo.om": "yahoo.com",
  "yhoo.com": "yahoo.com", "yahho.com": "yahoo.com", "uahoo.com": "yahoo.com",
  "tahoo.com": "yahoo.com", "yahoi.com": "yahoo.com", "yajoo.com": "yahoo.com",
  "yahoo.comm": "yahoo.com", "ahoo.com": "yahoo.com", "yagoo.com": "yahoo.com",
  // aol — short, so every variant is spelled out rather than fuzzed
  "aol.co": "aol.com", "aol.con": "aol.com", "aol.cm": "aol.com",
  "aol.om": "aol.com", "aoll.com": "aol.com", "ail.com": "aol.com",
  "aol.comm": "aol.com", "aoi.com": "aol.com", "aol.vom": "aol.com",
  // outlook
  "outlok.com": "outlook.com", "outllok.com": "outlook.com",
  "outlook.co": "outlook.com", "outlook.con": "outlook.com",
  "outook.com": "outlook.com", "putlook.com": "outlook.com",
  "outlokk.com": "outlook.com", "oultook.com": "outlook.com",
  "outlook.cm": "outlook.com", "outlook.om": "outlook.com",
  // icloud
  "icloud.co": "icloud.com", "icloud.con": "icloud.com",
  "iclould.com": "icloud.com", "icould.com": "icloud.com",
  "iclod.com": "icloud.com", "icloude.com": "icloud.com",
  "icloud.cm": "icloud.com", "icloud.om": "icloud.com",
  // live / msn
  "live.co": "live.com", "live.con": "live.com", "livr.com": "live.com",
  // comcast / verizon
  "comcast.com": "comcast.net", "comcast.ner": "comcast.net",
  "verizon.com": "verizon.net", "sbcglobal.com": "sbcglobal.net",
  "bellsouth.com": "bellsouth.net",
};

/** Levenshtein, bailing out as soon as it exceeds `max`. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const v = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      row.push(v);
      if (v < best) best = v;
    }
    if (best > max) return max + 1;
    prev = row;
  }
  return prev[b.length];
}

export interface EmailCorrection {
  original: string;
  corrected: string;
  fromDomain: string;
  toDomain: string;
  /** "known" = curated map, "fuzzy" = single-character distance match. */
  via: "known" | "fuzzy";
}

/**
 * Returns a correction only when the domain is confidently a typo of a popular
 * mail provider, otherwise null. The local part is never touched.
 */
export function correctEmailDomain(email: string | null | undefined): EmailCorrection | null {
  if (!email) return null;
  const trimmed = email.trim();
  const at = trimmed.lastIndexOf("@");
  if (at <= 0 || at === trimmed.length - 1) return null;

  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1).toLowerCase();
  if (!domain.includes(".")) return null;
  if (PROTECTED.has(domain)) return null;

  const known = KNOWN[domain];
  if (known) {
    return { original: trimmed, corrected: `${local}@${known}`, fromDomain: domain, toDomain: known, via: "known" };
  }

  // Only guess on domains long enough that one character can't be meaningful.
  if (domain.length < 8) return null;
  let match: string | null = null;
  for (const target of FUZZY_TARGETS) {
    if (editDistance(domain, target, 1) <= 1) {
      // Two plausible targets means it isn't obvious — leave it alone.
      if (match) return null;
      match = target;
    }
  }
  if (!match) return null;
  return { original: trimmed, corrected: `${local}@${match}`, fromDomain: domain, toDomain: match, via: "fuzzy" };
}
