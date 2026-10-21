// Turns a VSL script into the on-screen cards of a text-on-black video.
//
// The Labs VSLs are white sentences on a black frame with a voiceover (see
// Vimeo 1180565378). One card per spoken chunk keeps the voice and the text in
// sync without word-level alignment: each card's audio is generated on its own
// and the card stays up for exactly as long as that audio plays.
//
// Pure: no I/O, so tests/vsl-cards.test.mts pins the behaviour.
import type { ScriptSection } from "./funnels/own";

export interface VslCard {
  /** 1-based position in the video. */
  index: number;
  /** 0-based beat the card belongs to (OWN_VSL_SCRIPT section). */
  beat: number;
  /** The editor's cue for that beat, carried along for the render log. */
  cue: string;
  /** 1-based paragraph of the script the card was cut from. The voice is
   *  generated per paragraph and split back into cards, so this is the join. */
  paragraph: number;
  /** Exactly what is spoken and shown. */
  text: string;
}

/** A card longer than this is split at a clause break before it is spoken. */
export const MAX_CARD_CHARS = 185;
/** Neighbouring short sentences are merged while the result stays under this. */
export const MERGE_UP_TO_CHARS = 115;

/** Sentence boundary: terminal punctuation followed by whitespace and a capital
 *  letter, digit, quote or dollar sign. "Mr. Smith" is not in the script, so the
 *  simple rule holds; the tests guard the script's actual sentences. */
const SENTENCE_END = /(?<=[.!?])\s+(?=["'$A-Z0-9])/;

export function splitSentences(paragraph: string): string[] {
  return paragraph
    .split(SENTENCE_END)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Split one long sentence at the clause break closest to its middle. */
export function splitLong(sentence: string, max = MAX_CARD_CHARS): string[] {
  if (sentence.length <= max) return [sentence];
  const breaks: number[] = [];
  for (const m of sentence.matchAll(/[,;:]\s/g)) breaks.push(m.index! + 1);
  if (breaks.length === 0) return [sentence];
  const mid = sentence.length / 2;
  const at = breaks.reduce((best, b) => (Math.abs(b - mid) < Math.abs(best - mid) ? b : best));
  const head = sentence.slice(0, at).trim();
  const tail = sentence.slice(at).trim();
  return [...splitLong(head, max), ...splitLong(tail, max)];
}

/** Greedily merge short neighbours ("You pay for a CRM. A scheduler.") so the
 *  voice does not stop and restart on three-word cards. */
export function mergeShort(chunks: string[], upTo = MERGE_UP_TO_CHARS): string[] {
  const out: string[] = [];
  for (const chunk of chunks) {
    const prev = out[out.length - 1];
    if (prev !== undefined && prev.length + 1 + chunk.length <= upTo) {
      out[out.length - 1] = `${prev} ${chunk}`;
    } else {
      out.push(chunk);
    }
  }
  return out;
}

export function buildCards(script: ScriptSection[]): VslCard[] {
  const cards: VslCard[] = [];
  let paragraph = 0;
  script.forEach((section, beat) => {
    for (const text of section.paragraphs) {
      paragraph++;
      const chunks = mergeShort(splitSentences(text).flatMap((s) => splitLong(s)));
      for (const chunk of chunks) {
        cards.push({ index: cards.length + 1, beat, cue: section.cue, paragraph, text: chunk });
      }
    }
  });
  return cards;
}

export interface VslParagraph {
  /** 1-based, matches VslCard.paragraph. */
  index: number;
  beat: number;
  /** Exactly what the voice reads in one take. */
  text: string;
}

/** The script's paragraphs in order: one TTS take each. */
export function buildParagraphs(script: ScriptSection[]): VslParagraph[] {
  const out: VslParagraph[] = [];
  script.forEach((section, beat) => {
    for (const text of section.paragraphs) out.push({ index: out.length + 1, beat, text });
  });
  return out;
}

/** Every word of the script, in order, with whitespace collapsed. Used by the
 *  tests to prove the cards drop nothing and add nothing. */
export function scriptWords(script: ScriptSection[]): string {
  return script
    .flatMap((s) => s.paragraphs)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
