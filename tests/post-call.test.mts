// Run: npm test   (node's built-in runner, TypeScript via type stripping)
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  HOUR,
  MINUTE,
  appointmentAction,
  stageAfterShowed,
} from "../src/lib/notify/post-call.ts";

const now = Date.UTC(2026, 8, 24, 16, 0);
const at = (offsetMs: number) => now + offsetMs; // appointment start

test("the Patrick case: a confirmed call that already happened never texts the lead", () => {
  for (const since of [31 * MINUTE, 2 * HOUR, 24 * HOUR, 47 * HOUR]) {
    assert.equal(appointmentAction("confirmed", at(-since), now), "askDisposition");
  }
});

test("showed calls are silent forever", () => {
  for (const since of [-23 * HOUR, -30 * MINUTE, 5 * MINUTE, 31 * MINUTE, 3 * HOUR, 40 * HOUR]) {
    assert.equal(appointmentAction("showed", at(-since), now), null);
  }
});

test("only an explicit no-show gets the rebook text, inside 48h", () => {
  assert.equal(appointmentAction("noshow", at(-10 * MINUTE), now), "noShowRecovery");
  assert.equal(appointmentAction("noshow", at(-47 * HOUR), now), "noShowRecovery");
  assert.equal(appointmentAction("noshow", at(-49 * HOUR), now), null);
  assert.equal(appointmentAction("noshow", at(2 * HOUR), now), null); // future: not a no-show
});

test("reminders still fire for upcoming confirmed calls", () => {
  assert.equal(appointmentAction("confirmed", at(22 * HOUR), now), "reminder24h");
  assert.equal(appointmentAction("confirmed", at(30 * MINUTE), now), "reminder1h");
  assert.equal(appointmentAction("confirmed", at(5 * HOUR), now), null);
});

test("no outcome ask while the call may still be running, or once it is stale", () => {
  assert.equal(appointmentAction("confirmed", at(-10 * MINUTE), now), null);
  assert.equal(appointmentAction("confirmed", at(-30 * MINUTE), now), null);
  assert.equal(appointmentAction("confirmed", at(-49 * HOUR), now), null);
});

test("cancelled, invalid, unknown, and missing start times do nothing", () => {
  assert.equal(appointmentAction("cancelled", at(-HOUR), now), null);
  assert.equal(appointmentAction("invalid", at(22 * HOUR), now), null);
  assert.equal(appointmentAction("unknown", at(-HOUR), now), null);
  assert.equal(appointmentAction("confirmed", 0, now), null);
});

test("showed moves a deal to Discovery Held, never backwards", () => {
  assert.equal(stageAfterShowed("Discovery Booked"), "Discovery Held");
  assert.equal(stageAfterShowed("Applied"), "Discovery Held");
  assert.equal(stageAfterShowed(null), "Discovery Held");
  assert.equal(stageAfterShowed("Discovery Held"), null);
  assert.equal(stageAfterShowed("Proposal Sent"), null);
  assert.equal(stageAfterShowed("Closed Won"), null);
});
