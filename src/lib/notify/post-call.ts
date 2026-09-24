// What the poll cron does with one appointment on one cycle. Pure so it can be
// unit tested without GHL (tests/post-call.test.ts); no imports on purpose.
//
// History: until 2026-09-24 an appointment still sitting at "confirmed" 30
// minutes after its start was treated as a probable no-show and the lead got
// "if we missed each other, grab a new time". Nobody ever marks appointments
// in GHL (17 of 17 past discovery calls were still "confirmed"), so every lead
// whose call HAPPENED got that text too. Patrick Hall at Élan Flowers got it
// half an hour after a good call with Beau, with a proposal on the way.
//
// The rule now: the lead only hears "we missed you" after a human marks the
// appointment no-show. An unmarked appointment past its start pings the team on
// Telegram with a one-tap Showed / No-show link instead. Silence is the safe
// default: a missed no-show costs one follow-up text, a wrong one costs a deal.

export const HOUR = 60 * 60 * 1000;
export const MINUTE = 60 * 1000;

// Windows are ranges (not instants) so a send blocked by quiet hours or a
// transient failure retries on later cycles until the window closes; the
// state key prevents doubles once one send succeeds.
export const REM24_WINDOW: [number, number] = [20 * HOUR, 24 * HOUR]; // time until start
export const REM1_WINDOW: [number, number] = [15 * MINUTE, 1 * HOUR];
export const NOSHOW_WINDOW: [number, number] = [0, 48 * HOUR]; // time since start
// Ask the team for an outcome once the call should be over (30 min slots).
export const DISPOSITION_WINDOW: [number, number] = [30 * MINUTE, 48 * HOUR];

export type AppointmentAction =
  | "reminder24h"
  | "reminder1h"
  | "noShowRecovery"
  | "askDisposition"
  | null;

export function appointmentAction(
  status: string,
  startMs: number,
  now: number
): AppointmentAction {
  if (!startMs) return null;
  const untilStart = startMs - now;
  const sinceStart = now - startMs;

  if (status === "confirmed") {
    if (untilStart > REM24_WINDOW[0] && untilStart <= REM24_WINDOW[1]) return "reminder24h";
    if (untilStart > REM1_WINDOW[0] && untilStart <= REM1_WINDOW[1]) return "reminder1h";
    if (sinceStart > DISPOSITION_WINDOW[0] && sinceStart <= DISPOSITION_WINDOW[1]) {
      return "askDisposition";
    }
    return null;
  }
  if (status === "noshow") {
    if (sinceStart > NOSHOW_WINDOW[0] && sinceStart <= NOSHOW_WINDOW[1]) return "noShowRecovery";
    return null;
  }
  // showed, cancelled, invalid, anything unknown: the engine stays quiet.
  return null;
}

// Pipeline stages a discovery call can still move forward FROM. "Showed" lifts
// a deal out of these into Discovery Held; a deal already further along
// (Proposal Sent, Negotiation, Won, Lost) is never dragged backwards.
export const PRE_CALL_STAGES = ["Applied", "Qualified", "Discovery Booked"];
export const HELD_STAGE = "Discovery Held";

export function stageAfterShowed(currentStageName: string | null): string | null {
  if (currentStageName && !PRE_CALL_STAGES.includes(currentStageName)) return null;
  return HELD_STAGE;
}
