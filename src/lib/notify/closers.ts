// Sales team roster + lead ownership assignment.
//
// Every new lead gets an owner at creation (GHL contact assignedTo) so texts
// are always signed by a real closer and the CRM never has orphan leads.
//
// Ownership model (Waynard 2026-08-10): Beau dials the whole inbound book, so
// intake hands every new application and partial to him instead of rotating
// across the roster. Calendar bookings still rotate — that's GHL calendar
// config, not this file, and the appointment assignee still wins when a text
// is signed for a booked lead. Reps can reassign manually in GHL; intake never
// overwrites an existing owner.
//
// Roster changes: edit this list (GHL user ids from GET /users).
// Back to rotation: point INTAKE_CLOSER_ID at nothing and swap
// `intakeCloser()` for the commented hash below.

export interface Closer {
  userId: string;
  name: string;
}

export const CLOSERS: Closer[] = [
  { userId: "xkcOVaSKgQpaogdq591u", name: "Santos Gonzalez" },
  { userId: "y59n4ohDyxLJlRuoK2IT", name: "Beau Burke" },
];

/** Who owns every new lead. Env override so a swap needs no deploy. */
const INTAKE_CLOSER_ID =
  process.env.INTAKE_CLOSER_USER_ID || "y59n4ohDyxLJlRuoK2IT";

/**
 * Owner for a brand-new lead. Falls back to the first roster entry if the
 * configured id ever stops matching, because an unowned contact means an
 * unsigned text and an orphan in the CRM.
 */
export function intakeCloser(): Closer {
  return CLOSERS.find((c) => c.userId === INTAKE_CLOSER_ID) ?? CLOSERS[0];
}

// Rotation, kept for the day the book gets split again — a deterministic hash
// of the email, so the same lead always lands on the same closer:
//   let h = 0;
//   for (const ch of email.toLowerCase()) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
//   return CLOSERS[h % CLOSERS.length];

export function closerByUserId(userId?: string | null): Closer | null {
  return CLOSERS.find((c) => c.userId === userId) ?? null;
}
