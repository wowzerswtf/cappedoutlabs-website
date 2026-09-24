// One-tap call outcome for the sales team. The poll cron posts a signed link
// to Telegram once a discovery call should be over; this page asks "Showed or
// No-show?" and writes the answer back to GHL.
//
//   Showed  -> appointment "showed", deal moves to Discovery Held (never
//              backwards), and no automated text follows.
//   No-show -> appointment "noshow"; the next poll cycle sends the lead the
//              "grab a new time" recovery text.
//
// GET only renders the question. The write happens on POST so Telegram's link
// preview or any prefetcher can never mark an appointment by opening it.

import { NextResponse } from "next/server";
import { verifyDisposition } from "@/lib/notify/disposition-link";
import {
  advanceOpportunityStage,
  fetchAppointment,
  fetchContact,
  setAppointmentStatus,
} from "@/lib/notify/ghl";
import { stageAfterShowed } from "@/lib/notify/post-call";
import { escapeHtml, sendTelegram } from "@/lib/notify/telegram";
import { formatWhen, timezoneForContact } from "@/lib/notify/sms";

export const dynamic = "force-dynamic";

const OUTCOMES: Record<string, string> = { showed: "Showed", noshow: "No-show" };

function page(title: string, body: string, status = 200): Response {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml(title)}</title>
<style>
:root{--background:#ffffff;--foreground:#0F172A;--primary:#1a3a5c;--primary-foreground:#ffffff;--muted:#F8FAFC;--muted-foreground:#64748B;--accent:#2563EB;--border:#e2e8f0}
*{box-sizing:border-box}
html,body{overflow-x:clip}
body{margin:0;background:var(--background);color:var(--foreground);font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
main{max-width:28rem;margin:0 auto;padding:2rem 1rem}
h1{font-size:1.35rem;margin:0 0 .25rem;overflow-wrap:anywhere}
p{margin:.25rem 0;color:var(--muted-foreground);overflow-wrap:anywhere}
form{display:grid;gap:.75rem;margin-top:1.5rem}
button{min-height:48px;border-radius:.6rem;font:600 1rem system-ui,sans-serif;cursor:pointer;border:1px solid var(--border)}
button[value=showed]{background:var(--primary);color:var(--primary-foreground);border-color:var(--primary)}
button[value=noshow]{background:var(--muted);color:var(--foreground)}
button:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.note{margin-top:1.25rem;font-size:.9rem}
</style></head>
<body><main id="main">${body}</main></body></html>`;
  return new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

async function describe(id: string) {
  const appt = await fetchAppointment(id);
  if (!appt) return null;
  const contact = appt.contactId ? await fetchContact(appt.contactId) : null;
  const name =
    [contact?.firstName, contact?.lastName].map((s) => (s ?? "").trim()).filter(Boolean).join(" ") ||
    appt.title ||
    "this lead";
  const startMs = new Date(appt.startTime ?? 0).getTime();
  const when = startMs ? formatWhen(startMs, contact ? timezoneForContact(contact) : null) : "";
  const status = (appt.appointmentStatus || appt.status || "").toLowerCase();
  return { appt, contact, name, when, status };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") ?? "";
  const sig = url.searchParams.get("sig") ?? "";
  if (!verifyDisposition(id, sig)) return page("Link expired", "<h1>This link is not valid.</h1>", 403);

  const info = await describe(id);
  if (!info) return page("Not found", "<h1>That appointment no longer exists in GHL.</h1>", 404);

  const already = OUTCOMES[info.status];
  return page(
    "Call outcome",
    `<h1>Did ${escapeHtml(info.name)} show?</h1>
<p>${escapeHtml(info.when)}</p>
${already ? `<p>Currently marked <strong>${already}</strong>. You can change it.</p>` : ""}
<form method="post">
<input type="hidden" name="id" value="${escapeHtml(id)}">
<input type="hidden" name="sig" value="${escapeHtml(sig)}">
<button name="outcome" value="showed">Showed, we had the call</button>
<button name="outcome" value="noshow">No-show, text them to rebook</button>
</form>
<p class="note">Showed stops every automated follow-up for this call. No-show sends one rebook text.</p>`
  );
}

export async function POST(request: Request) {
  const form = await request.formData();
  const id = String(form.get("id") ?? "");
  const sig = String(form.get("sig") ?? "");
  const outcome = String(form.get("outcome") ?? "");
  if (!verifyDisposition(id, sig)) return page("Link expired", "<h1>This link is not valid.</h1>", 403);
  if (!OUTCOMES[outcome]) return page("Pick one", "<h1>Pick Showed or No-show.</h1>", 400);

  const info = await describe(id);
  if (!info) return page("Not found", "<h1>That appointment no longer exists in GHL.</h1>", 404);

  try {
    await setAppointmentStatus(id, outcome);
  } catch (err) {
    console.error(`disposition: set ${outcome} on ${id} failed:`, err);
    return page(
      "Not saved",
      `<h1 role="alert">GHL did not save that.</h1><p>Go back and try again, or mark it in GHL directly.</p>`,
      502
    );
  }

  let stage: string | null = null;
  if (outcome === "showed" && info.appt.contactId) {
    try {
      stage = await advanceOpportunityStage(info.appt.contactId, stageAfterShowed);
    } catch (err) {
      console.error(`disposition: stage move for ${info.appt.contactId} failed:`, err);
    }
  }

  await sendTelegram(
    outcome === "showed"
      ? `✅ <b>${escapeHtml(info.name)}</b> marked showed${stage ? `, deal moved to ${escapeHtml(stage)}` : ""}. No automated follow-up will go out.`
      : `❌ <b>${escapeHtml(info.name)}</b> marked no-show. The rebook text goes out on the next check (within 5 minutes, outside quiet hours).`
  ).catch((err) => console.error("disposition: telegram confirm failed:", err));

  return page(
    "Saved",
    `<h1>Saved: ${OUTCOMES[outcome]}</h1>
<p>${escapeHtml(info.name)}${info.when ? `, ${escapeHtml(info.when)}` : ""}</p>
<p>${
      outcome === "showed"
        ? `No automated follow-up will go out for this call.${stage ? ` Deal moved to ${escapeHtml(stage)}.` : ""}`
        : "They get one rebook text on the next check, within 5 minutes (outside quiet hours)."
    }</p>`
  );
}
