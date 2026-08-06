// Sales team roster + lead ownership assignment.
//
// Every new lead gets an owner at creation (GHL contact assignedTo) so texts
// are always signed by a real closer and the CRM never has orphan leads.
// Assignment is a deterministic hash of the email — stateless, no counter to
// race on, and the same lead always lands on the same closer even if they
// apply twice. Reps can reassign manually in GHL; intake code never
// overwrites an existing owner.
//
// Roster changes: edit this list (GHL user ids from GET /users).

export interface Closer {
  userId: string;
  name: string;
}

export const CLOSERS: Closer[] = [
  { userId: "xkcOVaSKgQpaogdq591u", name: "Santos Gonzalez" },
  { userId: "y59n4ohDyxLJlRuoK2IT", name: "Beau Burke" },
];

export function pickCloser(email: string): Closer {
  let h = 0;
  for (const ch of email.toLowerCase()) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return CLOSERS[h % CLOSERS.length];
}

export function closerByUserId(userId?: string | null): Closer | null {
  return CLOSERS.find((c) => c.userId === userId) ?? null;
}
