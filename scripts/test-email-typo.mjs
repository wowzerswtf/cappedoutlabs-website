// Run: node scripts/test-email-typo.mjs   (Node 24 strips the .ts types natively)
import { correctEmailDomain } from "../src/lib/email-typo.ts";

const SHOULD_FIX = [
  ["ynosinte20@gmaill.com", "ynosinte20@gmail.com"],
  ["a@gmial.com", "a@gmail.com"],
  ["a@gmai.com", "a@gmail.com"],
  ["a@gmail.co", "a@gmail.com"],
  ["a@gmail.con", "a@gmail.com"],
  ["a@gnail.com", "a@gmail.com"],
  ["a@gamil.com", "a@gmail.com"],
  ["a@hotmial.com", "a@hotmail.com"],
  ["a@hotmai.com", "a@hotmail.com"],
  ["a@hotmail.co", "a@hotmail.com"],
  ["a@yahooo.com", "a@yahoo.com"],
  ["a@yaho.com", "a@yahoo.com"],
  ["a@yahoo.con", "a@yahoo.com"],
  ["a@aol.co", "a@aol.com"],
  ["a@aoll.com", "a@aol.com"],
  ["a@outlok.com", "a@outlook.com"],
  ["a@icould.com", "a@icloud.com"],
  ["a@comcast.com", "a@comcast.net"],
  ["Some.One+tag@GMAILL.COM", "Some.One+tag@gmail.com"],  // local part + case preserved
  ["a@gmaol.com", "a@gmail.com"],
  ["a@hotmaul.com", "a@hotmail.com"],
];

const SHOULD_NOT_FIX = [
  "a@gmail.com", "a@yahoo.com", "a@hotmail.com", "a@aol.com", "a@icloud.com",
  "lumnijek@man.com",          // REAL domain, 1 edit from msn.com
  "a@mail.com", "a@msn.com", "a@mac.com", "a@me.com", "a@gmx.com", "a@aim.com",
  "erin@hillrecovery.com",      // corporate
  "waynard@cappedoutmedia.com",
  "a@cappedoutlabs.com",
  "a@stripe.com", "a@vercel.com", "a@acme.io", "a@some-random-biz.net",
  "a@ymail.com", "a@live.com", "a@proton.me", "a@zoho.com",
  "asdfsd@sdfsd.com",           // junk, but not a near-miss — don't guess
  "a@googlemail.com",
  "a@sbcglobal.net", "a@bellsouth.net", "a@optonline.net",
  "", null, undefined, "notanemail", "@gmaill.com", "a@", "a@nodot",
];

let pass = 0, fail = 0;
for (const [input, expected] of SHOULD_FIX) {
  const r = correctEmailDomain(input);
  if (r?.corrected === expected) { pass++; }
  else { fail++; console.log(`FAIL fix: ${input} -> ${r?.corrected ?? "null"} (expected ${expected})`); }
}
for (const input of SHOULD_NOT_FIX) {
  const r = correctEmailDomain(input);
  if (r === null) { pass++; }
  else { fail++; console.log(`FAIL untouched: ${input} -> ${r.corrected} (should be left alone)`); }
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
